function showSunburst(country_name, club_name) {

    positions = ["Centre Forward", "Left Back", "Central Midfield", "Left Wing", 
                "Attacking Midfield", "Centre Back", "Defensive Midfield", "Keeper", 
                "Right Back", "Right Wing", "Left Midfield", "Right Midfield", "Striker", 
                "Secondary Striker"]

    prev_svg = d3.select("#Sunburstchart").selectAll(".path");
    prev_svg.transition()
    .delay(100)
    .ease(d3.easeLinear).style("opacity", 0);

      d3.select("#Sunburstchart").selectAll(".sunburst_g").remove();

      var width = 600,
      height = 500,
      radius = (Math.min(width, height) / 2) - 50;

      var div = d3.select("#Sunburstchart").append("div").attr("class", "toolTip");

      var formatNumber = d3.format(",d");

      var x = d3.scale.linear()
          .range([0, 2 * Math.PI]);

      var y = d3.scale.sqrt()
          .range([0, radius]);

      var color = d3.scale.category20c();

      var partition = d3.layout.partition()
          .value(function(d) { return d.size; });

      var arc = d3.svg.arc()
          .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
          .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
          .innerRadius(function(d) { return Math.max(0, y(d.y)); })
          .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

      var svg = d3.select("#Sunburstchart").select("#sunburst")
          // .attr("width", width)
          // .attr("height", height)
          .append("g")
          .attr("class", "sunburst_g")
          .attr("transform", "translate(" + (width / 2 - 90) + "," + (height / 2 + 20) + ")")
          .style("opacity", 0);

      var legend = svg.selectAll(".position_legend")
        .data(positions)
        .enter().append("g")
        .attr("class", "position_legend")
        // .style("opacity", 0)
        .attr("transform", function(d, i) { return "translate(20," + i * 20 + ")"; });

      // draw legend colored rectangles
      legend.append("rect")
          .attr("x", width -404)
          .attr("y", -140)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d) { return color(d); });

      // draw legend text
      legend.append("text")
          .attr("x", width - 382)
          .attr("y", -130)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d;});

      // legend.transition()
      // .delay(1800)
      // .ease(d3.easeLinear).style("opacity", 1);

      function click(d) {
        svg.transition()
            .duration(400)
            .tween("scale", function() {
              var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                  yd = d3.interpolate(y.domain(), [d.y, 1]),
                  yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
              return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
            })
          .selectAll("path")
            .attrTween("d", function(d) { return function() { return arc(d); }; });
      }

      function form_value(s){
        if (s>=1000000) {
          return (s/1000000).toFixed(2) + "M"
        }
        else if (s >= 1000) {
          return (s/1000).toFixed(2) + "K"
        }
        else {
          return s + ""
        }
      }

      function color_for_draw(thid_d){
        var return_color
        if (thid_d.children){
           color(thid_d.name)
           return_color = color(thid_d.name)
        }
        else {
          var this_rgb = hexToRgb(color(thid_d.parent.name))
          console.log(this_rgb)
          this_rgb.r = Math.round(0.8 * this_rgb.r)
          this_rgb.g = Math.round(0.8 * this_rgb.g)
          this_rgb.b = Math.round(0.8 * this_rgb.b)
          return_color = rgbToHex(this_rgb.r, this_rgb.g, this_rgb.b)
        }
        return return_color
      }

      function hexToRgb(hex) {
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          } : null;
      }

      function rgbToHex(r, g, b) {
          return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      }

  var data = {
    "England":{name: "England", children: []}, 
    "France":{name: "France", children: []}, 
    "Germany":{name: "Germany", children: []}, 
    "Italy":{name: "Italy", children: []}, 
    "Netherlands":{name: "Netherlands", children: []}, 
    "Portugal":{name: "Portugal", children: []}, 
    "Spain":{name: "Spain", children: []}, 
    "Turkey":{name: "Turkey", children: []}
  }
    d3.json("../../resource/club_data.json", function(d) {
      for (var key in d) {
        for (var club in d[key]){
          var this_children = {name: club, children: []};
          var pos_dict = {};
          for (var a_player in d[key][club]['players']){
            if (pos_dict[d[key][club]['players'][a_player]['position']]) {
              pos_dict[d[key][club]['players'][a_player]['position']].push({
                name: d[key][club]['players'][a_player]['name'], size: d[key][club]['players'][a_player]["market value"]});
            }
            else {
              pos_dict[d[key][club]['players'][a_player]['position']] = [{name: d[key][club]['players'][a_player]['name'], size: d[key][club]['players'][a_player]["market value"]}];
            }
          }
          for (var a_pos in pos_dict) {
            this_children['children'].push({name: a_pos, 'children': pos_dict[a_pos]});
          }
          data[key][club] = this_children;
        }
      }
      svg.selectAll("path")
      .data(partition.nodes(data[country_name][club_name]))
      .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color_for_draw(d); })
        .style("stroke", "#fff")
        .attr("cursor", "pointer")
        .on("click", click);

    svg.transition()
    .delay(100)
    .ease(d3.easeLinear).style("opacity", 1);

      d3.select("#Sunburstchart").selectAll("path")
      .on("mousemove", function(d) {
        console.log("fsfeewf")
      div.style("left", event.clientX - 700 + "px");
      div.style("top", event.clientY - 100 + "px");
      div.style("display", "inline-block");
      div.html((d.name)+"<br>"+form_value(d.value) + "<br>");});

      d3.select("#Sunburstchart").selectAll("path").on("mouseout", function(d){
        div.style("display", "none");
      });

    });
    d3.select(self.frameElement).style("height", height + "px");

}