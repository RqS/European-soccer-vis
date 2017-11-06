function showMapView(){
    var center, countries, height, path, projection, scale, svg, width;
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
                var clickedPath=0
                function showMap(){
                    //draw map
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
                        .attr('id',function(d){return d.properties.name})
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
                                        var key=obj['from']+' to '+obj['to']
                                        obj[key]=1
                                        if(isNaN(parseInt(pd[i]["transfer history"][j]["transfer fee"]))==true)
                                            obj[key+" Value"]=0
                                        else
                                            obj[key+" Value"]=parseInt(pd[i]["transfer history"][j]["transfer fee"])
                                        var key=obj['to']+' to '+obj['from']
                                        obj[key]=0
                                        obj[key+" Value"]=0
                                        obj['num']=1
                                        obj['season']=seasonValue
                                        macroscopicTransfer.push(obj)
                                    }
                                }
                                for(var i=0;i<macroscopicTransfer.length;i++){
                                    var obj=[
                                        macroscopicTransfer[i]['from']+' <==> '+macroscopicTransfer[i]['to'],
                                        '€'+macroscopicTransfer[i]['value']/1000000+'m   '+macroscopicTransfer[i]['num']+' deals'
                                    ]
                                    var from=macroscopicTransfer[i]['from']
                                    var to=macroscopicTransfer[i]['to']
                                    if(macroscopicTransfer[i]['from']!=macroscopicTransfer[i]['to'])
                                    {
                                        obj.push(macroscopicTransfer[i]['from']+' ==> '+macroscopicTransfer[i]['to'])
                                        var key=macroscopicTransfer[i]['from']+' to '+macroscopicTransfer[i]['to']
                                        obj.push('€'+macroscopicTransfer[i][key+' Value']/1000000+'m      '+macroscopicTransfer[i][key]+' deals')
                                        obj.push(macroscopicTransfer[i]['from']+' <== '+macroscopicTransfer[i]['to'])
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
                            .attr('stroke',function(d){
                                var value=d['value']/1000000
                                value=Math.pow(value,1/4)*50
                                //console.log(d['from'],d['to'],d['value'],d[d['from']+' to '+d['to']],d[d['to']+' to '+d['from']])
                                if(value<=0.5)
                                    return '#ffff00'
                                else{
                                    
                                    value=Math.round(256-value).toString(16)
                                    color='#'+'ff'+value+"00"
                                    //console.log(color)
                                    return color
                                }
                                
                            })
                            .attr('stroke-width',7)
                            .attr('fill','none')
                            .style('stroke-opacity',0.85)
                        //draw country point
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
                    }
                    function totalAndDetailTransferEvent(){
                        var fontSize=12
                        var baseWidth=180
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
                                        if(i%2==0)
                                            return d3.event.offsetX+(baseWidth-d.length*fontSize/2.25)/2
                                        else
                                            return d3.event.offsetX+(baseWidth-d.length*fontSize/6)/2
                                    })
                                    .attr('y',function(d,i){
                                        if(i%2==0)
                                            return d3.event.offsetY-120+15*i
                                        else
                                            return d3.event.offsetY-120+15*i-3
                                    })
                                    .style('font-size',function(d,i){
                                        if(i%2==0)
                                            return fontSize
                                        else
                                            return 8
                                    })
                                    .style('fill',function(d,i){
                                        if(i%2==0)
                                            return '#000050'
                                        else
                                            return '#005000'
                                    })
                            })
                            .on('mouseout',(ele,i)=>{
                                d3.selectAll('.transferLabelBase').remove()
                                d3.selectAll('.transferLabel').remove()
                            })
                            .on('click',function(ele,i){
                                clickedPath=1
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
                                                    "position":pd[i]['position']
                                                }
                                                showDataList.push(obj)
                                            }
                                        }
                                    }
                                console.log("detail data number: "+showDataList.length)
                                d3.selectAll('.countryPoint').remove()
                                d3.selectAll('.transferLabelBase').remove()
                                d3.selectAll('.transferLabel').remove()
                                d3.selectAll('.totalLine').remove()
                                var conList=document.getElementsByClassName('country')
                                for(var i=0;i<conList.length;i++){
                                    var newFrom,newTo
                                    if(from=="England")
                                        newFrom="United Kingdom"
                                    else
                                        newFrom=from
                                    if(to=="England")
                                        newTo="United Kingdom"
                                    else
                                        newTo=to
                                    if(conList[i].id==newFrom||conList[i].id==newTo)
                                        conList[i].style.fill="#66CC66"
                                    else 
                                        conList[i].style.fill="#001000"
                                }
                                conList=document.getElementsByClassName('otherCountry')
                                for(var i=0;i<conList.length;i++){
                                    conList[i].style.fill="#001000"
                                }
                                document.getElementById('mapSvg').style['background-color']='#000010'
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
                                        //console.log('#'+color+color+color)
                                        return '#ff'+color+'00'
                                    })
                                    .attr('stroke-width',5)
                                    .attr('fill','none')
                                    .style('stroke-opacity',0.85)
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
                                countryPath.append('circle')
                                    .attr('class','countryPoint')
                                    .attr('r',8)
                                    .attr('cx',cc[from][to][0])
                                    .attr('cy',cc[from][to][1])
                                countryPath.append('circle')
                                    .attr('class','countryPoint')
                                    .attr('r',8)
                                    .attr('cx',cc[to][from][0])
                                    .attr('cy',cc[to][from][1])   



                                function detailTransferEvent(){
                                    countryPath.selectAll('.detailPath')
                                        .on('mouseover',function(ele,i){
                                            countryPath.append('rect')
                                                .attr('id',i+'-detail-transfer-label-base-r')
                                                .attr('class','detailTransferLabelBase')
                                                .attr('x', d3.event.offsetX+30)
                                                .attr('y',d3.event.offsetY-100)
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
                                                .attr('x1',d3.event.offsetX+20)
                                                .attr('y1',d3.event.offsetY)
                                                .attr('x2',d3.event.offsetX+20)
                                                .attr('y2',d3.event.offsetY)
                                                .attr('stroke','lightblue')
                                                .attr('stroke-width',10)
                                                .attr('marker-end','url(#'+i+'-detail-transfer-label-base-t)')
                                            //player image
                                            function ImageExist(url) 
                                                {
                                                   var img = new Image();
                                                   img.src = url;
                                                   return img.height != 0;
                                                }
                                            countryPath.append('image')
                                                .attr('class','playerImage')
                                                .attr('id',ele.name+' image')
                                                .attr('xlink:href',function(){
                                                    if (ImageExist('../../resource/Pictures/'+ele.name+".png")==true)
                                                        return '../../resource/Pictures/'+ele.name+".png"
                                                    else
                                                        return '../../resource/Pictures/noImage.png'
                                                })
                                                .attr('x',d3.event.offsetX+35)
                                                .attr('y',d3.event.offsetY-90)
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
                                                .attr('x',d3.event.offsetX+121)
                                                .attr('y',d3.event.offsetY-60)
                                                .style('font-size',9)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text("€"+(ele.transfer['transfer fee']/1000000)+'m')
                                                .attr('x',d3.event.offsetX+100)
                                                .attr('y',d3.event.offsetY+25)
                                                .style('font-size',8)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(function(){
                                                    return ele.position.split(' - ')[1]
                                                })
                                                .attr('x',d3.event.offsetX+121)
                                                .attr('y',d3.event.offsetY-20)
                                                .style('font-size',9)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(function(){
                                                    return ele.position.split(' - ')[0]
                                                })
                                                .attr('x',d3.event.offsetX+121)
                                                .attr('y',d3.event.offsetY-40)
                                                .style('font-size',9)
                                            countryPath.append('image')
                                                .attr('class','clubImage')
                                                .attr('id',ele.name+' '+ele.transfer["moving from"].club+' image')
                                                .attr('xlink:href',function(){
                                                    if (ImageExist('../../resource/ClubPictures/'+ele.transfer["moving from"].club+".png")==true)
                                                        return '../../resource/ClubPictures/'+ele.transfer["moving from"].club+".png"
                                                    else
                                                        return '../../resource/ClubPictures/noImage.png'  
                                                })
                                                .attr('x',d3.event.offsetX+50)
                                                .attr('y',d3.event.offsetY-5)
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
                                                .attr('x',d3.event.offsetX+145)
                                                .attr('y',d3.event.offsetY-5)
                                                .attr('width',30)
                                                .attr('height',30)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text("======>")
                                                .attr('x',d3.event.offsetX+80)
                                                .attr('y',d3.event.offsetY+15)
                                                .style('font-size',15)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(ele.transfer["moving from"].club)
                                                .attr('x',d3.event.offsetX+55)
                                                .attr('y',d3.event.offsetY+32)
                                                .style('font-size',6)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(ele.transfer["moving to"].club)
                                                .attr('x',d3.event.offsetX+150)
                                                .attr('y',d3.event.offsetY+32)
                                                .style('font-size',6)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(ele.transfer["moving from"].country)
                                                .attr('x',d3.event.offsetX+55)
                                                .attr('y',d3.event.offsetY+38)
                                                .style('font-size',6)
                                            countryPath.append('text')
                                                .attr('class','playerNameValue')
                                                .text(ele.transfer["moving to"].country)
                                                .attr('x',d3.event.offsetX+150)
                                                .attr('y',d3.event.offsetY+38)
                                                .style('font-size',6)
                                        })
                                        .on('mouseout',function(){
                                            d3.selectAll('.detailTransferLabelBase').remove()
                                            d3.selectAll('.playerImage').remove()
                                            d3.selectAll('.playerNameValue').remove()
                                            d3.selectAll('.clubImage').remove()
                                        })
                                }
                                detailTransferEvent()
                            })
                    }
                    preprocessTotalTransferData()
                    drawTotalTransferPath()
                    totalAndDetailTransferEvent() 
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
                        .attr('width',30)
                        .attr('height',8)
                        .attr('x',function(d,i){return 120+i*30})
                        .attr('y',20)
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
                        .attr('height',12)
                        .attr('x',function(d,i){return 120+i*30})
                        .attr('y',20)
                    color.append('text')
                        .attr('class','colorStickText')
                        .attr('x',function(d,i){return 143+i*30})
                        .attr('y',42)
                        .text(function(d){
                            if(d!=8)
                                return ((d+1)*64).toString()+'m'})
                        .style('font-size',5)
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
                                if(clickedPath==0){
                                    var el=document.getElementById(ele.properties.name)
                                    if(targetCountries.indexOf(el.id)!=-1||el.id=="United Kingdom")
                                        el.style.fill='#005B00'
                                }
                        })
                        .on('mouseout',(ele,i)=>{
                            d3.selectAll('#'+ele.id+'-label').remove()
                            if(clickedPath==0){
                                var el=document.getElementById(ele.properties.name)
                                if(targetCountries.indexOf(el.id)!=-1||el.id=="United Kingdom")
                                    el.style.fill='#003B00'
                            }
                        })
                        .on('click',function(){
                            alert("Jump to clubs' value by country")
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
                                .style('fill','#0000BB')
                        })
                        .on('mouseout',(ele,i)=>{
                            d3.selectAll('#'+ele.id+'-label').remove()
                    })
                }
                function showButton(){
                    clickedPath=0
                    var season=[]
                    var sea=[]
                    var buttonsY=140
                    var buttonsX=30
                    for(var i=0;i<pd.length;i++)
                        for(var j=0;j<pd[i]["transfer history"].length;j++){
                            var ele=pd[i]["transfer history"][j]["season"].slice(0,2)
                            if(season.indexOf(pd[i]["transfer history"][j]["season"])==-1&&ele[0]!=9)
                            { 
                                var k=0
                                for(;k<season.length;k++)
                                    if(parseInt(ele)>parseInt(season[k].slice(0,2))){
                                        season.splice(k,0,pd[i]["transfer history"][j]["season"])
                                        break
                                    }
                                if(k==season.length)
                                    season.push(pd[i]["transfer history"][j]["season"])
                            }
                            if(sea.indexOf(pd[i]["transfer history"][j]["season"])==-1&&ele[0]==9)
                            { 
                                var k=0
                                for(;k<sea.length;k++)
                                    if(parseInt(ele)>parseInt(sea[k].slice(0,2))){
                                        sea.splice(k,0,pd[i]["transfer history"][j]["season"])
                                        break
                                    }
                                if(k==sea.length)
                                    sea.push(pd[i]["transfer history"][j]["season"])
                            }
                        }
                    season=season.concat(sea)
                    season.push('CLEAR')
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
                    button.append('rect')
                        .attr('id','transformButtonBase')
                        .attr('class','transformButtonBase')
                        .attr('width',70)
                        .attr('height',15)
                        .attr('x',buttonsX-15)
                        .attr('y',750)
                        .attr('rx',5)
                        .attr('ry',5)
                    button.append('text')
                        .text("TRANSFORM")
                        .attr('id','transformButtonText')
                        .attr('class','transformButtonText')
                        .attr('x',buttonsX-11.8)
                        .attr('y',761)
                        .style('font-size',10)
                    //click event
                    var clickedButton
                    button.selectAll(".buttonText")
                        .on("click",function(ele,i){
                            var elelist=document.getElementsByClassName('buttonText')
                            for(var i=0;i<elelist.length;i++){
                                elelist[i].style.fill='lightblue'
                            }
                            clickedButton=ele
                            var el=document.getElementById(ele)
                            d3.selectAll('.totalLine').remove()
                            d3.selectAll('.countryPoint').remove()
                            d3.selectAll('.detailPath').remove()
                            if(ele!="CLEAR"){
                                showData(ele)
                                el.style.fill='#000020'
                            }
                            else{
                                el.style.fill='lightblue'
                            }
                            var conList=document.getElementsByClassName('otherCountry')
                            for(var i=0;i<conList.length;i++){
                                conList[i].style.fill="#001700"
                            }
                            conList=document.getElementsByClassName('country')
                            for(var i=0;i<conList.length;i++){
                                conList[i].style.fill="#003B00"
                            }
                            document.getElementById('mapSvg').style['background-color']='#000030'
                            elelist=document.getElementsByClassName('eachButtonBase')
                            for(var i=0;i<elelist.length;i++){
                                elelist[i].style.fill='#000020'
                            }
                            //document.getElementById(ele.id).style.fill='lightgrey'
                            document.getElementById(ele+' base').style.fill="lightblue"
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
                    button.selectAll('.transformButtonText')
                        .on('mouseover',function(ele,i){
                                var el=document.getElementById('transformButtonText')
                                el.style.fill='white'
                                el=document.getElementById('transformButtonBase')
                                el.style.fill='gray'
                        })
                        .on('mouseout',function(ele,i){
                                var el=document.getElementById('transformButtonText')
                                el.style.fill='lightblue'
                                el=document.getElementById('transformButtonBase')
                                el.style.fill='#000020'
                        })
                        .on('click',function(){
                            alert('Jump to in&out bar chart by year and by country')
                        })
                }
                showMap()
                showButton()
                showColorScale()
            })
        })
    })
}




