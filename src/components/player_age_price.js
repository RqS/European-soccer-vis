function showPredictChart() {
    var margin = { top: 50, left: 100, bottom: 75, right: 150 };
    var width = window.innerWidth - margin.left - margin.right;
    var height = window.innerHeight - margin.top - margin.bottom;

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

        striker_price["general"] = new Object();
        // striker_price["Striker - Left Wing"] = new Object();
        // striker_price["Striker - Centre-Forward"] = new Object();
        // striker_price["Striker - Right Wing"] = new Object();
        // striker_price["Striker - Secondary Striker"] = new Object();
        midfield_price["general"] = new Object();
        defence_price["general"] = new Object();
        goalkeeper_price["general"] = new Object();

        for (var i = lowAge; i <= highAge; i++) {
            striker_price.general[i] = [];
            midfield_price.general[i] = [];
            defence_price.general[i] = [];
            goalkeeper_price.general[i] = [];
        }

        var x;
        for (x in striker) {
            player = striker[x];
            if (parseInt(player.age) >= lowAge && parseInt(player.age) <= highAge) {
                if (player.hasOwnProperty("current market value") && !player["current market value"].includes("unknown")) {
                    if (striker_price.hasOwnProperty(player.position)) {
                        if (striker_price[player.position].hasOwnProperty(parseInt(player.age))) {
                            striker_price[player.position][parseInt(player.age)].push(parseInt(player["current market value"]));
                        } else {
                            striker_price[player.position][parseInt(player.age)] = [parseInt(player["current market value"])];
                        }                  
                    }
                    else {
                        striker_price[player.position] = new Object();
                        striker_price[player.position][parseInt(player.age)] = [parseInt(player["current market value"])];
                    }
                    striker_price.general[parseInt(player.age)].push(parseInt(player["current market value"]));
                }                     
            }
        }

        for (x in midfield) {
            player = midfield[x]
            if (parseInt(player.age) >= lowAge && parseInt(player.age) <= highAge) {
                if (player.hasOwnProperty("current market value") && !player["current market value"].includes("unknown")) {
                    if (midfield_price.hasOwnProperty(player.position)) {
                        if (midfield_price[player.position].hasOwnProperty(parseInt(player.age))) {
                            midfield_price[player.position][parseInt(player.age)].push(parseInt(player["current market value"]));
                        } else {
                            midfield_price[player.position][parseInt(player.age)] = [parseInt(player["current market value"])];
                        } 
                    } 
                    else {
                        midfield_price[player.position] = new Object();
                        midfield_price[player.position][parseInt(player.age)]= [parseInt(player["current market value"])];
                    }
                    midfield_price.general[parseInt(player.age)].push(parseInt(player["current market value"]));
                }
            }
        }

        for (x in defence) {
            player = defence[x]
            if (parseInt(player.age) >= lowAge && parseInt(player.age) <= highAge) {
                if (player.hasOwnProperty("current market value") && !player["current market value"].includes("unknown")) {
                    if (defence_price.hasOwnProperty(player.position)) {
                        if (defence_price[player.position].hasOwnProperty(parseInt(player.age))) {
                            defence_price[player.position][parseInt(player.age)].push(parseInt(player["current market value"]));
                        } else {
                            defence_price[player.position][parseInt(player.age)] = [parseInt(player["current market value"])];
                        }
                    }
                    else {
                        defence_price[player.position] = new Object();
                        defence_price[player.position][parseInt(player.age)] = [parseInt(player["current market value"])];
                    }
                    defence_price.general[parseInt(player.age)].push(parseInt(player["current market value"]));
                }          
            }
        }

        for (x in goalkeeper) {
            player = goalkeeper[x]
            if (parseInt(player.age) >= lowAge && parseInt(player.age) <= highAge) {
                if (player.hasOwnProperty("current market value") && !player["current market value"].includes("unknown")) {
                    // Goalkeeper only has one position called "goalkeeper", so it's same as general.
                    // if (goalkeeper_price.hasOwnProperty(player.position)) {
                    //     goalkeeper_price[player.position][parseInt(player.age)].push(parseInt(player["current market value"]));
                    // }
                    // else {
                    //     goalkeeper_price[player.position][parseInt(player.age)] = [(parseInt(player["current market value"]))];
                    // }
                    goalkeeper_price.general[parseInt(player.age)].push(parseInt(player["current market value"]));
                }    
            }
        }

        for (var i = lowAge; i <= highAge; i++) {
            // Calculate average price for striker
            for (x in striker_price) {
                if (!striker_price[x].hasOwnProperty(i) || striker_price[x][i].length == 0) { 
                    striker_price[x][i] = 0;
                }
                else {
                    if (i == 32 && x == "general") {
                        var index = striker_price[x][i].indexOf(100000000);
                        striker_price[x][i].splice(index, 1);
                    } 
                    striker_price[x][i] = getAvg(striker_price[x][i]); }
            }
            // if (striker_price[i].length > 0) { striker_price[i] = getAvg(striker_price[i]); }
            // else { striker_price[i] = 0; }

            // Calculate average price for midfield
            for (x in midfield_price) {
                if (!midfield_price[x].hasOwnProperty(i) || midfield_price[x][i].length == 0) {
                    midfield_price[x][i] = 0;
                }
                else { 
                    midfield_price[x][i] = getAvg(midfield_price[x][i]);
                }
            }

            // if (midfield_price[i].length > 0) { midfield_price[i] = getAvg(midfield_price[i]); }
            // else { midfield_price[i] = 0; }

            // Calculate average price for defence
            for (x in defence_price) {
                if (!defence_price[x].hasOwnProperty(i) || defence_price[x][i].length == 0) { 
                    defence_price[x][i] = 0;
                }
                else {
                    defence_price[x][i] = getAvg(defence_price[x][i]);
                }
            }

            // if (defence_price[i].length > 0) { defence_price[i] = getAvg(defence_price[i]); }
            // else { defence_price[i] = 0; }

            // Calculate average price for goalkeeper
            if (goalkeeper_price.general[i].length == 0) {
                goalkeeper_price.general[i] = 0;
            }
            else {
                goalkeeper_price.general[i] = getAvg(goalkeeper_price.general[i]);
            }
        }

        var avg_price = {"striker":striker_price, "midfield":midfield_price, "defence":defence_price, "goalkeeper":goalkeeper_price};

        return avg_price;
     
    }

    var getAvg = function (prices) {
        var total = prices.reduce(function (a, b) {
          return a + b;
        });
        return Math.round(total / prices.length);
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
                price_list.push(data[d].general[i]);
            }
        }

        var minPrice = d3.min(price_list),
            maxPrice = d3.max(price_list);

        // Set the ranges
        var xScale = d3.scaleLinear()
            .range([0, width])  
            .domain([lowAge, highAge]);// x scale

        var yScale = d3.scaleLinear()
            .range([height, margin.top]);
        yScale.domain([minPrice, maxPrice]); // y scale

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10),
            colorScale2 = d3.scaleOrdinal(d3.schemeCategory20b);

        var price_line = d3.line()
            // .curve(d3.curveBasis)
            .x(function (d) {
                return xScale(d[0]); 
            })
            .y(function (d) {                    
                return yScale(d[1]); 
            })
            .curve(d3.curveMonotoneX); // apply smoothing to the line

        var positionList = ["striker", "midfield", "defence", "goalkeeper"];
        var striker_position = ["Striker - Left Wing", "Striker - Right Wing", "Striker - Centre-Forward"],
            midfield_position = ["Midfield - Attacking Midfield", "Midfield - Central Midfield", "Midfield - Defensive Midfield"],
            defence_position = ["Defence - Centre-Back", "Defence - Left-Back", "Defence - Right-Back"];
        // Striker           
        svg.append("path")
            .data([Object.entries(data.striker.general)])
            .attr("class", "line")
            .attr("id", "striker")
            .attr("d", price_line)
            .style("stroke", colorScale2(0));
        
        svg.selectAll(".striker_dot")
            .data(Object.entries(data.striker.general))
            .enter().append("circle")
            .attr("class", "dot striker_dot")
            .attr("cx", function (d) { return xScale(d[0]); })
            .attr("cy", function (d) { return yScale(d[1]); })
            .attr("r", 5)
            .style("fill", colorScale2(0));
        
        svg.append("text")
            .attr("transform", function(d) { return "translate(" + xScale(highAge) + "," + yScale(data.striker.general[highAge]) + ")"; })
            .attr("class", "lineLabel striker_label")
            .attr("x", 5)
            .attr("dy", "-0.2em")
            .style("font", "12px sans-serif")
            .style("fill", colorScale2(0))
            .text("Striker");

        var striker_g = svg.append("g")
            .attr("class", "striker-g")
            .style("opacity", "0");

        for (i in striker_position) {
            striker_g.append("path")
                .data([Object.entries(data.striker[striker_position[i]])])
                .attr("class", "line striker_detail_line")
                .attr("d", price_line)
                .style("stroke", colorScale2(i + 1));

            striker_g.selectAll(".striker_detail_dot" + "i")
                .data(Object.entries(data.striker[striker_position[i]]))
                .enter().append("circle")
                .attr("class", "dot striker_detail_dot")
                .attr("cx", function (d) { return xScale(d[0]); })
                .attr("cy", function (d) { return yScale(d[1]); })
                .attr("r", 5)
                .style("fill", colorScale2(i + 1));
            
            striker_g.append("text")
                .datum([27, data.striker[striker_position[i]][27]])
                .attr("transform", function(d) { return "translate(" + xScale(highAge) + "," + yScale(data.striker[striker_position[i]][highAge]) + ")"; })
                .attr("class", "lineLabel striker_detail_label")
                .attr("x", 5)
                .attr("dy", "-0.2em")
                .style("font", "12px sans-serif")
                .style("fill", colorScale2(i + 1))
                .text(striker_position[i]);
        }

        // Midfield
        var midfield_g = svg.append("g")
            .attr("class", "midfield-g")
            .style("opacity", "0");

        svg.append("path")
            .data([Object.entries(data.midfield.general)])
            .attr("class", "line")
            .attr("id", "midfield")
            .attr("d", price_line)
            .style("stroke", colorScale2(4));
        
        svg.selectAll(".midfield_dot")
            .data(Object.entries(data.midfield.general))
            .enter().append("circle")
            .attr("class", "dot midfield_dot")
            .attr("cx", function (d) { return xScale(d[0]); })
            .attr("cy", function (d) { return yScale(d[1]); })
            .attr("r", 5)
            .style("fill", colorScale2(4));
        
        svg.append("text")
            // .datum({id: "Goalkeeper", value: data[3].general[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + xScale(highAge) + "," + yScale(data.midfield.general[highAge]) + ")"; })
            .attr("class", "lineLabel midfield_label")
            .attr("x", 5)
            .attr("dy", "1.2em")
            .style("font", "12px sans-serif")
            .style("fill", colorScale2(4))
            .text("Midfield");
        
        for (i in midfield_position) {
            midfield_g.append("path")
                .data([Object.entries(data.midfield[midfield_position[i]])])
                .attr("class", "line midfield_detail_line")
                .attr("d", price_line)
                .style("stroke", colorScale2(4 + i + 1));

            midfield_g.selectAll(".midfield_detail_dot" + "i")
                .data(Object.entries(data.midfield[midfield_position[i]]))
                .enter().append("circle")
                .attr("class", "dot midfield_detail_dot")
                .attr("cx", function (d) { return xScale(d[0]); })
                .attr("cy", function (d) { return yScale(d[1]); })
                .attr("r", 5)
                .style("fill", colorScale2(4 + i + 1));
            
            striker_g.append("text")
                .datum([27, data.midfield[midfield_position[i]][27]])
                .attr("transform", function(d) { return "translate(" + xScale(highAge) + "," + yScale(data.midfield[midfield_position[i]][highAge]) + ")"; })
                .attr("class", "lineLabel midfield_detail_label")
                .attr("x", 5)
                .attr("dy", "-0.2em")
                .style("font", "12px sans-serif")
                .style("fill", colorScale2(4 + i + 1))
                .text(midfield_position[i]);
        }
        
        // Defence
        var defence_g = svg.append("g")
            .attr("class", "defence-g")
            .style("opacity", "0");

        svg.append("path")
            .data([Object.entries(data.defence.general)])
            .attr("class", "line")
            .attr("id", "defence")
            .attr("d", price_line)
            .style("stroke", colorScale2(8));

        svg.selectAll(".defence_dot")
            .data(Object.entries(data.defence.general))
            .enter().append("circle")
            .attr("class", "dot defence_dot")
            .attr("cx", function (d) { return xScale(d[0]); })
            .attr("cy", function (d) { return yScale(d[1]); })
            .attr("r", 5)
            .style("fill", colorScale2(8));

        svg.append("text")
            .attr("transform", function(d) { return "translate(" + xScale(highAge) + "," + yScale(data.defence.general[highAge]) + ")"; })
            .attr("class", "lineLabel defence_label")
            .attr("x", 5)
            .attr("dy", "-0.3em")
            .style("font", "12px sans-serif")
            .style("fill", colorScale2(8))
            .text("Defence");

        for (i in defence_position) {
            defence_g.append("path")
                .data([Object.entries(data.defence[defence_position[i]])])
                .attr("class", "line defence_detail_line")
                .attr("d", price_line)
                .style("stroke", colorScale2(8 + i + 1));

            striker_g.selectAll(".defence_detail_dot" + "i")
                .data(Object.entries(data.defence[defence_position[i]]))
                .enter().append("circle")
                .attr("class", "dot defence_detail_dot")
                .attr("cx", function (d) { return xScale(d[0]); })
                .attr("cy", function (d) { return yScale(d[1]); })
                .attr("r", 5)
                .style("fill", colorScale2(8 + i + 1));
            
            striker_g.append("text")
                .datum([27, data.defence[defence_position[i]][27]])
                .attr("transform", function(d) { return "translate(" + xScale(highAge) + "," + yScale(data.defence[defence_position[i]][highAge]) + ")"; })
                .attr("class", "lineLabel defence_detail_label")
                .attr("x", 5)
                .attr("dy", "-0.2em")
                .style("font", "12px sans-serif")
                .style("fill", colorScale2(8 + i + 1))
                .text(defence_position[i]);
        }
        
        // Goalkeeper
        svg.append("path")
            .data([Object.entries(data.goalkeeper.general)])
            .attr("class", "line")
            .attr("id", "goalkeeper")
            .attr("d", price_line)
            .style("stroke", colorScale2(12));
            
        svg.selectAll(".goalkeeper_dot")
            .data(Object.entries(data.goalkeeper.general))
            .enter().append("circle")
            .attr("class", "dot goalkeeper_dot")
            .attr("cx", function (d) { return xScale(d[0]); })
            .attr("cy", function (d) { return yScale(d[1]); })
            .attr("r", 5)
            .style("fill", colorScale2(12));
        
        svg.append("text")
            // .datum({id: "Goalkeeper", value: data[3].general[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + xScale(highAge) + "," + yScale(data.goalkeeper.general[highAge]) + ")"; })
            .attr("class", "lineLabel goalkeeper_label")
            .attr("x", 5)
            .attr("dy", "0.35em")
            .style("font", "12px sans-serif")
            .style("fill", colorScale2(12))
            .text("Goalkeeper");
        
        // Color legend to show that which position the line belongs to.
        var legend_g = svg.append('g')
            .attr('class', 'legend-g');

        var legend = legend_g.selectAll('g')
            .data(Object.keys(data))
            .enter()
            .append('g')
            .attr('class', 'legend');
      
        var unit = 30;
        legend.append('rect')
            .attr('x', width - 60)
            .attr('y', function(d) {
                if (d == "striker") { return margin.top + 0 * unit; }
                else if (d == "midfield") { return margin.top + 1 * unit; }
                else if (d == "defence") { return margin.top + 2 * unit; }
                else { return margin.top + 3 * unit; }
            })
            .attr('width', 20)
            .attr('height', 20)
            .style('fill', function(d) {
                if (d == "striker") { return colorScale2(0); }
                else if (d == "midfield") { return colorScale2(4); }
                else if (d == "defence") { return colorScale2(8); }
                else { return colorScale2(12); }
            });
      
        legend.append('text')
            .attr('x', width - 35)
            .attr('y', function(d) {
                if (d == "striker") { return margin.top + 0 * unit + 15; }
                else if (d == "midfield") { return margin.top + 1 * unit + 15; }
                else if (d == "defence") { return margin.top + 2 * unit + 15; }
                else { return margin.top + 3 * unit + 15; }
            })
            .text(function(d) {
              return d;
            });
            
        // Add the X axis
        svg.append("g")
            .attr("class", "xAxis lineChart_axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("class", "axisLabel")
            .attr("x", width / 2 + 10)
            .attr("y", 30)
            .style("text-anchor", "middle")
            .text("Age");

        // Add the Y axis
        svg.append("g")
            .attr("class", "yAxis lineChart_axis")
            .call(d3.axisLeft(yScale).tickFormat(d3.format('.2s')))
            .append("text")
            .attr("class", "axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Market Price (£)");
        
        // Interactive effect
        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");
        
        // Focus line
        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);

        var interactive_display = function(pos) {
            var bisectDate = d3.bisector(function(d) { return d; }).left;  
            
            // Dynamic signal for x axis (age)
            svg.append("text")
                .attr("class", "age_dynamic")
                .attr("x", 9)
                .attr("y", margin.top + 15);
            
            var mousePerLine = focus.selectAll('.mouse-per-line')
                .data(function() {
                    if (pos == "general") { return positionList; }
                    else {
                        return Object.keys(data[pos]);
                    }
                })
                .enter()
                .append("g")
                .attr("class", "mouse-per-line");
            
            mousePerLine.exit()
                .transition()
                .remove();
        
            mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", "black")
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "0");

            mousePerLine.append("text")
                .attr("transform", "translate(10,2.5)")
                .style("opacity", "0")
                .style("font-size", "10px");
            
            
            // focus.append("circle")
            //     .attr("r", 7);
        
            // focus.append("text")
            //     .attr("x", 15)
            //     .attr("dy", ".3em");
        
            // Overlay to capture hover
            svg.append("rect")
                // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() {
                    d3.select(".hove-line")
                        .style("opacity", "1");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "1");
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", "1");
                    focus.style("display", null);  // change display back to default style (null is empty)
                    d3.select(".age_dynamic").style("opacity", "1");
                })
                .on("mouseout", function() {
                    d3.select(".hove-line")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", "0");
                    focus.style("display", "none");
                    d3.select(".age_dynamic").style("opacity", "0");
                })
                .on("mousemove", mousemove);
            
            function mousemove() {
                // Judge the correct position that mouse currently at
                var x0 = xScale.invert(d3.mouse(this)[0]),
                    i = bisectDate(ageArray, x0, 1),
                    d0 = ageArray[i - 1],
                    d1 = ageArray[i],
                    dx = x0 - d0 > d1 - x0 ? d1 : d0;
                    console.log(dx);
                
                if (pos == "general") {
                    var maxPrice = Math.max(data.striker.general[dx], data.midfield.general[dx], 
                        data.defence.general[dx], data.goalkeeper.general[dx]);
                }
                else {
                    var temp = [];
                    for (i in data[pos]) {
                        temp.push(data[pos][i][dx]);
                    }
                    var maxPrice = d3.max(temp);
                }
                
                focus.attr("transform", "translate(" + xScale(dx) + "," + yScale(maxPrice) + ")");

                d3.selectAll(".mouse-per-line")
                    .attr("transform", function(d) {
                        if (pos == "general") {
                            d3.select(this).select("text").text(data[d].general[dx]);
                            return "translate(" + 0 + "," + (yScale(data[d].general[dx]) - yScale(maxPrice)) +")";
                        }
                        else {
                            d3.select(this).select("text").text(data[pos][d][dx]);
                            return "translate(" + 0 + "," + (yScale(data[pos][d][dx]) - yScale(maxPrice)) +")";
                        }                
                });

                focus.select(".x-hover-line").attr("y2", height - yScale(maxPrice));
                console.log(height);
                console.log(maxPrice);
                
                focus.select(".y-hover-line").attr("x2", width + width);
                d3.select(".age_dynamic").text("Age: " + dx);
            }
        }
        interactive_display("general");

        // Change the plot to detail
        d3.selectAll("input").on("change", change);
        // var timeout = setTimeout(function() {
        //     d3.select("#radio1").property("checked", true).each(change);
        // }, 2000);

        function change() {
            // clearTimeout(timeout);
        
            position_selected = this.value;
            var t0 = svg.transition().duration(750);
            // First transition the line & label to the new position.
            if (position_selected == "general") {
                t0.selectAll(".dot").style("opacity", "0");
                t0.selectAll(".line").style("opacity", "0");
                t0.selectAll(".lineLabel").style("opacity", "0");
                yScale.domain([minPrice, maxPrice]);
                for (i in positionList) {
                    t0.select("#" + positionList[i]).attr("d", price_line).style("opacity", "1");
                    t0.selectAll("." + positionList[i] + "_dot").attr("cy", function (d) { return yScale(d[1]); }).style("opacity", "1");
                    t0.selectAll("." + positionList[i] + "_label").style("opacity", "1");
                }
            }
            else {
                t0.selectAll(".dot").style("opacity", "0");
                t0.selectAll(".line").style("opacity", "0");
                t0.selectAll(".lineLabel").style("opacity", "0");
                // New domain for yAxis
                var temp = [];
                for (j in data[position_selected]) {
                    temp = temp.concat(Object.values(data[position_selected][j]));
                }
                var tempMin = d3.min(temp);
                var tempMax = d3.max(temp);
                
                yScale.domain([tempMin, tempMax]);
                // adjust line, dot, and label
                t0.selectAll("#" + position_selected).attr("d", price_line).style("opacity", "1");
                t0.selectAll("." + position_selected + "_dot").attr("cy", function (d) { return yScale(d[1]); }).style("opacity", "1");
                t0.selectAll("." + position_selected + "_label").style("opacity", "1");
                t0.select("." + position_selected + "-g").style("opacity", "1");
                t0.selectAll("." + position_selected + "_detail_line").attr("d", price_line).style("opacity", "1");
                t0.selectAll("." + position_selected + "_detail_dot").attr("cy", function (d) { return yScale(d[1]); }).style("opacity", "1");
                t0.selectAll("." + position_selected + "_detail_label").attr("transform", detail_transform).style("opacity", "1");
            }

            var t1 = t0.transition();
            // t1.selectAll(".line").attr("d", price_line);
            t1.selectAll(".yAxis").call(d3.axisLeft(yScale).tickFormat(d3.format('.2s')));
            interactive_display(position_selected);
            
            /* t0.selectAll(".line").attr("d", line);
            t0.selectAll(".label").attr("transform", transform).text(city);
        
            // Then transition the y-axis.
            y.domain(d3.extent(data, function(d) { return d[city]; }));
            var t1 = t0.transition();
            t1.selectAll(".line").attr("d", line);
            t1.selectAll(".label").attr("transform", transform);
            t1.selectAll(".y.axis").call(yAxis); */
        }

        function detail_transform(d) {
            return "translate(" + xScale(d[0]) + "," + yScale(d[1]) + ")"; 
        }
    }
}