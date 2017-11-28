function showMapView(){
    var center, countries, height, path, projection, scale, svg, width;
    svgW = 1400
    svgH = svgW*4/7;
    center = [5, 70];
    scale = svgW*13/14;
    durationTime=600
    var clickedButton
    var clickedTypeButton
    var transferValue=[]
    var clickedTransferType
    projection = d3.geo.mercator()
        .scale(scale)
        .translate([scale / 2.5, -scale/2.2])
        .center(center)
    path = d3.geo.path()
        .projection(projection);
    svg = d3.select("#map")
        .append("svg")
        .attr("class",'mapSvg')
        .attr('id','mapSvg')
        .attr("height", svgH)
        .attr("width", svgW)
    d3.json("../../resource/eu.json", function(data) {
        d3.json("../../resource/player_data.json",function(pd){
            d3.json("../../resource/countryCentroid.json",function(cc){
                var targetCountries=[]
                for(var key in cc)
                    targetCountries.push(key)
                var clickedPath
                function showMap(){
                    countries = svg.append("g");
                    country=countries.selectAll('.country')
                        .data(topojson.feature(data, data.objects.europe).features)
                        .enter()
                    country.append('path')
                        .attr('class', function(d){
                            if (targetCountries.indexOf(d.properties.name)!=-1||d.properties.name=='United Kingdom')
                                return 'country'
                            else
                                return 'otherCountry'
                        })
                        .attr('d', path)
                        .attr('id',function(d){
                            if (d.properties.name!='United Kingdom')
                                return d.properties.name
                            else
                                return 'UK'
                        })
                        .style('fill','#000030')
                        .style('stroke','#000030')
                        .style('fill-opacity',0)
                    country.selectAll('.country')
                        .transition()
                        .delay(function(d,i){return (i+1)*150})
                        .duration(500)
                        .style('fill','#003B00')
                        .style('stroke','#fff')
                        .style('fill-opacity',1)
                    country.selectAll('.otherCountry')
                        .transition()
                        .delay(function(d,i){return (i+1)*30})
                        .duration(200)
                        .style('fill','#000015')
                        .style('stroke','#fff')
                        .style('fill-opacity',1)
                }
                function showData(seasonValue){
                    var countryPath=svg.append("g")
                    function preprocessTotalTransferData(){
                        var playerNum=0
                        console.log('total player data: '+pd.length)
                        macroscopicTransfer=[]
                        for(var i=0;i<pd.length;i++)
                            for(var j=0;j<pd[i]["transfer history"].length;j++)  
                                if(pd[i]["transfer history"][j]["season"]==seasonValue)
                                {
                                    playerNum++
                                    var k=0,f
                                    for(;k<macroscopicTransfer.length;k++)
                                    {
                                        if (macroscopicTransfer[k]["from"]==pd[i]["transfer history"][j]["moving from"]["country"]&& macroscopicTransfer[k]["to"]==pd[i]["transfer history"][j]["moving to"]["country"]){
                                            f=1
                                            break
                                        }
                                        if (macroscopicTransfer[k]["to"]==pd[i]["transfer history"][j]["moving from"]["country"]&& macroscopicTransfer[k]["from"]==pd[i]["transfer history"][j]["moving to"]["country"]){
                                            f=0
                                            break
                                        }
                                        //if(macroscopicTransfer[k]["from"]==macroscopicTransfer[k]["to"])
                                            //console.log(macroscopicTransfer[k]["from"],f)
                                    }
                                    if (k!=macroscopicTransfer.length && macroscopicTransfer.length!=0){//does have object
                                        if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                            macroscopicTransfer[k]["value"]+=0
                                        else
                                            macroscopicTransfer[k]["value"]+=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                                        var key
                                        if(f==1)
                                            key=macroscopicTransfer[k]['from']+' to '+macroscopicTransfer[k]['to']
                                        else
                                            key=macroscopicTransfer[k]['to']+' to '+macroscopicTransfer[k]['from']
                                        //console.log(key)
                                        if(macroscopicTransfer[k][key]==undefined)
                                            macroscopicTransfer[k][key]=1
                                        else
                                            macroscopicTransfer[k][key]+=1
                                        if(typeof(macroscopicTransfer[k][key+' Value'])=='undefined')
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
                                    else{
                                        var obj={
                                            "from":pd[i]["transfer history"][j]["moving from"]["country"],
                                            "to":pd[i]["transfer history"][j]["moving to"]["country"]
                                        }
                                        if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                            obj["value"]=0
                                        else
                                            obj["value"]=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                                        var key=obj['from']+' to '+obj['to']
                                        obj[key]=1
                                        if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                            obj[key+" Value"]=0
                                        else
                                            obj[key+" Value"]=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                                        if(obj['from']!=obj['to']){
                                            var key=obj['to']+' to '+obj['from']
                                            obj[key]=0
                                            obj[key+" Value"]=0
                                        }
                                        obj['num']=1
                                        obj['season']=seasonValue
                                        macroscopicTransfer.push(obj)
                                    }
                                }
                                for(var i=0;i<macroscopicTransfer.length;i++){
                                    var obj=[
                                        '€'+macroscopicTransfer[i]['value']/1000000+'m   '+macroscopicTransfer[i]['num']+' deals'
                                    ]
                                    var from=macroscopicTransfer[i]['from']
                                    var to=macroscopicTransfer[i]['to']
                                    if(macroscopicTransfer[i]['from']!=macroscopicTransfer[i]['to'])
                                    {
                                        var key=macroscopicTransfer[i]['from']+' to '+macroscopicTransfer[i]['to']
                                        obj.push('€'+macroscopicTransfer[i][key+' Value']/1000000+'m      '+macroscopicTransfer[i][key]+' deals')
                                        key=macroscopicTransfer[i]['to']+' to '+macroscopicTransfer[i]['from']
                                        obj.push('€'+macroscopicTransfer[i][key+' Value']/1000000+'m      '+macroscopicTransfer[i][key]+' deals')
                                    }
                                  macroscopicTransfer[i]['ShowText']=obj
                                }
                                console.log('total transfer: '+macroscopicTransfer.length)
                                console.log('suitable player number: '+playerNum)
                    }
                    function drawTotalTransferPath(){
                        countryPath.selectAll('.totalLine')
                            .data(macroscopicTransfer)
                            .enter()
                            .append('path')
                            .attr('class','totalLine')
                            .attr('id',function(d){
                                return d['from']+' '+d['to']
                            })
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
                                return "M"+String(cc[from][to][0])+","+String(cc[from][to][1])+' c0,0 0,0 0,0'
                            })
                            .attr('stroke',function(d){
                                var value=d['value']/1000000
                                value=Math.pow(value,1/4)*50
                                if(value<=0.5)
                                    return '#ffff00'
                                else{
                                    
                                    value=Math.round(256-value).toString(16)
                                    color='#'+'ff'+value+"00"
                                    return color
                                }
                                
                            })
                            .attr('stroke-width',7)
                            .attr('fill','none')
                            .style('stroke-opacity',0)
                            .transition()
                            .delay(function(d,i){
                                return i*80
                            })
                            .duration(durationTime*0.8)
                            .style('stroke-opacity',0.8)
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
                                    var str="M"+String(cc[from][to][0])+","+String(cc[from][to][1])+' '+'c'+String(-r*0.866)+','+String(-r*0.5)+' '+String(r*0.866)+','+String(-r*0.5)+" "+String(cc[to][from][0]-cc[from][to][0])+","+String(cc[to][from][1]-cc[from][to][1])
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
                            //.style('stroke-opacity',0.85)
                        //draw country point
                        var countryPoint=countryPath.selectAll('.cp')
                            .data(macroscopicTransfer)
                            .enter()
                        countryPoint.append('circle')
                            .attr("class",'countryPoint')
                            .attr('r',0)
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
                            .style('fill-opacity',0)
                            .transition()
                            .delay(function(d,i){
                                return i*80
                            })
                            .duration(durationTime/3)
                            .style('fill-opacity',1)
                            .attr('r',5)
                        countryPoint.append('circle')
                            .attr("class",'countryPoint')
                            .attr('r',5)
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
                            .style('fill-opacity',0)
                            .transition()
                            .delay(function(d,i){
                                return i*80
                            })
                            .duration(durationTime/3)
                            .style('fill-opacity',1)   
                    }
                    function totalAndDetailTransferEvent(){
                        var baseWidth=200
                        countryPath.selectAll('.totalLine')
                            .on('mouseover',(ele,i)=>{
                                countryPath.append('rect')
                                    .attr('id',ele.id+'-base-r')
                                    .attr('class','transferLabelBase')
                                    .attr('x', d3.event.offsetX+10)
                                    .attr('y',d3.event.offsetY-140)
                                    .attr('rx', 20)
                                    .attr('ry',20)
                                    .attr('width',baseWidth)
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
                                countryPath.selectAll('.ShowText')
                                    .data(ele.ShowText)
                                    .enter()
                                    .append('text')
                                    .attr('class','transferLabel')
                                    .text(function(d){return d})
                                    .attr('x',function(d,i){
                                        if(i!=1)
                                            return d3.event.offsetX+90
                                        else
                                            return d3.event.offsetX+85
                                    })
                                    .attr('y',function(d,i){
                                        if(i!=1)
                                            return d3.event.offsetY-125+34*i
                                        else
                                            return d3.event.offsetY-125+34*i+5
                                    })
                                    .style('font-size',function(d,i){
                                        if(i%2==0)
                                            return 6
                                        else
                                            return 8
                                    })
                                    .style('fill',function(d,i){
                                        return '#005000'
                                    })
                                countryPath.append('image')
                                    .attr('class','countryFlag')
                                    .attr('id',ele.from+' image')
                                    .attr('xlink:href',function(){return '../../resource/CountryPictures/'+ele.from+'.png'})
                                    .attr('x',d3.event.offsetX+20)
                                    .attr('y',d3.event.offsetY-125)
                                    .attr('width',60)
                                    .attr('height',60)
                                countryPath.append('image')
                                    .attr('class','countryFlag')
                                    .attr('id',ele.to+' image')
                                    .attr('xlink:href',function(){return '../../resource/CountryPictures/'+ele.to+'.png'})
                                    .attr('x',d3.event.offsetX+140)
                                    .attr('y',d3.event.offsetY-125)
                                    .attr('width',60)
                                    .attr('height',60)
                                countryPath.append('text')
                                    .attr('class','totalTransferArrow')
                                    .text("======>")
                                    .attr('x',d3.event.offsetX+80)
                                    .attr('y',d3.event.offsetY-115)
                                    .style('font-size',15)
                                if(ele.from!=ele.to){
                                    countryPath.append('text')
                                        .attr('class','totalTransferArrow')
                                        .text("<======")
                                        .attr('x',d3.event.offsetX+80)
                                        .attr('y',d3.event.offsetY-65)
                                        .style('font-size',15)
                                    countryPath.append('text')
                                        .attr('class','transferLabel')
                                        .text("IN TATOL")
                                        .attr('x',d3.event.offsetX+90)
                                        .attr('y',d3.event.offsetY-95)
                                        .style('font-size',10)
                                }
                                countryPath.append('text')
                                    .attr('class','transferLabel')
                                    .text(ele.from)
                                    .attr('x',d3.event.offsetX+30)
                                    .attr('y',d3.event.offsetY-55)
                                    .style('font-size',8)
                                countryPath.append('text')
                                    .attr('class','transferLabel')
                                    .text(ele.to)
                                    .attr('x',d3.event.offsetX+155)
                                    .attr('y',d3.event.offsetY-55)
                                    .style('font-size',8)
                            })
                            .on('mouseout',(ele,i)=>{
                                d3.selectAll('.transferLabelBase').remove()
                                d3.selectAll('.transferLabel').remove()
                                d3.selectAll('.countryFlag').remove()
                                d3.selectAll('.totalTransferArrow').remove()
                            })
                            .on('click',function(ele,i){
                                clickedButton=undefined
                                d3.selectAll('.typeButtonText')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                d3.selectAll('.typeButtonBase')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                d3.selectAll('.typeButtonTitle')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                d3.selectAll('.countryPoint')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('r',function(d){
                                        if(d.from!=name&&d.to!=name)
                                            return 0
                                        else
                                            return 5
                                    })
                                clickedPath=ele
                                var from=ele['from']
                                var to=ele['to']
                                var showDataList=[]
                                for(var i=0;i<pd.length;i++)
                                    for(var j=0;j<pd[i]["transfer history"].length;j++){
                                        if(pd[i]["transfer history"][j]["season"]==ele['season']){
                                            if ((pd[i]["transfer history"][j]["moving from"]["country"]==from&&pd[i]["transfer history"][j]["moving to"]["country"]==to)||(pd[i]["transfer history"][j]["moving from"]["country"]==to&&pd[i]["transfer history"][j]["moving to"]["country"]==from)){
                                                var obj={
                                                    "transfer":pd[i]["transfer history"][j],
                                                    "club country":pd[i]['club country'],
                                                    "club name":pd[i]['club name'],
                                                    "current market value":pd[i]['current market value'],
                                                    "date of birth":pd[i]['date of birth'],
                                                    "name":pd[i]['name'],
                                                    "position":pd[i]['position'],
                                                    "nationality":pd[i]['nationality'],
                                                    "date of birth":pd[i]['date of birth']
                                                }
                                                showDataList.push(obj)
                                            }
                                        }
                                    }

                                console.log("detail data number: "+showDataList.length)
                                d3.selectAll('.countryPoint')
                                    .transition()
                                    .duration(durationTime)
                                    .style('fill-opacity',0)
                                var clickedLinePath
                                d3.selectAll('.totalLine')
                                    .transition()
                                    .delay(function(d){
                                        if((d['from']==from&&d['to']==to)||(d['to']==from&&d['from']==to))
                                            return durationTime/2
                                        else
                                            return 0
                                    })
                                    .duration(durationTime*0.8)
                                    //detail transition
                                    .attr('d',function(d){
                                        if((d['from']==from&&d['to']==to)||(d['to']==from&&d['from']==to)){
                                            var str="M"+String(cc[d['from']][d['to']][0])+","+String(cc[d['from']][d['to']][1])+' c0,0 0,0 '+String(cc[d['to']][d['from']][0]-cc[d['from']][d['to']][0])+","+String(cc[d['to']][d['from']][1]-cc[d['from']][d['to']][1])
                                            clickedLinePath=str
                                            return str
                                        }
                                        else{
                                            var str="M"+String(cc[d['from']][d['to']][0])+","+String(cc[d['from']][d['to']][1])+' c0,0 0,0 0,0'
                                            return str
                                        }
                                        var str="M"+String(cc[d['from']][d['to']][0])+","+String(cc[d['from']][d['to']][1])+' c0,0 0,0 0,0'
                                        return str
                                    })
                                d3.selectAll('.transferLabelBase').remove()
                                d3.selectAll('.transferLabel').remove()
                                d3.selectAll('.countryFlag').remove()
                                d3.selectAll('.totalTransferArrow').remove()
                                setTimeout(function(){
                                    d3.selectAll('.countryPoint').remove()
                                    d3.selectAll('.totalLine').remove()
                                },durationTime*1.5)
                                country.selectAll('.country')
                                    .transition()
                                    .duration(durationTime)
                                    .style('fill',function(d,i){
                                        var newFrom,newTo
                                        if(from=="England")
                                            newFrom="United Kingdom"
                                        else
                                            newFrom=from
                                        if(to=="England")
                                            newTo="United Kingdom"
                                        else
                                            newTo=to
                                        if(d.properties.name==newFrom||d.properties.name==newTo)
                                            return "#66CC66"
                                        else 
                                            return "#000010"
                                    })
                                country.selectAll('.otherCountry')
                                    .transition()
                                    .duration(durationTime)
                                    .style('fill',"#000010")
                                d3.select('#mapSvg')
                                    .transition()
                                    .duration(durationTime)
                                    .style('background-color',"#000010")
                                countryPath.selectAll('.detailPath')
                                    .data(showDataList)
                                    .enter()
                                    .append('path')
                                    .attr('class','detailPath')
                                    .attr('id',function(d){return d.name})
                                    .attr('stroke',function(d){
                                        var color=(256-Math.round(d.transfer['transfer fee']/1000000)).toString(16)
                                        if(color.length==1)
                                            color='0'+color
                                        else if(color.length==3)
                                            color='ff'
                                        return '#ff'+color+'00'
                                    })
                                    .attr('stroke-width',5)
                                    .attr('fill','none')
                                    .style('stroke-opacity',0)
                                    .attr('d',clickedLinePath)
                                    .transition()
                                    .delay(durationTime*1.2)
                                    .duration(durationTime)
                                    .attr('d',function(d,i){
                                        var newFrom=d.transfer["moving from"].country
                                        var newTo=d.transfer["moving to"].country
                                        var a=cc[newFrom][newTo][0]
                                        var b=cc[newFrom][newTo][1]
                                        var c=cc[newTo][newFrom][0]
                                        var d=cc[newTo][newFrom][1]
                                        if(newFrom!=newTo){
                                            var e=(a+b+c-d)/2
                                            var f=(b+c+d-a)/2
                                            var w=3*i/showDataList.length
                                            var cx=(cc[newFrom][newTo][0]+cc[newTo][newFrom][0])/2
                                            var cy=(cc[newFrom][newTo][1]+cc[newTo][newFrom][1])/2
                                            return "M"+a+','+b+" c0,0 "+(w*(e-cx)+cx-a)+','+(w*(f-cy)+cy-b)+" "+(c-a)+","+(d-b)
                                        }
                                        else{
                                            var w=(i+1)/showDataList.length
                                            var r=500*w+100
                                            var str="M"+a+","+b+' '+'c'+String(-r*0.6)+','+String(-r*0.5)+' '+(r*0.6)+','+String(-r*0.5)+" "+String(cc[to][from][0]-cc[from][to][0])+","+String(cc[to][from][1]-cc[from][to][1])
                                            return str
                                        }
                                    })
                                    .style('stroke-opacity',0.8)
                                countryPath.append('circle')
                                    .attr('class','detailCountryPoint')
                                    .attr('r',5)
                                    .attr('cx',cc[from][to][0])
                                    .attr('cy',cc[from][to][1])
                                countryPath.append('circle')
                                    .attr('class','detailCountryPoint')
                                    .attr('r',5)
                                    .attr('cx',cc[to][from][0])
                                    .attr('cy',cc[to][from][1])   



                                function detailTransferEvent(){
                                    var buttonsY=80
                                    var buttonsX=30
                                    function ImageExist(url) 
                                        {
                                           var img = new Image();
                                           img.src = url;
                                           return img.height != 0;
                                        }
                                    countryPath.selectAll('.detailPath')
                                        .on('mouseover',function(ele,i){
                                            countryPath.append('rect')
                                                .attr('id',i+'-detail-transfer-label-base-r')
                                                .attr('class','detailTransferLabelBase')
                                                .attr('x', d3.event.offsetX+50)
                                                .attr('y',d3.event.offsetY-90)
                                                .attr('rx', 20)
                                                .attr('ry',20)
                                                .attr('width',baseWidth)
                                                .attr('height',150)
                                            countryPath.append('marker')
                                                .attr('id',i+'-detail-transfer-label-base-t')
                                                .attr('class','detailTransferLabelBase')
                                                .attr('markerWidth',20)
                                                .attr('markerHeight',10)
                                                .attr('refx',2)
                                                .attr('refy',6)
                                                .append('path')
                                                .attr('d',function(){
                                                    return "M0,0 L1,0 L1,2"
                                                })
                                            countryPath.append('line')
                                                .attr('id',i+'-detail-transfer-label-base-l')
                                                .attr('class','detailTransferLabelBase')
                                                .attr('x1',d3.event.offsetX+40)
                                                .attr('y1',d3.event.offsetY+20)
                                                .attr('x2',d3.event.offsetX+40)
                                                .attr('y2',d3.event.offsetY+20)
                                                .attr('stroke','lightblue')
                                                .attr('stroke-width',10)
                                                .attr('marker-end','url(#'+i+'-detail-transfer-label-base-t)')
                                            //player image
                                            countryPath.append('image')
                                                .attr('class','playerImage')
                                                .attr('id',ele.name+' image')
                                                .attr('xlink:href',function(){
                                                    if (ImageExist('../../resource/Pictures/'+ele.name+".png")==true)
                                                        return '../../resource/Pictures/'+ele.name+".png"
                                                    else
                                                        return '../../resource/Pictures/noImage.png'
                                                })
                                                .attr('x',d3.event.offsetX+55)
                                                .attr('y',d3.event.offsetY-80)
                                                .attr('width',80)
                                                .attr('height',80)
                                            //player name
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(function(){
                                                    var nameList=ele.name.split(' ')
                                                    var newName=''
                                                    for(var i=0;i<nameList.length;i++){
                                                        var n=nameList[i][0].toUpperCase()+nameList[i].slice(1,nameList[i].length)
                                                        newName+=(n+' ')
                                                    }
                                                    return newName
                                                })
                                                .attr('x',d3.event.offsetX+141)
                                                .attr('y',d3.event.offsetY-65)
                                                .style('font-size',9)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(function(){return ele.nationality})
                                                .attr('x',d3.event.offsetX+141)
                                                .attr('y',d3.event.offsetY-45)
                                                .style('font-size',9)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(function(){return ele['date of birth'].split('Happy Birthday')[0]})
                                                .attr('x',d3.event.offsetX+141)
                                                .attr('y',d3.event.offsetY-25)
                                                .style('font-size',9)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(function(){return ele.position.split(' - ')[1]})
                                                .attr('x',d3.event.offsetX+141)
                                                .attr('y',d3.event.offsetY-5)
                                                .style('font-size',9)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text("€"+(ele.transfer['transfer fee']/1000000)+'m')
                                                .attr('x',d3.event.offsetX+130)
                                                .attr('y',d3.event.offsetY+35)
                                                .style('font-size',8)
                                            countryPath.append('image')
                                                .attr('class','clubImage')
                                                .attr('id',ele.name+' '+ele.transfer["moving from"].club+' image')
                                                .attr('xlink:href',function(){
                                                    if (ImageExist('../../resource/ClubPictures/'+ele.transfer["moving from"].club+".png")==true)
                                                        return '../../resource/ClubPictures/'+ele.transfer["moving from"].club+".png"
                                                    else
                                                        return '../../resource/ClubPictures/noImage.png'  
                                                })
                                                .attr('x',d3.event.offsetX+70)
                                                .attr('y',d3.event.offsetY+5)
                                                .attr('width',30)
                                                .attr('height',30)
                                            countryPath.append('image')
                                                .attr('class','clubImage')
                                                .attr('id',ele.name+' '+ele.transfer["moving to"].club+' image')
                                                .attr('xlink:href',function(){
                                                    if (ImageExist('../../resource/ClubPictures/'+ele.transfer["moving to"].club+".png")==true)
                                                        return '../../resource/ClubPictures/'+ele.transfer["moving to"].club+".png"
                                                    else
                                                        return '../../resource/ClubPictures/noImage.png'    
                                                })
                                                .attr('x',d3.event.offsetX+185)
                                                .attr('y',d3.event.offsetY+5)
                                                .attr('width',30)
                                                .attr('height',30)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text("========>")
                                                .attr('x',d3.event.offsetX+102)
                                                .attr('y',d3.event.offsetY+25)
                                                .style('font-size',15)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(ele.transfer["moving from"].club)
                                                .attr('x',d3.event.offsetX+75)
                                                .attr('y',d3.event.offsetY+42)
                                                .style('font-size',7)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(ele.transfer["moving to"].club)
                                                .attr('x',d3.event.offsetX+190)
                                                .attr('y',d3.event.offsetY+42)
                                                .style('font-size',7)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(ele.transfer["moving from"].country)
                                                .attr('x',d3.event.offsetX+75)
                                                .attr('y',d3.event.offsetY+48)
                                                .style('font-size',7)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(ele.transfer["moving to"].country)
                                                .attr('x',d3.event.offsetX+190)
                                                .attr('y',d3.event.offsetY+48)
                                                .style('font-size',7)
                                        })
                                        .on('mouseout',function(){
                                            d3.selectAll('.detailTransferLabelBase').remove()
                                            d3.selectAll('.playerImage').remove()
                                            d3.selectAll('.playerNameValue').remove()
                                            d3.selectAll('.clubImage').remove()
                                        })
                                    if(clickedPath!=undefined){
                                        d3.selectAll('.country')
                                            .on('click',function(ele,i){
                                                var name=ele.properties.name
                                                if (name=="United Kingdom")
                                                    name="England"
                                                if(name==clickedPath.from||name==clickedPath.to){
                                                    d3.selectAll('.country')
                                                        .transition()
                                                        .duration(durationTime)
                                                        .style('fill',function(d){
                                                            var countryName=d.properties.name
                                                                if (countryName=="United Kingdom")
                                                                    countryName="England"
                                                                if(countryName==name)
                                                                    return "#66CC66"
                                                                else
                                                                    return "#000010"
                                                        })
                                                        var transferPathType=['ALL','IN',"OUT"]
                                                        var transferPathTypeSpace=svg.selectAll('.transferPathTypeButton')
                                                            .data(transferPathType)
                                                            .enter()
                                                        transferPathTypeSpace.append('rect')
                                                            .attr('id',function(d){return d+' base'})
                                                            .attr('class','transferPathTypeButtonBase')
                                                            .attr('width',40)
                                                            .attr('height',20)
                                                            .attr('x',buttonsX)
                                                            .attr('y',function(d,i){
                                                                return 5*buttonsY+i*30-12
                                                            })
                                                            .attr('rx', 5)
                                                            .attr('ry',5)
                                                            .style('fill','#000020')
                                                            .style('stroke','lightblue')
                                                            .attr('stroke-opacity',0)
                                                            .transition()
                                                            .duration(durationTime*2)
                                                            .attr('stroke-opacity',1)
                                                        transferPathTypeSpace.append('text')
                                                            .text(function(d){return d})
                                                            .attr('id',function(d){return d})
                                                            .attr('class','transferPathTypeButtonText')
                                                            .attr('x',buttonsX+10)
                                                            .attr('y',function(d,i){
                                                                return 5*buttonsY+i*30+1
                                                            })
                                                            .style('font-size',10)
                                                            .style('fill','lightblue')
                                                            .attr('fill-opacity',0)
                                                            .transition()
                                                            .duration(durationTime*2)
                                                            .attr('fill-opacity',1)
                                                        svg.append('text')
                                                            .attr('class','transferPathTypeButtonTitle')
                                                            .text("TRANSFER TYPE")
                                                            .attr('y',5*buttonsY-30)
                                                            .attr('x',buttonsX-22)
                                                            .style('font-size',10)
                                                            .attr('fill-opacity',0)
                                                            .transition()
                                                            .duration(durationTime*2)
                                                            .attr('fill-opacity',1)
                                                        document.getElementById('ALL base').style.fill="lightblue"
                                                        document.getElementById('ALL').style.fill="#000020"
                                                        clickedTransferType='ALL'
                                                        svg.selectAll(".transferPathTypeButtonText")
                                                            .on("click",function(pathele,i){
                                                                var elelist=document.getElementsByClassName('transferPathTypeButtonText')
                                                                for(var i=0;i<elelist.length;i++){
                                                                    elelist[i].style.fill='lightblue'
                                                                }
                                                                clickedTypeButton=pathele
                                                                elelist=document.getElementsByClassName('transferPathTypeButtonBase')
                                                                for(var i=0;i<elelist.length;i++){
                                                                    elelist[i].style.fill='#000020'
                                                                }
                                                                document.getElementById(pathele+' base').style.fill="lightblue"
                                                                document.getElementById(pathele).style.fill="#000020"
                                                                function drawDetailPath(d,i){
                                                                    var newFrom=d.transfer["moving from"].country
                                                                    var newTo=d.transfer["moving to"].country
                                                                    var a=cc[newFrom][newTo][0]
                                                                    var b=cc[newFrom][newTo][1]
                                                                    var c=cc[newTo][newFrom][0]
                                                                    var d=cc[newTo][newFrom][1]
                                                                    if(newFrom!=newTo){
                                                                        var e=(a+b+c-d)/2
                                                                        var f=(b+c+d-a)/2
                                                                        var w=3*i/showDataList.length
                                                                        var cx=(cc[newFrom][newTo][0]+cc[newTo][newFrom][0])/2
                                                                        var cy=(cc[newFrom][newTo][1]+cc[newTo][newFrom][1])/2
                                                                        return "M"+a+','+b+" c0,0 "+(w*(e-cx)+cx-a)+','+(w*(f-cy)+cy-b)+" "+(c-a)+","+(d-b)
                                                                    }
                                                                    else{
                                                                        var w=(i+1)/showDataList.length
                                                                        var r=500*w+100
                                                                        var str="M"+a+","+b+' '+'c'+String(-r*0.6)+','+String(-r*0.5)+' '+(r*0.6)+','+String(-r*0.5)+" "+String(cc[to][from][0]-cc[from][to][0])+","+String(cc[to][from][1]-cc[from][to][1])
                                                                        return str
                                                                    }
                                                                }
                                                                d3.selectAll('.detailPath')
                                                                    .transition()
                                                                    .delay(function(d,i){return i*50})
                                                                    .duration(durationTime)
                                                                    .attr('d',function(d,i){
                                                                        if(pathele=='IN'){
                                                                            if(d.transfer['moving from'].country==name){
                                                                                var str="M"+String(cc[d.transfer['moving from'].country][d.transfer['moving to'].country][0])+","+String(cc[d.transfer['moving from'].country][d.transfer['moving to'].country][1])+' c0,0 0,0 0,0'
                                                                                return str
                                                                            }
                                                                            else
                                                                                return drawDetailPath(d,i)
                                                                        }
                                                                        if(pathele=='OUT'){
                                                                            if(d.transfer['moving to'].country==name){
                                                                                var str="M"+String(cc[d.transfer['moving from'].country][d.transfer['moving to'].country][0])+","+String(cc[d.transfer['moving from'].country][d.transfer['moving to'].country][1])+' c0,0 0,0 0,0'
                                                                                return str
                                                                            }
                                                                            else
                                                                                return drawDetailPath(d,i)
                                                                        }
                                                                        if(pathele=='ALL'){
                                                                            return drawDetailPath(d,i)
                                                                        }
                                                                    })
                                                                    .style('stroke-opacity',function(d,i){
                                                                        if(pathele=='IN'){
                                                                            if(d.transfer['moving from'].country==name){
                                                                                return 0
                                                                            }
                                                                            else
                                                                                return 0.8
                                                                        }
                                                                        if(pathele=='OUT'){
                                                                            if(d.transfer['moving to'].country==name){
                                                                                return 0
                                                                            }
                                                                            else
                                                                                return 0.8
                                                                        }
                                                                        if(pathele=='ALL'){
                                                                            return 0.8
                                                                        }
                                                                    })
                                                            })
                                                            .on('mouseover',function(pathele,i){
                                                                if(pathele!=clickedTypeButton){
                                                                    var el=document.getElementById(pathele)
                                                                    el.style.fill='white'
                                                                    el=document.getElementById(pathele+' base')
                                                                    el.style.fill='gray'
                                                                }
                                                            })
                                                            .on('mouseout',function(pathele,i){
                                                                if (pathele!=clickedTypeButton) {
                                                                    var el=document.getElementById(pathele)
                                                                    el.style.fill='lightblue'
                                                                    el=document.getElementById(pathele+' base')
                                                                    el.style.fill='#000020'
                                                                }
                                                            })

                                                }
                                            })
                                    }
                                }
                                detailTransferEvent()
                            })
                    }
                    function changeCountryColor(){
                        for(var i=0;i<targetCountries.length;i++){
                            var obj={
                                "country":targetCountries[i],
                                "all":0,
                                "out":0,
                                "in":0,
                                "self":0
                            }
                            transferValue.push(obj)
                        }
                        for(var i=0;i<macroscopicTransfer.length;i++){
                            if (macroscopicTransfer[i]['from']==macroscopicTransfer[i]['to']){
                                for(var j=0;j<transferValue.length;j++)
                                    if(transferValue[j]['country']==macroscopicTransfer[i]['from']){
                                        transferValue[j]['self']+=macroscopicTransfer[i]['value']
                                        transferValue[j]['all']+=macroscopicTransfer[i]['value']
                                    }
                            }
                            else{
                                for(var j=0;j<transferValue.length;j++){
                                    if(transferValue[j]['country']==macroscopicTransfer[i]['from']){
                                        transferValue[j]['in']+=macroscopicTransfer[i][macroscopicTransfer[i]['to']+' to '+macroscopicTransfer[i]['from']+' Value']
                                        transferValue[j]['out']+=macroscopicTransfer[i][macroscopicTransfer[i]['from']+' to '+macroscopicTransfer[i]['to']+' Value']
                                        transferValue[j]['all']+=macroscopicTransfer[i]['value']
                                    }
                                    if(transferValue[j]['country']==macroscopicTransfer[i]['to']){
                                        transferValue[j]['in']+=macroscopicTransfer[i][macroscopicTransfer[i]['from']+' to '+macroscopicTransfer[i]['to']+' Value']
                                        transferValue[j]['out']+=macroscopicTransfer[i][macroscopicTransfer[i]['to']+' to '+macroscopicTransfer[i]['from']+' Value']
                                        transferValue[j]['all']+=macroscopicTransfer[i]['value']
                                    }
                                }
                            }
                        }
                        for(var i=0;i<transferValue.length;i++){
                            var id='#'+transferValue[i]['country']
                            if(transferValue[i]['country']=="England")
                                id='#UK'
                            d3.selectAll(id)
                                .transition()
                                .duration(durationTime)
                                .style('fill',function(d){
                                    var value=transferValue[i]['all']/1000000
                                    value=Math.round(256-Math.pow(value,1/4)*40).toString(16)
                                    if(value.length==1)
                                        value='0'+value
                                    return "#00"+value+'00'
                                })
                        }
                    }
                    preprocessTotalTransferData()
                    drawTotalTransferPath()
                    totalAndDetailTransferEvent()
                    if(typeof(clickedButton)!='undefined')
                        changeCountryColor()
                }
                function showColorScale(){
                    //color scale
                    var colorScale=[0,1,2,3,4,5,6,7,8]
                    var colorScaleSvg=svg.append('g')
                    var color=colorScaleSvg.selectAll('.cs')
                        .data(colorScale)
                        .enter()
                    color.append('rect')
                        .attr('class','colorScale')
                        .attr('width',40)
                        .attr('height',12)
                        .attr('x',function(d,i){return 1000+i*40})
                        .attr('y',50)
                        .style('fill',function(d){
                            if (d==0)
                                return "#ffff00"
                            else{
                                stick=(256-d*32).toString(16)
                                if(stick.length==1)
                                    stick='0'+stick
                                return '#'+'ff'+stick+"00"
                            }
                        })
                    color.append('rect')
                        .attr('class','colorStick')
                        .attr('width',function(d){
                            if(d!=0)
                                return 1
                        })
                        .attr('height',15)
                        .attr('x',function(d,i){return 1000+i*40})
                        .attr('y',50)
                    color.append('text')
                        .attr('class','colorStickText')
                        .attr('x',function(d,i){return 1028+i*40})
                        .attr('y',75)
                        .text(function(d){
                            if(d!=8){
                                var value=Math.pow(((d+1)*32/50),4)
                                value=Math.round(value)
                                return ('€'+value).toString()+'m'
                            }
                        })
                        .style('font-size',8)
                    colorScaleSvg.append('text')
                        .text('Transfer Line Value Color Scale')
                        .attr('x',1000)
                        .attr('y',40)
                        .attr('class','colorStickText')
                        .style('font-size',15)
                    color.append('rect')
                        .attr('class','countryColorScale')
                        .attr('width',40)
                        .attr('height',12)
                        .attr('x',function(d,i){return 1000+i*40})
                        .attr('y',120)
                        .style('fill',function(d){
                            if (d==0)
                                return "#00ff00"
                            else{
                                stick=(256-d*32).toString(16)
                                if(stick.length==1)
                                    stick='0'+stick
                                return '#'+'00'+stick+"00"
                            }
                        })
                    color.append('rect')
                        .attr('class','colorStick')
                        .attr('width',function(d){
                            if(d!=0)
                                return 1
                        })
                        .attr('height',15)
                        .attr('x',function(d,i){return 1000+i*40})
                        .attr('y',120)
                    color.append('text')
                        .attr('class','colorStickText')
                        .attr('x',function(d,i){return 1028+i*40})
                        .attr('y',145)
                        .text(function(d){
                            if(d!=8){
                                var value=Math.pow(((d+1)*32/40),4)
                                value=Math.round(value)
                                return ('€'+value).toString()+'m'
                            }
                        })
                        .style('font-size',8)
                    colorScaleSvg.append('text')
                        .text('Country Active Capital Color Scale')
                        .attr('x',1000)
                        .attr('y',110)
                        .attr('class','colorStickText')
                        .style('font-size',15)
                    //mouseover event
                    countries.selectAll('.country')
                        .on('mouseover',(ele,i)=>{
                            countries.append('text')
                                .attr('id',ele.id+'-label')
                                .attr('class','totalTransferLabel')
                                .attr('x',110)
                                .attr('y',780)
                                .text(function(){
                                    return ele.properties.name
                                })
                                .attr('font-size',15)
                        })
                        .on('mouseout',(ele,i)=>{
                            d3.selectAll('#'+ele.id+'-label').remove()
                        })
                    countries.selectAll('.otherCountry')
                        .on('mouseover',(ele,i)=>{
                            countries.append('text')
                                .attr('id',ele.id+'-label')
                                .attr('class','totalTransferLabel')
                                .attr('x',110)
                                .attr('y',780)
                                .text(function(){
                                    return ele.properties.name
                                })
                                .attr('font-size',15)
                        })
                        .on('mouseout',(ele,i)=>{
                            d3.selectAll('#'+ele.id+'-label').remove()
                    })
                }
                function showButton(){
                    var season=[]
                    var sea=[]
                    var buttonsY=80
                    var buttonsX=30
                    season=['17/18','16/17','15/16','14/15','13/14','12/13','11/12','10/11','09/10','CLEAR']
                    transferType=['ALL TRANSFER','TRANSFER IN','TRANSFER OUT','SELF TRANSFER']
                    var button=svg.append('g')
                    button.append('rect')
                        .attr('class','buttonBase')
                        .attr('x',0)
                        .attr('y',0)
                        .attr('width',100)
                        .attr('height',800)
                    var buttonSpace=button.selectAll('.seasonButton')
                        .data(season)
                        .enter()
                    buttonSpace.append('rect')
                        .attr('id',function(d){return d+' base'})
                        .attr('class','eachButtonBase')
                        .attr('width',60)
                        .attr('height',15)
                        .attr('x',buttonsX-10)
                        .attr('y',function(d,i){
                            return buttonsY+i*20-12
                        })
                        .attr('rx', 5)
                        .attr('ry',5)
                    buttonSpace.append('text')
                        .text(function(d){return d})
                        .attr('id',function(d){return d})
                        .attr('class','buttonText')
                        .attr('x',buttonsX)
                        .attr('y',function(d,i){
                            return buttonsY+i*20
                        })
                        .style('font-size',13)
                    button.append('text')
                        .text("SEASON")
                        .attr('y',buttonsY-30)
                        .attr('x',buttonsX-10)
                        .attr('class','seasonTitle')
                        .style('font-size',15)
                    //click event
                    button.selectAll(".buttonText")
                        .on("click",function(ele,i){
                            if (clickedButton==undefined) {
                                var typeButtonSpace=button.selectAll('.typeButton')
                                    .data(transferType)
                                    .enter()
                                typeButtonSpace.append('rect')
                                    .attr('id',function(d){return d+' base'})
                                    .attr('class','typeButtonBase')
                                    .attr('width',80)
                                    .attr('height',15)
                                    .attr('x',buttonsX-20)
                                    .attr('y',function(d,i){
                                        return 5*buttonsY+i*20-12
                                    })
                                    .attr('rx', 5)
                                    .attr('ry',5)
                                    .style('fill','#000020')
                                    .style('stroke','lightblue')
                                    .attr('stroke-opacity',0)
                                    .transition()
                                    .duration(durationTime*2)
                                    .attr('stroke-opacity',1)
                                typeButtonSpace.append('text')
                                    .text(function(d){return d})
                                    .attr('id',function(d){return d})
                                    .attr('class','typeButtonText')
                                    .attr('x',buttonsX-10)
                                    .attr('y',function(d,i){
                                        return 5*buttonsY+i*20-2
                                    })
                                    .style('font-size',8)
                                    .style('fill','lightblue')
                                    .attr('fill-opacity',0)
                                    .transition()
                                    .duration(durationTime*2)
                                    .attr('fill-opacity',1)
                                button.append('text')
                                    .attr('class','typeButtonTitle')
                                    .text("ACTIVE CAPITAL")
                                    .attr('y',5*buttonsY-45)
                                    .attr('x',buttonsX-22)
                                    .style('font-size',10)
                                    .attr('fill-opacity',0)
                                    .transition()
                                    .duration(durationTime*2)
                                    .attr('fill-opacity',1)
                                button.append('text')
                                    .text("BY COUNTRY")
                                    .attr('y',5*buttonsY-30)
                                    .attr('x',buttonsX-15)
                                    .attr('class','typeButtonTitle')
                                    .style('font-size',10)
                                    .attr('fill-opacity',0)
                                    .transition()
                                    .duration(durationTime*2)
                                    .attr('fill-opacity',1)
                                document.getElementById('ALL TRANSFER base').style.fill="lightblue"
                                document.getElementById('ALL TRANSFER').style.fill="#000020"
                                clickedTypeButton='ALL TRANSFER'
                                button.selectAll(".typeButtonText")
                                    .on("click",function(ele,i){
                                        var elelist=document.getElementsByClassName('typeButtonText')
                                        for(var i=0;i<elelist.length;i++){
                                            elelist[i].style.fill='lightblue'
                                        }
                                        clickedTypeButton=ele
                                        elelist=document.getElementsByClassName('typeButtonBase')
                                        for(var i=0;i<elelist.length;i++){
                                            elelist[i].style.fill='#000020'
                                        }
                                        document.getElementById(ele+' base').style.fill="lightblue"
                                        document.getElementById(ele).style.fill="#000020"
                                        for(var i=0;i<transferValue.length;i++){
                                            var id='#'+transferValue[i]['country']
                                            if(transferValue[i]['country']=="England")
                                                id='#UK'
                                            d3.selectAll(id)
                                                .transition()
                                                .duration(durationTime)
                                                .style('fill',function(d){
                                                    var value
                                                    if(ele=="ALL TRANSFER")
                                                        value=transferValue[i]['all']/1000000
                                                    else if(ele=="TRANSFER IN")
                                                        value=transferValue[i]['in']/1000000
                                                    else if(ele=="TRANSFER OUT")
                                                        value=transferValue[i]['out']/1000000
                                                    else if(ele=="SELF TRANSFER")
                                                        value=transferValue[i]['self']/1000000
                                                    value=Math.round(256-Math.pow(value,1/4)*40).toString(16)
                                                    if(value.length==1)
                                                        value='0'+value
                                                    return "#00"+value+'00'
                                                })
                                        }
                                    })
                                    .on('mouseover',function(ele,i){
                                        if(ele!=clickedTypeButton){
                                            var el=document.getElementById(ele)
                                            el.style.fill='white'
                                            el=document.getElementById(ele+' base')
                                            el.style.fill='gray'
                                        }
                                    })
                                    .on('mouseout',function(ele,i){
                                        if (ele!=clickedTypeButton) {
                                            var el=document.getElementById(ele)
                                            el.style.fill='lightblue'
                                            el=document.getElementById(ele+' base')
                                            el.style.fill='#000020'
                                        }
                                    })
                                    // d3.selectAll('.country')
                                    //     .on('mouseover',function(ele,i){
                                    //         var id=ele.properties.name
                                    //         if(id=="United Kingdom")
                                    //             id="UK"
                                    //         console.log(document.getElementById(id).style.fill)
                                    //         console.log(id)
                                    //     })
                            }
                            var elelist=document.getElementsByClassName('buttonText')
                            for(var i=0;i<elelist.length;i++){
                                elelist[i].style.fill='lightblue'
                            }
                            clickedTypeButton="ALL TRANSFER"
                            var el=document.getElementById(ele)
                            d3.selectAll('.countryPoint')
                                .transition()
                                .delay(function(d,i){
                                    return (i)*40
                                })
                                .duration(durationTime/2)
                                .style('fill-opacity',0)
                                .attr('r',0)
                            d3.selectAll('.detailCountryPoint')
                                .transition()
                                .delay(durationTime/2)
                                .duration(durationTime/3)
                                .style('fill-opacity',0)
                                .attr('r',0)
                            d3.selectAll('.totalLine')
                                .transition()
                                .delay(function(d,i){return (i)*80})
                                .duration(durationTime*0.8)
                                .style('stroke-opacity',0)
                                .attr('d',function(d){
                                    var str="M"+String(cc[d['from']][d['to']][0])+","+String(cc[d['from']][d['to']][1])+' c0,0 0,0 0,0'
                                    return str
                                })
                            d3.selectAll('.detailPath')
                                .transition()
                                .delay(function(d,i){return (i)*30})
                                .duration(durationTime)
                                .style('stroke-opacity',0)
                            d3.selectAll('.countryPoint').transition().delay(durationTime*3).remove()
                            d3.selectAll('.detailCountryPoint').transition().delay(durationTime*3).remove()
                            d3.selectAll('.totalLine').transition().delay(durationTime*4.5).remove()
                            d3.selectAll('.detailPath').transition().delay(durationTime*3).remove()
                            d3.selectAll('.transferPathTypeButtonText')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                d3.selectAll('.transferPathTypeButtonBase')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                d3.selectAll('.transferPathTypeButtonTitle')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                clickedTransferType=undefined
                                clickedPath=undefined
                            if(ele!='CLEAR'){
                                clickedButton=ele
                                showData(ele)                  
                                el.style.fill='#000020'
                            }
                            else{
                                d3.selectAll('.country')
                                    .transition()
                                    .duration(durationTime)
                                    .style('fill','#003B00')
                                d3.selectAll('.typeButtonText')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                d3.selectAll('.typeButtonBase')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                d3.selectAll('.typeButtonTitle')
                                    .transition()
                                    .duration(durationTime)
                                    .attr('fill-opacity',0)
                                    .remove()
                                clickedButton=undefined
                            }
                            country.selectAll('.otherCountry')
                                .transition()
                                .duration(durationTime)
                                .style('fill',"#000015")
                            d3.selectAll('#mapSvg')
                                .transition()
                                .duration(durationTime)
                                .style('background-color',"#000030")
                            elelist=document.getElementsByClassName('eachButtonBase')
                            for(var i=0;i<elelist.length;i++){
                                elelist[i].style.fill='#000020'
                            }
                            if(ele!='CLEAR')
                                document.getElementById(ele+' base').style.fill="lightblue"
                            var elelist=document.getElementsByClassName('typeButtonText')
                            for(var i=0;i<elelist.length;i++){
                                elelist[i].style.fill='lightblue'
                            }
                            elelist=document.getElementsByClassName('typeButtonBase')
                            for(var i=0;i<elelist.length;i++){
                                elelist[i].style.fill='#000020'
                            }
                        })
                        .on('mouseover',function(ele,i){
                            if(ele!=clickedButton){
                                var el=document.getElementById(ele)
                                el.style.fill='white'
                                el=document.getElementById(ele+' base')
                                el.style.fill='gray'
                            }
                        })
                        .on('mouseout',function(ele,i){
                            if (ele!=clickedButton) {
                                var el=document.getElementById(ele)
                                el.style.fill='lightblue'
                                el=document.getElementById(ele+' base')
                                el.style.fill='#000020'
                            }
                        })
                }
                function showUserInstruction(){
                    var ui=['· Choose SEASON to see transfer data of that season.',
                            '· Color of country shows total active capital. ',
                            '· Choose filter(left) to see in or out. ',
                            '· Mouse over line between countries to see detailed information. ',
                            '· Clicked line to see detailed information between two countries.',
                            '. Click one country of two and use filter(left) to see more details.'
                    ]
                    svg.append('rect')
                        .attr('x',1000)
                        .attr('y',170)
                        .attr('width',390)
                        .attr('height',160)
                        .style('fill','#000020')
                        .style('fill-opacity',0.8)
                        .style('stroke','white')
                    svg.append('text')
                        .attr('class','userInstruction')
                        .attr('x',1150)
                        .attr('y',190)
                        .text('User Instruction')
                        .style('font-size',15)
                    svg.selectAll('ui')
                        .data(ui)
                        .enter()
                        .append('text')
                        .attr('class','userInstruction')
                        .attr('x',1005)
                        .attr('y',function(d,i){return 210+i*20})
                        .text(function(d){return d})
                }
                showMap()
                showButton()
                showColorScale()
                showUserInstruction()
            })
        })
    })
}




