function showMap() {
    var center, countries, height, path, projection, scale, svg, width;
    transferSession="17/18"
    svgW = 1400
    svgH = svgW*4/7;
    center = [5, 70];
    scale = svgW*13/14;
    projection = d3.geo.mercator()
        .scale(scale)
        .translate([scale / 2.5, -scale/2.2])
        .center(center)
    path = d3.geo.path()
        .projection(projection);
    svg = d3.select("#map")
        .append("svg")
        .attr("height", svgH)
        .attr("width", svgW)
        .style('background-color','#000030')
    countries = svg.append("g");
    d3.json("../../resource/eu.json", function(data) {
        country=countries.selectAll('.country')
            .data(topojson.feature(data, data.objects.europe).features)
            .enter()
        country.append('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('id',function(d){
                return d.properties.name})
        d3.json("../../resource/player_data.json",function(pd){



            //player data selection and preprocessing
            var playerNum=0
            console.log('total player data: '+pd.length)
            macroscopicTransfer=[]
            for(var i=0;i<pd.length;i++)
                for(var j=0;j<pd[i]["transfer history"].length;j++)  
                    if(pd[i]["transfer history"][j]["season"]==transferSession)
                    {
                        playerNum++
                        var k=0,f
                        for(;k<macroscopicTransfer.length;k++)
                        {
                            if (macroscopicTransfer[k]["from"]==pd[i]["transfer history"][j]["moving from"]["country"]&& macroscopicTransfer[k]["to"]==pd[i]["transfer history"][j]["moving to"]["country"])
                            {
                                f=1
                                break
                            }
                            if (macroscopicTransfer[k]["to"]==pd[i]["transfer history"][j]["moving from"]["country"]&& macroscopicTransfer[k]["from"]==pd[i]["transfer history"][j]["moving to"]["country"])
                            {
                                f=0
                                break
                            }
                        }
                        if (k!=macroscopicTransfer.length && macroscopicTransfer.length!=0){
                            if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                macroscopicTransfer[k]["value"]+=0
                            else
                                macroscopicTransfer[k]["value"]+=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                            var key
                            if(f==1)
                                key=macroscopicTransfer[k]['from']+' to '+macroscopicTransfer[k]['to']
                            else
                                key=macroscopicTransfer[k]['to']+' to '+macroscopicTransfer[k]['from']
                            if(macroscopicTransfer[k][key]==undefined)
                                macroscopicTransfer[k][key]=1
                            else
                                macroscopicTransfer[k][key]+=1
                            if(macroscopicTransfer[k][key+' Value']==undefined)
                                if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                    macroscopicTransfer[k][key+' Value']=0
                                else
                                    macroscopicTransfer[k][key+' Value']=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                            else
                                if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                    macroscopicTransfer[k][key+' Value']+=0
                                else
                                    macroscopicTransfer[k][key+' Value']+=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                            macroscopicTransfer[k]['num']++
                        }
                        else
                        {
                            var obj={
                                "from":pd[i]["transfer history"][j]["moving from"]["country"],
                                "to":pd[i]["transfer history"][j]["moving to"]["country"]
                            }
                            if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                obj["value"]=0
                            else
                                obj["value"]=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                            key=obj['from']+' to '+obj['to']
                            obj[key]=1
                            if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                obj[key+" Value"]=0
                            else
                                obj[key+" Value"]=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                            obj['num']=1
                            macroscopicTransfer.push(obj)
                        }
                    }
            for(var i=0;i<macroscopicTransfer.length;i++){
                var obj={
                    "TextGeneralLabel":macroscopicTransfer[i]['from']+' <==> '+macroscopicTransfer[i]['to'],
                    "TextGeneralValue":'  €'+macroscopicTransfer[i]['value']/1000000+'m   '+macroscopicTransfer[i]['num']+' deals'
                }
                if(macroscopicTransfer[i]['from']!=macroscopicTransfer[i]['to']){
                    obj["TextDetail1Label"]=macroscopicTransfer[i]['from']+' ==> '+macroscopicTransfer[i]['to']
                    var key=macroscopicTransfer[i]['from']+' to '+macroscopicTransfer[i]['to']
                    obj['TextDetail1Value']='  €'+macroscopicTransfer[i][key+' Value']/1000000+'m   '+macroscopicTransfer[i][key]+' deals'
                    obj['TextDetail2Label']=macroscopicTransfer[i]['to']+' ==> '+macroscopicTransfer[i]['from']
                    key=macroscopicTransfer[i]['to']+' to '+macroscopicTransfer[i]['from']
                    obj['TextDetail2Value']='  €'+macroscopicTransfer[i][key+' Value']/1000000+'m   '+macroscopicTransfer[i][key]+' deals'
                }
              macroscopicTransfer[i]['ShowText']=obj
            }
            console.log(macroscopicTransfer)
            console.log('total transfer: '+macroscopicTransfer.length)



            //draw path
            d3.json("../../resource/countryCentroid.json",function(cc){
                var countryPath=svg.append("g")
                countryPath.selectAll('.totalLine')
                    .data(macroscopicTransfer)
                    .enter()
                    .append('path')
                    .attr('class','totalLine')
                    .attr('d',function(d){
                        var from,to
                        var r=50
                        for(var key in cc)
                        {
                            if(d['from']==key)
                                from=key 
                            if(d['to']==key)
                                to=key
                        }
                        if(from==to){
                            var str="M"+String(cc[from][to][0])+","+String(cc[from][to][1])+' '+'c'+String(-r*0.866)+','+String(-r*0.8)+' '+String(r*0.866)+','+String(-r*0.8)+" "+String(cc[to][from][0]-cc[from][to][0])+","+String(cc[to][from][1]-cc[from][to][1])
                            return str
                        }
                        else{
                            var a=cc[from][to][0]
                            var b=cc[from][to][1]
                            var c=cc[to][from][0]
                            var d=cc[to][from][1]
                            var e=(a+b+c-d)/2
                            var f=(b+c+d-a)/2
                            var g=(a-b+c+d)/2
                            var h=(a+b-c+d)/2
                            var hp,lp
                            if(f>h)
                            {
                                hp=[e,f]
                                lp=[g,h]
                            }
                            else
                            {
                                hp=[g,h]
                                lp=[e,f]
                            }
                            if(cc[from][to][2]==-1)
                            {
                                var str="M"+String(cc[from][to][0])+","+String(cc[from][to][1])+' '+'c0,0 '+String(hp[0]-a)+','+String(hp[1]-b)+' '+String((cc[to][from][0]-cc[from][to][0]))+","+String(cc[to][from][1]-cc[from][to][1])
                                return str
                            }
                            else if(cc[from][to][2]==1)
                            {
                                var str="M"+String(cc[from][to][0])+","+String(cc[from][to][1])+' '+'c0,0 '+String(lp[0]-a)+','+String(lp[1]-b)+' '+String((cc[to][from][0]-cc[from][to][0]))+","+String(cc[to][from][1]-cc[from][to][1])
                                return str
                            }
                            else
                            {
                                var str="M"+String(cc[from][to][0])+","+String(cc[from][to][1])+' '+'c0,0 0,0 '+String((cc[to][from][0]-cc[from][to][0]))+","+String(cc[to][from][1]-cc[from][to][1])
                                return str
                            }
                        }
                    })
                    .attr('stroke',function(d){
                        var value=d['value']/1000000
                        value=Math.pow(value,1/4)*50
                        //console.log(d['from'],d['to'],d['value'],d[d['from']+' to '+d['to']],d[d['to']+' to '+d['from']])
                        if(value<=0.5)
                            return '#ffffff'
                        else{
                            
                            value=Math.round(256-value).toString(16)
                            color='#'+value+value+value
                            //console.log(color)
                            return color
                        }
                        
                    })
                    .attr('stroke-width',8)
                    .attr('fill','none')
                    .style('stroke-opacity',0.85)

                countryPath.selectAll('.totalLine')
                    .on('mouseover',(ele,i)=>{
                        countryPath.append('rect')
                            .attr('id',ele.id+'-base-r')
                            .attr('class','transferLabelBase')
                            .attr('x', d3.event.offsetX+10)
                            .attr('y',d3.event.offsetY-140)
                            .attr('rx', 20)
                            .attr('ry',20)
                            .attr('width',150)
                            .attr('height',100)
                        countryPath.append('marker')
                            .attr('id',ele.id+'-base-t')
                            .attr('class','transferLabelBase')
                            .attr('markerWidth',20)
                            .attr('markerHeight',10)
                            .attr('refx',2)
                            .attr('refy',6)
                            .append('path')
                            .attr('d',function(){
                                return "M0,3 L1,0 L5,0"
                            })
                            .style('fill','lightblue')
                        countryPath.append('line')
                            .attr('id',ele.id+'-base-l')
                            .attr('class','transferLabelBase')
                            .attr('x1',d3.event.offsetX+30)
                            .attr('y1',d3.event.offsetY-40)
                            .attr('x2',d3.event.offsetX+30)
                            .attr('y2',d3.event.offsetY-40)
                            .attr('stroke','lightblue')
                            .attr('stroke-width',10)
                            .attr('marker-end','url(#'+ele.id+'-base-t)')
                        countryPath.append('text')
                            .text(ele.ShowText.TextGeneralLabel)
                            .attr('class','transferLabel')
                            .attr('x',d3.event.offsetX+30)
                            .attr('y',d3.event.offsetY-100)
                            .attr('fill','red')
                    })
                    .on('mouseout',(ele,i)=>{
                        d3.selectAll('.transferLabelBase').remove()
                        d3.selectAll('.transferLabel').remove()
                })



                var countryPoint=countryPath.selectAll('.cp')
                    .data(macroscopicTransfer)
                    .enter()
                countryPoint.append('circle')
                    .attr("class",'countryPoint')
                    .attr('r',8)
                    .attr('cx',function(d){
                        var from,to
                        for(var key in cc)
                        {
                            if(d['from']==key)
                                from=key 
                            if(d['to']==key)
                                to=key
                        }
                        return cc[from][to][0]
                    })
                    .attr('cy',function(d){
                        var from,to
                        for(var key in cc)
                        {
                            if(d['from']==key)
                                from=key 
                            if(d['to']==key)
                                to=key
                        }
                        return cc[from][to][1]
                    })
                countryPoint.append('circle')
                    .attr("class",'countryPoint')
                    .attr('r',8)
                    .attr('cx',function(d){
                        var from,to
                        for(var key in cc)
                        {
                            if(d['from']==key)
                                from=key 
                            if(d['to']==key)
                                to=key
                        }
                        return cc[to][from][0]
                    })
                    .attr('cy',function(d){
                        var from,to
                        for(var key in cc)
                        {
                            if(d['from']==key)
                                from=key 
                            if(d['to']==key)
                                to=key
                        }
                        return cc[to][from][1]
                    })
                })
            console.log('suitable player number: '+playerNum)
        })



        //color scale
        var colorScale=[0,1,2,3,4,5,6,7,8]
        var colorScaleSvg=svg.append('g')
        var color=colorScaleSvg.selectAll('.cs')
            .data(colorScale)
            .enter()
        color.append('rect')
            .attr('class','colorScale')
            .attr('width',30)
            .attr('height',8)
            .attr('x',function(d,i){return 30+i*30})
            .attr('y',20)
            .style('fill',function(d){
                if (d==0)
                    return "#ffffff"
                else{
                    stick=(256-d*32).toString(16)
                    //console.log('#'+stick+stick+stick)
                    return '#'+stick+stick+stick
                }
            })
            .style('fill-opacity',0.85)
        color.append('rect')
            .attr('class','colorStick')
            .attr('width',function(d){
                if(d!=0)
                    return 1
            })
            .attr('height',12)
            .attr('x',function(d,i){return 30+i*30})
            .attr('y',20)
        color.append('text')
            .attr('class','colorStickText')
            .attr('x',function(d,i){return 53+i*30})
            .attr('y',42)
            .text(function(d){
                if(d!=8)
                    return ((d+1)*64).toString()+'m'})
            .style('font-size',5)
        countries.selectAll('.country')
            .on('mouseover',(ele,i)=>{
                countries.append('text')
                    .attr('id',ele.id+'-label')
                    .attr('x',30)
                    .attr('y',780)
                    .text(function(){
                        return ele.properties.name
                    })
                    .attr('font-size',20)
                    .style('fill','#0000BB')
            })
            .on('mouseout',(ele,i)=>{
                d3.selectAll('#'+ele.id+'-label').remove()
        })
    })


}
