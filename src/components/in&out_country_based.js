function showTotalTransferInAndOutValue(option){
	var margin = { top: 50, left: 100, bottom: 75, right: 150 };
    var width = window.innerWidth - margin.left - margin.right;
	var height = window.innerHeight - margin.top - margin.bottom;
	
	var svg = d3.select("#inandoutdiv").append("svg")
		.attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
		.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
		
	var x0 = d3.scaleBand()
		.rangeRound([0, width])
		.paddingInner(0.1);
	
	var x1 = d3.scaleBand()
		.padding(0.05);
	
	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var color = d3.scaleOrdinal(d3.schemeSpectral[9]);

	d3.json('../../resource/player_data.json', function (error, data) {
		if (error) {
			throw error;
		}
		selected_countries = ["England", "France", "Germany", "Italy", "Netherlands", "Portugal", "Spain", "Turkey"];
		selected_seasons = ["09/10", "10/11", "11/12", "12/13", "13/14", "14/15", "15/16", "16/17", "17/18"];

		var country_market_value = process_data(data); 

		plot_bar(country_market_value);
	});

	// Result's structure:
	// [
	//     {
	//         season:season1
	//         country1:{ total:value_t, sell:value_s, buy:value_b },
	//         country2:{ total:value_t, sell:value_s, buy:value_b },
	//         ...
	//     },
	//     {
	//         season:season2
	//         country1:{ total:value_t, sell:value_s, buy:value_b },
	//         country2:{ total:value_t, sell:value_s, buy:value_b },
	//         ...
	//     }
	//     ...
	// 	   { ... }
	// ]
	function process_data(data) {
		var map_transfer_value = [];
		for (c in selected_countries) {
			var temp = {};
			temp.country = selected_countries[c];
			for (s in selected_seasons) {
				temp[selected_seasons[s]] = {"total":0, "sell":0, "buy":0, "domestic":0};
			}
			map_transfer_value.push(temp);
		}
		// console.log(map_transfer_value);

		for (i in data) {
			var list_transfer_history = data[i]["transfer history"];
			if (list_transfer_history.length != 0) {
				for (x in list_transfer_history) {
					var record = list_transfer_history[x];
					var season = record["season"];
					var fee = parseInt(record["transfer fee"]);

					if (selected_seasons.indexOf(season) > -1) {  // If the season in our selected range
						// var index = selected_seasons.indexOf(season);
						if (selected_countries.indexOf(record["moving from"].country) > -1 && +
							selected_countries.indexOf(record["moving from"].country) == selected_countries.indexOf(record["moving to"].country)) {
							var index = selected_countries.indexOf(record["moving from"].country);
							// console.log(index, record["moving from"].country, season);
							map_transfer_value[index][season].total += fee;
							map_transfer_value[index][season].domestic += fee;
						}
						
						else {
							if (selected_countries.indexOf(record["moving from"].country) > -1) {  // If the country in our selected range
								var index = selected_countries.indexOf(record["moving from"].country);
								map_transfer_value[index][season].total += fee;
								map_transfer_value[index][season].sell += fee;
							}
	
							if (selected_countries.indexOf(record["moving to"].country) > -1) {  // If the country in our selected range
								var index = selected_countries.indexOf(record["moving to"].country);
								map_transfer_value[index][season].total += fee;
								map_transfer_value[index][season].buy += fee;
							}
						}	
					}	
				}
			}
		}

		return map_transfer_value;
	}

	function plot_bar(data) {
		x0.domain(selected_countries);
		x1.domain(selected_seasons).rangeRound([0, x0.bandwidth()]);
		y.domain([0, d3.max(data, function(d) { return d3.max(selected_seasons, function(key) { return d[key][option]; }); })]).nice();
	  
		svg.append("g")
			.selectAll("g")
		  	.data(data)
		  	.enter().append("g")
			.attr("transform", function(d) { console.log(d); return "translate(" + x0(d.country) + ",0)"; })
		  	.selectAll("rect")
		  	.data(function(d) {
				return selected_seasons.map(function(season) {
					return {key: season, value: d[season][option]}; 
				}); 
			})
		  	.enter().append("rect")
			.attr("x", function(d) { return x1(d.key); })
			.attr("y", function(d) { return y(d.value); })
			.attr("width", x1.bandwidth())
			.attr("height", function(d) { return height - y(d.value); })
			.attr("fill", function(d) { return color(d.key); });
	  
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x0));
	  
		svg.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y).tickFormat(d3.formatPrefix(".0", 1e6)))
		  	.append("text")
			.attr("x", 2)
			.attr("y", y(y.ticks().pop()) + 0.5)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			.text("Transfer Fee (€)");
	  
		var legend = svg.append("g")
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.attr("text-anchor", "end")
			.selectAll("g")
			.data(selected_seasons.slice().reverse())
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	  
		legend.append("rect")
			.attr("x", width - 19)
			.attr("width", 19)
			.attr("height", 19)
			.attr("fill", color);
	  
		legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function(d) { return d; });
	}
}
