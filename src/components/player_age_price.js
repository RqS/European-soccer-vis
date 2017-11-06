function showPredictChart() {
    var margin = { top: 50, left: 75, bottom: 75, right: 50 };
    var width = 600 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#age_price").append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    // var striker, midfiled, defence, goalkeeper, ageArray;

    d3.json('../../resource/player_data.json', function (error, data) {
        var position_price = process_data(data); 

        plot_line(position_price);
    })

    function process_data(data) {
        var striker = data.filter( function (d) { return d.hasOwnProperty('position') && d.position.includes("Striker"); });
        var midfield = data.filter( function (d) { return d.hasOwnProperty('position') && d.position.includes("Midfield"); });
        var defence = data.filter( function (d) { return d.hasOwnProperty('position') && d.position.includes("Defence"); });
        var goalkeeper = data.filter( function (d) { return d.hasOwnProperty('position') && d.position.includes("Goalkeeper"); });

        lowAge = 18;
        highAge = 35;

        var striker_price = new Object(),
            midfield_price = new Object(),
            defence_price = new Object(),
            goalkeeper_price = new Object();

        striker_price["position"] = "striker";
        midfield_price["position"] = "midfield";
        defence_price["position"] = "defence";
        goalkeeper_price["position"] = "goalkeeper";

        for (var i = lowAge; i <= highAge; i++) {
            striker_price[i] = [];
            midfield_price[i] = [];
            defence_price[i] = [];
            goalkeeper_price[i] = [];
        }

        var x;
        for (x in striker) {
            player = striker[x];
            if (parseInt(player.age) >= lowAge && parseInt(player.age) <= highAge) {
                if (player.hasOwnProperty("current market value") && !player["current market value"].includes("unknown")) {
                    striker_price[parseInt(player.age)].push(parseInt(player["current market value"]));
                }                     
            }
        }

        for (x in midfield) {
            player = midfield[x]
            if (parseInt(player.age) >= lowAge && parseInt(player.age) <= highAge) {
                if (player.hasOwnProperty("current market value") && !player["current market value"].includes("unknown")) {
                    midfield_price[parseInt(player.age)].push(parseInt(player["current market value"]));
                }
            }
        }

        for (x in defence) {
            player = defence[x]
            if (parseInt(player.age) >= lowAge && parseInt(player.age) <= highAge) {
                if (player.hasOwnProperty("current market value") && !player["current market value"].includes("unknown")) {
                    defence_price[parseInt(player.age)].push(parseInt(player["current market value"]));
                }          
            }
        }

        for (x in goalkeeper) {
            player = goalkeeper[x]
            if (parseInt(player.age) >= lowAge && parseInt(player.age) <= highAge) {
                if (player.hasOwnProperty("current market value") && !player["current market value"].includes("unknown")) {
                    goalkeeper_price[parseInt(player.age)].push(parseInt(player["current market value"]));
                }    
            }
        }

        for (var i = lowAge; i <= highAge; i++) {
            if (striker_price[i].length > 0) { striker_price[i] = getAvg(striker_price[i]); }
            else { striker_price[i] = 0; }

            if (midfield_price[i].length > 0) { midfield_price[i] = getAvg(midfield_price[i]); }
            else { midfield_price[i] = 0; }

            if (defence_price[i].length > 0) { defence_price[i] = getAvg(defence_price[i]); }
            else { defence_price[i] = 0; }

            if (goalkeeper_price[i].length > 0) { goalkeeper_price[i] = getAvg(goalkeeper_price[i]); }
            else { goalkeeper_price[i] = 0; }
        }

        var avg_price = [striker_price, midfield_price, defence_price, goalkeeper_price];

        return avg_price;
     
    }

    var getAvg = function (prices) {
        var total = prices.reduce(function (a, b) {
          return a + b;
        });
        return total / prices.length;
      }

    var getSum = function (total, num) {  // Get summation of an array
        return total + num;
    }

    function plot_line(data) {
        var ageArray = []
        var price_list = []
        for (i = lowAge; i <= highAge; i++) { 
            ageArray.push(i);
            for (d in data) {
                price_list.push(data[d][i]);
            }
        }

        var minPrice = d3.min(price_list),
            maxPrice = d3.max(price_list);

        // Set the ranges
        var xScale = d3.scaleBand()
            .domain(ageArray)
            .range([0, width]);  // x scale

        var yScale = d3.scaleLinear()
            .domain([minPrice, maxPrice])
            .range([height, margin.top]); // y scale

        // var minPrice = d3.min(data, function (d) {
        //     price_list = []
        //     for (i = lowAge; i<= highAge; i++) {
        //         price_list.push(d[i])
        //     }
        //     return d3.min(price_list);
        // })

        // var maxPrice = d3.max(data, function (d) {
        //     return d3.max(Object.values(d));
        // })

        console.log('min and max:', minPrice, maxPrice);

        var striker_line = d3.line()
            .x(function (d) { 
                if (d[0] != "position") {
                    return d[0]; 
                }
            })
            .y(function (d) { 
                if (d[0] != "position") {
                    return d[1]; 
                }
            });

        svg.append("path")
            .data(Object.entries(data[0]))
            .attr("class", "line")
            .attr("d", striker_line);
            
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));
        
    }
}