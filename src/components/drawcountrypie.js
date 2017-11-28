function showCountryPie(country_name, sunburst_flag) {
  d3.select('#Sunburstchart').select('#sunburst').remove();
  sunburst_flag = false;
  if (country_name === "United Kingdom") {
    country_name = "England";
  }

  var data = {"England":[], "France":[], "Germany":[], "Italy":[], "Netherlands":[], "Portugal":[], "Spain":[], "Turkey":[]}
  d3.json("../../resource/club_data.json", function(d) {
    for (var key in d) {
      for (var club in d[key]){
        data[key].push({club: club, total_value: d[key][club]['total market value'] });
      }
    }
    generateGraph(country_name);
  });
  var countries = ["England", "France", "Germany", "Italy", "Netherlands", "Portugal", "Spain", "Turkey"];

  var index = countries.indexOf(country_name);
  countries.splice(index, 1);
  countries.unshift(country_name)

  d3.select('#CountryPieBar').selectAll(".select_country_total_value").remove();

  var select = d3.select('#CountryPieBar')
    .append('select')
      .attr('class','select_country_total_value')
      .property('value', country_name)
      .on('change',onchange)

  var options = select
    .selectAll('option')
    .data(countries).enter()
    .append('option')
      .text(function (d) { return d; });

  function onchange() {
    d3.select('#Sunburstchart').select('#sunburst').remove();
    if (sunburst_flag) {
      d3.select('#CountryPieBar').attr("class", "CountryPieBar left2right");
    }
    sunburst_flag = false;
    selectValue = d3.select('select').property('value');
    generateGraph(selectValue);
  };

  function generateGraph(country_name){  

    var svg = d3.select("#donut"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      radius = Math.min(width, height) / 2 - 50,
    g = svg.append("g").attr("transform", "translate(" + (width / 2 + 90) + "," + (height / 2 + 30) + ")");
    pic_path = "../../resource/CountryPictures/" + country_name + ".png"
    
    prev_img = d3.selectAll('.country_pic');
    prev_img.transition()
    .delay(100)
    .ease(d3.easeLinear).style("opacity", 0);

    img = g.append("svg:image")
    .attr("xlink:href", pic_path)
    .attr('class','country_pic')
    .style("opacity", 0);

    img.transition()
    .delay(100)
    .ease(d3.easeLinear).style("opacity", 1);

    var pie = d3.pie()
        .sort(null)
        .startAngle(1.1*Math.PI)
        .endAngle(3.1*Math.PI)
        .value(function(d) { return d.total_value; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 130);

    var div = d3.select("#CountryPieBar").append("div").attr("class", "toolTip");

    var c20b = d3.scale.category20b();

    var arc = g.selectAll(".arc")
    .data(pie(data[country_name].sort(
      function (a, b) { return b["total_value"] - a["total_value"]; }
      )))
      .enter().append("g")
      .attr("class", "arc");

    arc.append("path")
      .attr("fill", function(d) { return c20b(d.data.club); })
      .transition().delay(function(d,i) {
        return i * 100; }).duration(100)
        .attrTween('d', function(d) {
          var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
          return function(t) {
            d.endAngle = i(t); 
            return label(d)
            }
          }); 
    if (sunburst_flag) {
    d3.select('#CountryPieBar').selectAll(".arc").selectAll("path").on("mousemove", function(d) {
      div.style("left", event.clientX - 50 + "px");
      div.style("top", event.clientY - 100 + "px");
      div.style("display", "inline-block");
    div.html((d.data.club)+"<br>"+(d.data.total_value / 1000000) + "M" + "<br>");});
    }
    else {
      d3.select('#CountryPieBar').selectAll(".arc").selectAll("path").on("mousemove", function(d) {
      div.style("left", event.clientX - 250 + "px");
      div.style("top", event.clientY - 200 + "px");
      div.style("display", "inline-block");
      div.html((d.data.club)+"<br>"+(d.data.total_value / 1000000) + "M" + "<br>");});
    }

    d3.select('#CountryPieBar').select("#donut").selectAll(".arc").selectAll("path").attr("cursor", "pointer").on('click',function(d){
                            if (sunburst_flag === false) {
                              d3.select('#CountryPieBar').attr("class", "CountryPieBar right2left");
                              d3.select('#Sunburstchart').append("svg").attr('id', 'sunburst')
                              .attr("width", 600)
                              .attr("height", 500);
                              showSunburst(country_name, d.data.club);
                              sunburst_flag = true;
                            }
                            else {
                              showSunburst(country_name, d.data.club);
                            }
                        })

    d3.select('#CountryPieBar').selectAll(".arc").selectAll("path").on("mouseout", function(d){
      div.style("display", "none");
    });



    setTimeout(function(){ prev_legend.remove(); }, 500);

    prev_legend = d3.selectAll('.country_legend');
    prev_legend.transition()
    .delay(100)
    .ease(d3.easeLinear).style("opacity", 0);

    setTimeout(function(){ draw_legend(); }, 650);

    function draw_legend() {

    var legend = svg.selectAll(".country_legend")
        .data(data[country_name])
        .enter().append("g")
        .attr("class", "country_legend")
        .style("opacity", 0)
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return c20b(d.club); });

    // draw legend text
    legend.append("text")
        .attr("x", 20)
        .attr("y", 110)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d.club;});

    legend.transition()
    .delay(100)
    .ease(d3.easeLinear).style("opacity", 1);

    }

  }
}