function showTotalTransferInAndOutValue(season){
	d3.select('.inoutSvg').remove()
	var height, svg, width;
	svgW = 1400
	svgH = svgW*4/7;
	durationTime=1000
	var svg = d3.select("#inandoutdiv")
		.append("svg")
		.attr("class",'inoutSvg')
		.attr('id','inoutSvg')
		.attr("height", svgH)
		.attr("width", svgW)
	var showedData=[]
	var showedCountry=[]
	var seasonList=[]
	var barInterval=140
	var clickedType,clickedSeason=season
	d3.json("../../resource/player_data.json",function(pd){
		d3.json("../../resource/countryCentroid.json",function(cc){
			function preprocessData(season){
				for (var key in cc)
					showedCountry.push(key)
				for(var i=0;i<showedCountry.length;i++){
					var obj={
						"country":showedCountry[i],
						"in":0,
						"inNum":0,
						"self":0,
						"selfNum":0,
						"out":0,
						"outNum":0
					}
					showedData.push(obj)
				}
				for(var i=0;i<pd.length;i++)
					for(var j=0;j<pd[i]['transfer history'].length;j++)
					{
						if(pd[i]['transfer history'][j]['season']==season&&showedCountry.indexOf(pd[i]['transfer history'][j]['moving from']['country'])!=-1&&showedCountry.indexOf(pd[i]['transfer history'][j]['moving to']['country'])!=-1){
							for(var k=0;k<showedData.length;k++){
								if(pd[i]['transfer history'][j]['moving from']['country']==showedData[k]['country']){
									if(pd[i]['transfer history'][j]['moving from']['country']==pd[i]['transfer history'][j]['moving to']['country']){
										showedData[k]['self']+=parseInt(pd[i]['transfer history'][j]['transfer fee'])
										showedData[k]['selfNum']+=1
									}
									else{
										showedData[k]['out']+=parseInt(pd[i]['transfer history'][j]['transfer fee'])
										showedData[k]['outNum']+=1
									}
								}
								if(pd[i]['transfer history'][j]['moving to']['country']==showedData[k]['country']){
									showedData[k]['in']+=parseInt(pd[i]['transfer history'][j]['transfer fee'])
									showedData[k]['inNum']+=1
								}
							}
						}
						if(seasonList.indexOf(pd[i]['transfer history'][j]['season'])==-1){
							if (seasonList.length==0){
								seasonList.push(pd[i]['transfer history'][j]['season'])
							}
							else{
								var hv=0
								for(var k=0;k<seasonList.length;k++){
									if((parseInt(pd[i]['transfer history'][j]['season'].split('/')[0])+10)>(parseInt(seasonList[k].split('/')[0])+10)){
										seasonList.splice(k,0,pd[i]['transfer history'][j]['season'])
										hv=1
										break
									}
								}
								if(hv==0)
									seasonList.push(pd[i]['transfer history'][j]['season'])
							}
						}
					}
			}
			function showBars(){
				x = d3.scaleBand();
				y = d3.scaleLinear();
				var maxValue=0
				for(var i=0;i<showedData.length;i++){
					if(showedData[i].in>maxValue)
						maxValue=showedData[i].in
					if(showedData[i].out>maxValue)
						maxValue=showedData[i].out
					if(showedData[i].self>maxValue)
						maxValue=showedData[i].self
				}
				x.domain(showedData.map(function (d) { return d.country; }))
					.round(true)
					.range([0, svgW*0.83])
					.paddingInner(0.75);
				y.domain([0, 800])
					.range([svgH*0.656, 0]);
				var barSpace=svg.selectAll(".bar")
					.data(showedData)
					.enter()
				barSpace.append("rect")
					.attr("class", "inBar")
					.attr("x", function(d,i){return i*barInterval+150})
					.attr("y", function(d,i){return svgH-d.in/1000000*0.65-100})
					.attr("width", x.bandwidth())
					.attr("height",function(d){return d.in/1000000*0.65})
					.style('fill-opacity',0)
					.transition()
					.delay(function(d,i){return durationTime/5*i})
					.duration(durationTime/2)
					.style('fill-opacity',1)
				barSpace.append("text")
					.attr("class", "inBarLabel")
					.attr("id",function(d){return d.country+'-in'})
					.text(function(d){return d.in/1000000})
					.attr("x", function(d,i){return i*barInterval+151})
					.attr("y", function(d,i){return svgH-d.in/1000000*0.65-105})
					.style('font-size',10)
					.style('fill-opacity',0)
					.transition()
					.delay(function(d,i){return durationTime/5*i})
					.duration(durationTime/2)
					.style('fill-opacity',1)
				barSpace.append("rect")
					.attr("class", "outBar")
					.attr("x", function(d,i){return i*barInterval+150+x.bandwidth()})
					.attr("y", function(d,i){return svgH-d.out/1000000*0.65-100})
					.attr("width", x.bandwidth())
					.attr("height",function(d){return d.out/1000000*0.65})
					.style('fill-opacity',0)
					.transition()
					.delay(function(d,i){return durationTime/5*i})
					.duration(durationTime/2)
					.style('fill-opacity',1)
				barSpace.append("text")
					.attr("class", "outBarLabel")
					.attr("id",function(d){return d.country+'-out'})
					.text(function(d){return d.out/1000000})
					.attr("x", function(d,i){return i*barInterval+151+x.bandwidth()})
					.attr("y", function(d,i){return svgH-d.out/1000000*0.65-105})
					.style('font-size',10)
					.style('fill-opacity',0)
					.transition()
					.delay(function(d,i){return durationTime/5*i})
					.duration(durationTime/2)
					.style('fill-opacity',1)
				barSpace.append("rect")
					.attr("class", "selfBar")
					.attr("x", function(d,i){return i*barInterval+150+x.bandwidth()*2})
					.attr("y", function(d,i){return svgH-d.self/1000000*0.65-100})
					.attr("width", x.bandwidth())
					.attr("height",function(d){return d.self/1000000*0.65})
					.style('fill-opacity',0)
					.transition()
					.delay(function(d,i){return durationTime/5*i})
					.duration(durationTime/2)
					.style('fill-opacity',1)
				barSpace.append("text")
					.attr("class", "selfBarLabel")
					.attr("id",function(d){return d.country+'-self'})
					.text(function(d){return d.self/1000000})
					.attr("x", function(d,i){return i*barInterval+151+x.bandwidth()*2})
					.attr("y", function(d,i){return svgH-d.self/1000000*0.65-105})
					.style('font-size',10)
					.style('fill-opacity',0)
					.transition()
					.delay(function(d,i){return durationTime/5*i})
					.duration(durationTime/2)
					.style('fill-opacity',1)
			}
			function showAxis(){
				svg.selectAll(".country_label")
					.data(showedData)
					.enter()
					.append("text")
					.text(function (d) { return d.country; })
					.attr("class", "country_label")
					.attr("x", function(d,i){return i*barInterval+150+1.5*x.bandwidth()-d.country.length*4})
					.attr("y", function(d,i){return svgH*0.91})
					.style('font-size',15)
				var xAxis = d3.axisBottom()
					.scale(x)
					.ticks(2)
					.tickSize(0)
					.tickFormat('');
				svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(100," + (svgH-100) + ")")
					.call(xAxis);
				var yAxis = d3.axisLeft()
					.scale(y)
					.ticks(10, '.2f');
				svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(100," +175.2 + ")")
					.call(yAxis);
				svg.append("text")
					.text('Tansfer Value (million €)')
					.attr('x',-520)
					.attr('y',30)
					.attr("transform", "rotate(-90)")
	                .attr('class', 'country_label')
	            svg.append("text")
	            	.attr('class', 'country_label')
	            	.text('Country')
					.attr('x',1280)
					.attr('y',750)
			}
			function showLegend(){
				var legendY=200
				var legendX=1300
				svg.append('text')
					.text('Total Transfer In&Out Value')
					.attr('x',100)
					.attr('y',80)
					.style('font-size',60)
					.style('fill','white')
				svg.append('rect')
					.attr('x',legendX)
					.attr('y',legendY)
					.attr('width',20)
					.attr('height',15)
					.style('fill','#00BFFF')
				svg.append('rect')
					.attr('x',legendX)
					.attr('y',legendY+30)
					.attr('width',20)
					.attr('height',15)
					.style('fill','#FF00BF')
				svg.append('rect')
					.attr('x',legendX)
					.attr('y',legendY+60)
					.attr('width',20)
					.attr('height',15)
					.style('fill','#FFBF00')
				svg.append('text')
					.attr('class','legendText')
					.text('Transfer In')
					.attr('x',legendX+30)
					.attr('y',legendY+12)
				svg.append('text')
					.attr('class','legendText')
					.text('Transfer Out')
					.attr('x',legendX+30)
					.attr('y',legendY+42)
				svg.append('text')
					.attr('class','legendText')
					.text('Self Transfer')
					.attr('x',legendX+30)
					.attr('y',legendY+72)
			}
			function showButton(){
				var bottonText=['All','In','Out','Self']
				var buttonSpace=svg.selectAll('button')
					.data(bottonText)
					.enter()
				var tx=131
				buttonSpace.append('rect')
					.attr('id',function(d){return d+'-base'})
					.attr('class','typeButtonBase')
					.attr('x',function(d,i){return tx+i*50-11})
					.attr('y',130)
					.attr('width',40)
					.attr('height',20)
					.attr('rx',5)
					.attr('ry',5)
				buttonSpace.append('text')
					.attr('id',function(d){return d+'-label'})
					.attr('class','typeButtonText')
					.text(function(d){return d})
					.attr('x',function(d,i){
						if(i==0)
							return tx
						else if(i==1)
							return tx+i*53
						else 
							return tx+i*48
						})
					.attr('y',145)
				buttonSpace=svg.selectAll('button')
					.data(seasonList)
					.enter()
				buttonSpace.append('rect')
					.attr('id',function(d,i){return d+'-base'})
					.attr('class','seasonButtonBase')
					.attr('x',function(d,i){return tx+i*60-15})
					.attr('y',100)
					.attr('width',52)
					.attr('height',20)
					.attr('rx',5)
					.attr('ry',5)
				buttonSpace.append('text')
					.attr('id',function(d,i){return d+'-label'})
					.attr('class','seasonButtonText')
					.text(function(d){return d})
					.attr('x',function(d,i) {
						if(d.split('/')[0][0]==1)
							return tx+60*i-8
						else
							return tx+60*i-10
					})
					.attr('y',115)
			}
			function event(){
				function deleteAll(){
					d3.selectAll('.inBar').transition().duration(durationTime/2).style('fill-opacity',0).remove()
					d3.selectAll('.inBarLabel').transition().duration(durationTime/2).style('fill-opacity',0).remove()
					d3.selectAll('.outBar').transition().duration(durationTime/2).style('fill-opacity',0).remove()
					d3.selectAll('.outBarLabel').transition().duration(durationTime/2).style('fill-opacity',0).remove()
					d3.selectAll('.selfBar').transition().duration(durationTime/2).style('fill-opacity',0).remove()
					d3.selectAll('.selfBarLabel').transition().duration(durationTime/2).style('fill-opacity',0).remove()
				}
				if(typeof(clickedType)=='undefined'){
					d3.select('#All-base')
						.style('fill','#00BFFF')
					d3.select('#All-label')
						.style('fill','grey')
					clickedType="All"
				}
				document.getElementById(season+"-base").style.fill='#00BFFF'
				document.getElementById(season+"-label").style.fill='grey'
				svg.selectAll('.seasonButtonText')
					.on("mouseover",function(ele,i){
						if(ele!=clickedSeason){
							document.getElementById(ele+'-base').style.stroke='white'
							document.getElementById(ele+'-label').style.fill='white'
						}
					})
					.on('mouseout',function(ele,i){
						if(ele!=clickedSeason){
							document.getElementById(ele+'-base').style.stroke='#00BFFF'
							document.getElementById(ele+'-label').style.fill='#00BFFF'
						}
					})
					.on('click',function(ele,i){
						d3.selectAll('.seasonButtonText')
							.style('fill','#00BFFF')
						d3.selectAll('.seasonButtonBase')
							.style('fill','grey')
							.style('stroke','#00BFFF')
						d3.selectAll('.typeButtonText')
							.style('fill','#00BFFF')
						d3.selectAll('.typeButtonBase')
							.style('fill','grey')
							.style('stroke','#00BFFF')
						d3.select('#All-base')
							.style('fill','#00BFFF')
						d3.select('#All-label')
							.style('fill','grey')
						clickedType="All"
						document.getElementById(ele+'-base').style.fill='#00BFFF'
						document.getElementById(ele+'-label').style.fill='grey'
						clickedSeason=ele
						deleteAll()
						showedData=[]
						showedCountry=[]
						preprocessData(clickedSeason)
						console.log(showedData.length)
						showBars()
						svg.selectAll('.inBar')
							.on('mouseover',function(ele,i){
								d3.select('#'+ele.country+'-in')
									.text(ele.inNum+' deals')
							})
							.on('mouseout',function(ele,i){
								d3.select('#'+ele.country+'-in')
									.text(ele.in/1000000)
							})
						svg.selectAll('.outBar')
							.on('mouseover',function(ele,i){
								d3.select('#'+ele.country+'-out')
									.text(ele.outNum+' deals')
							})
							.on('mouseout',function(ele,i){
								d3.select('#'+ele.country+'-out')
									.text(ele.out/1000000)
							})
						svg.selectAll('.selfBar')
							.on('mouseover',function(ele,i){
								d3.select('#'+ele.country+'-self')
									.text(ele.selfNum+' deals')
							})
							.on('mouseout',function(ele,i){
								d3.select('#'+ele.country+'-self')
									.text(ele.self/1000000)
							})
					})
				svg.selectAll('.typeButtonText')
					.on("mouseover",function(ele,i){
						if(ele!=clickedType){
							document.getElementById(ele+'-base').style.stroke='white'
							document.getElementById(ele+'-label').style.fill='white'
						}
					})
					.on('mouseout',function(ele,i){
						if(ele!=clickedType){
							document.getElementById(ele+'-base').style.stroke='#00BFFF'
							document.getElementById(ele+'-label').style.fill='#00BFFF'
						}
					})
					.on('click',function(ele,i){
						d3.selectAll('.typeButtonText')
							.style('fill','#00BFFF')
						d3.selectAll('.typeButtonBase')
							.style('fill','grey')
							.style('stroke','#00BFFF')
						document.getElementById(ele+'-base').style.fill='#00BFFF'
						document.getElementById(ele+'-label').style.fill='grey'
						deleteAll()
						var barSpace=svg.selectAll(".bar")
							.data(showedData)
							.enter()
						if (clickedType!=ele){
							if(ele=='All')
								showBars()
							else if(ele=='In'){
								barSpace.append("rect")
									.attr("class", "inBar")
									.attr("x", function(d,i){return i*barInterval+150})
									.attr("y", function(d,i){return svgH-d.in/1000000*0.65-100})
									.attr("width", x.bandwidth()*3)
									.attr("height",function(d){return d.in/1000000*0.65})
									.style('fill-opacity',0)
									.transition()
									.delay(function(d,i){return durationTime/5*i})
									.duration(durationTime/2)
									.style('fill-opacity',1)
								barSpace.append("text")
									.attr("class", "inBarLabel")
									.attr("id",function(d){return d.country+'-in'})
									.text(function(d){return d.in/1000000})
									.attr("x", function(d,i){return i*barInterval+155})
									.attr("y", function(d,i){return svgH-d.in/1000000*0.65-110})
									.style('font-size',30)
									.style('fill-opacity',0)
									.transition()
									.delay(function(d,i){return durationTime/5*i})
									.duration(durationTime/2)
									.style('fill-opacity',1)
								svg.selectAll('.inBar')
									.on('mouseover',function(ele,i){
										d3.select('#'+ele.country+'-in')
											.text(ele.inNum+' deals')
									})
									.on('mouseout',function(ele,i){
										d3.select('#'+ele.country+'-in')
											.text(ele.in/1000000)
									})
							}
							else if(ele=='Out'){
								barSpace.append("rect")
									.attr("class", "outBar")
									.attr("x", function(d,i){return i*barInterval+150})
									.attr("y", function(d,i){return svgH-d.out/1000000*0.65-100})
									.attr("width", x.bandwidth()*3)
									.attr("height",function(d){return d.out/1000000*0.65})
									.style('fill-opacity',0)
									.transition()
									.delay(function(d,i){return durationTime/5*i})
									.duration(durationTime/2)
									.style('fill-opacity',1)
								barSpace.append("text")
									.attr("class", "outBarLabel")
									.attr("id",function(d){return d.country+'-out'})
									.text(function(d){return d.out/1000000})
									.attr("x", function(d,i){return i*barInterval+155})
									.attr("y", function(d,i){return svgH-d.out/1000000*0.65-110})
									.style('font-size',30)
									.style('fill-opacity',0)
									.transition()
									.delay(function(d,i){return durationTime/5*i})
									.duration(durationTime/2)
									.style('fill-opacity',1)
								svg.selectAll('.outBar')
									.on('mouseover',function(ele,i){
										d3.select('#'+ele.country+'-out')
											.text(ele.outNum+' deals')
									})
									.on('mouseout',function(ele,i){
										d3.select('#'+ele.country+'-out')
											.text(ele.out/1000000)
									})
							}
							else if(ele=="Self"){
								barSpace.append("rect")
									.attr("class", "selfBar")
									.attr("x", function(d,i){return i*barInterval+150})
									.attr("y", function(d,i){return svgH-d.self/1000000*0.65-100})
									.attr("width", x.bandwidth()*3)
									.attr("height",function(d){return d.self/1000000*0.65})
									.style('fill-opacity',0)
									.transition()
									.delay(function(d,i){return durationTime/5*i})
									.duration(durationTime/2)
									.style('fill-opacity',1)
								barSpace.append("text")
									.attr("class", "selfBarLabel")
									.attr("id",function(d){return d.country+'-self'})
									.text(function(d){return d.self/1000000})
									.attr("x", function(d,i){return i*barInterval+155})
									.attr("y", function(d,i){return svgH-d.self/1000000*0.65-105})
									.style('font-size',30)
									.style('fill-opacity',0)
									.transition()
									.delay(function(d,i){return durationTime/5*i})
									.duration(durationTime/2)
									.style('fill-opacity',1)
								svg.selectAll('.selfBar')
									.on('mouseover',function(ele,i){
										d3.select('#'+ele.country+'-self')
											.text(ele.selfNum+' deals')
									})
									.on('mouseout',function(ele,i){
										d3.select('#'+ele.country+'-self')
											.text(ele.self/1000000)
									})
							}
						}
						clickedType=ele
							
					})
				svg.selectAll('.inBar')
					.on('mouseover',function(ele,i){
						d3.select('#'+ele.country+'-in')
							.text(ele.inNum+' deals')
					})
					.on('mouseout',function(ele,i){
						d3.select('#'+ele.country+'-in')
							.text(ele.in/1000000)
					})
				svg.selectAll('.outBar')
					.on('mouseover',function(ele,i){
						d3.select('#'+ele.country+'-out')
							.text(ele.outNum+' deals')
					})
					.on('mouseout',function(ele,i){
						d3.select('#'+ele.country+'-out')
							.text(ele.out/1000000)
					})
				svg.selectAll('.selfBar')
					.on('mouseover',function(ele,i){
						d3.select('#'+ele.country+'-self')
							.text(ele.selfNum+' deals')
					})
					.on('mouseout',function(ele,i){
						d3.select('#'+ele.country+'-self')
							.text(ele.self/1000000)
					})
			}
			preprocessData(season)
			showBars()
			showAxis()
			showLegend()
			showButton()
			event()
		})
	})
}
