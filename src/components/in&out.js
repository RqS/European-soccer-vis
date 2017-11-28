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
	
	var color = d3.scaleOrdinal(d3.schemeCategory10);

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
		for (s in selected_seasons) {
			var temp = {};
			temp.season = selected_seasons[s];
			for (c in selected_countries) {
				temp[selected_countries[c]] = {"total":0, "sell":0, "buy":0, "domestic":0};
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
						var index = selected_seasons.indexOf(season);
						if (selected_countries.indexOf(record["moving from"].country) > -1 && +
							selected_countries.indexOf(record["moving from"].country) == selected_countries.indexOf(record["moving to"].country)) {
							map_transfer_value[index][record["moving from"].country].total += fee;
							map_transfer_value[index][record["moving from"].country].domestic += fee;
						}
						
						else {
							if (selected_countries.indexOf(record["moving from"].country) > -1) {  // If the country in our selected range
								map_transfer_value[index][record["moving from"].country].total += fee;
								map_transfer_value[index][record["moving from"].country].sell += fee;
							}
	
							if (selected_countries.indexOf(record["moving to"].country) > -1) {  // If the country in our selected range
								map_transfer_value[index][record["moving to"].country].total += fee;
								map_transfer_value[index][record["moving to"].country].buy += fee;
							}
						}	
					}	
				}
			}
		}

		return map_transfer_value;
	}

	var active_link = "0"; //to control legend selections and hover
	var legendClicked; //to control legend selections
	var legendClassArray = []; //store legend classes to select bars in plotSingle()
	var y_orig; //to store original y-posn

	function plot_bar(data) {
		x0.domain(selected_seasons);
		x1.domain(selected_countries).rangeRound([0, x0.bandwidth()]);
		y.domain([0, d3.max(data, function(d) { return d3.max(selected_countries, function(key) { return d[key][option]; }); })]).nice();
	  
		season_based = svg.append("g")
			.selectAll("g")
		  	.data(data)
		  	.enter().append("g")

		season_based.attr("transform", function(d) { return "translate(" + x0(d.season) + ",0)"; })
			.selectAll("rect")
		  	.data(function(d) {
				return selected_countries.map(function(country) {
					return {season: d.season, key: country, value: d[country][option]}; 
				}); 
			})
			.enter().append("rect")
			.attr("class", function(d) {
				var year = d.season.split('/')[0];
				return "class_" + d.key + " class_" + year;
			})
			.attr("x", function(d) { return x1(d.key); })
			.attr("y", function(d) { return y(d.value); })
			.attr("width", x1.bandwidth())
			.attr("height", function(d) { return height - y(d.value); })
			.attr("fill", function(d) { return color(d.key); })
			.on("mouseover", function() {
				tooltip.style("display", null); 
				if (active_link === "0") {
					d3.select(this).style("cursor", "pointer"); }
				else {
					if (active_link === d3.select(this).attr("class").split(" ")[0].split("class_").pop()) {
						d3.select(this).style("cursor", "pointer");
					} else 
						d3.select(this).style("cursor", "auto");
				}
			})
			.on("mouseout", function() { tooltip.style("display", "none"); })
			.on("mousemove", function(d) {
				var xPosition = parseInt(d3.select(this).attr("x")) + 10;
				var yPosition = parseInt(d3.select(this).attr("y")) + 5;
				// tooltip.style("left", xPosition + "px");
				// tooltip.style("top", yPosition + "px");
				tooltip.attr("transform", "translate(" + (xPosition + x0(d.season)) + "," + yPosition + ")");
				tooltip.select("text").text(d.key + ":" + d.value);
				console.log(d, xPosition, yPosition);
			})
			.on("click", function(d) {
				if (active_link === "0") { //nothing selected, turn on this selection
					active_link = d3.select(this).attr("class").split(" ")[0].split("class_").pop();
					plotSingle(active_link);

					d3.select("#id-" + active_link)           
						.style("stroke", "black")
					  	.style("stroke-width", 2);
		
					//gray out the others
					for (i = 0; i < selected_countries.length; i++) {
						if (selected_countries[i] != active_link) {
							d3.select("#id-" + selected_countries[i])
							.style("opacity", 0.5);
						}
					}	 
				}
				else {  //deactive
					// thisCountry = d3.select(this).attr("class").split(" class_")[0].split("class_").pop(); // The block that mouse move over
					// if (active_link === thisCountry) {//active square selected; turn it OFF
					d3.select("#id-" + active_link)
						.style("stroke", "none")
					
					thisCountry = active_link;		
					active_link = "0"; //reset
		
					//restore remaining boxes to normal opacity
					for (i = 0; i < selected_countries.length; i++) {              
						d3.select("#id-" + selected_countries[i])
							.style("opacity", 1);
					}
		
					//restore plot to original
					restorePlot(thisCountry);
					// }
				}
			});
			// .on("click", BarTransition);
			// .on("mouseover", function(d) {
			// 	/* Get this bar's x/y values, then augment for the tooltip */
			// 	var xPosition = d3.select(this).attr("x");
			// 		yPosition = d3.select(this).attr("y");
				
			// 	console.log("I'm selected!", xPosition);
			// 	d3.select(".tooltip1").classed("tooltip-left", false).classed("tooltip-right", true);
			// 	/* Update the tooltip position and value */
			// 	d3.select(".tooltip1")
			// 		.style("left", xPosition + "px")
			// 		.style("top", yPosition + "px")
			// 		.select(".value")
			// 		.text(d.key + ":" + d.value);
				
			// 	/* Show the tooltip */
			// 	d3.select(".tooltip1").classed("hidden", false);
			// })
			// .on("mouseout", function() {
			// 	/* Hide the tooltip */
			// 	d3.select(".tooltip1").classed("hidden", true);			
			// });
		
		// function BarTransition() {

		// }
	  
		// Add x axis
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x0));
	  
		// Add y axis
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
			.attr("text-anchor", "start")
			.attr("class", "legend")
			.selectAll("g")
			.data(selected_countries.slice())
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(20," + i * 20 + ")"; });
	  
		legend.append("rect")
			.attr("x", width - 19)
			.attr("width", 19)
			.attr("height", 19)
			.attr("fill", color)
			.attr("id", function (d, i) {
				return "id-" + d;
			})
			.on("mouseover",function(){        
				if (active_link === "0") {
					d3.select(this).style("cursor", "pointer"); }
				else {
					if (active_link === this.id.split("id-").pop()) {
						d3.select(this).style("cursor", "pointer");
					} else 
						d3.select(this).style("cursor", "auto");
				}
			})
			.on("click", function(d) {
				if (active_link === "0") { //nothing selected, turn on this selection
					d3.select(this)           
						.style("stroke", "black")
					  	.style("stroke-width", 2);

					active_link = this.id.split("id-").pop();
					plotSingle(active_link);
		
					//gray out the others
					for (i = 0; i < selected_countries.length; i++) {
						if (selected_countries[i] != active_link) {
							d3.select("#id-" + selected_countries[i])
							.style("opacity", 0.5);
						}
					}	 
				}
				else {  //deactive
					if (active_link === this.id.split("id-").pop()) {//active square selected; turn it OFF
						d3.select(this)           
						  .style("stroke", "none");
			
						active_link = "0"; //reset
			
						//restore remaining boxes to normal opacity
						for (i = 0; i < selected_countries.length; i++) {              
							d3.select("#id-" + selected_countries[i])
							  .style("opacity", 1);
						}
			
						//restore plot to original
						restorePlot(d);
					}
				}
			});
	  
		legend.append("text")
			.attr("x", width + 5)
			.attr("y", 9.5)
			.attr("dy", "0.32em")
			.text(function(d) { return d; });
		
		function plotSingle(country) {
			// index = selected_countries.indexOf(country);
			for (i = 0; i < selected_countries.length; i++) {
				if (selected_countries[i] != country) {
					d3.selectAll(".class_" + selected_countries[i])
					.transition()
					.duration(1000)          
					.style("display", "none");
				}
			}

			d3.selectAll(".class_" + country)
				.transition()
				.duration(1000)
				.delay(250)
				.attr("x", x1(selected_countries[1]))
				.attr("width", function(d) {
					return x0.bandwidth() * 0.8;
				});
		}

		function restorePlot(country) {
			index = selected_countries.indexOf(country);
			d3.selectAll(".class_" + country)
				.transition()
				.duration(1000)
				.attr("x", x1(selected_countries[index]))
				.attr("width", function(d) {
					return x1.bandwidth();
			});

			for (i = 0; i < selected_countries.length; i++) {
				if (selected_countries[i] != country) {
					d3.selectAll(".class_" + selected_countries[i])
					.transition()
					.duration(1000)
					.delay(250)          
					.style("display", null);
				}
			}
		}
	}

	// Prep the tooltip bits, initial display is hidden
	var tooltip = svg.append("g")
		.attr("class", "tooltip_inout")
		.style("display", "none");
      
	tooltip.append("rect")
		.attr("width", 120)
		.attr("height", 20)
		.attr("fill", "yellow")
		.style("opacity", 0.5);
	
	tooltip.append("text")
		.attr("x", 0)
		.attr("dy", "1.2em")
		.style("text-anchor", "start")
		.attr("font-size", "12px")
		.attr("font-weight", "bold");

	
}
