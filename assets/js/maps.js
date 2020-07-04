  
    var height = 450 ;
    var width = 450 ;

    var projection = d3.geoMercator()
        .scale(800)
        .translate([width / 2, height / 2]);
    
    var projection2 = d3.geoMercator()
        .scale(3100)
        .translate([width / 2, height / 2]);     

    var projection3 = d3.geoMercator()
        .scale(52000)
        .translate([width / 2, height / 2]);     

    var svg = d3.select("#testMap").append("svg").append("g")
        .attr("width", width)
        .attr("height", height )
    
    var head = d3.select("#head")
    var body = d3.select("#body")    

    var butt = d3.select("#test")

    var path = d3.geoPath()
        .projection(projection);

    var path2 = d3.geoPath()
        .projection(projection2);

    var path3 = d3.geoPath()
        .projection(projection3);
    
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        function arrayAverage(arr){
                //Find the sum
                var sum = 0;
                for(var i in arr) {
                    sum += arr[i];
                }
                //Get the length of the array
                var numbersCnt = arr.length;
                //Return the average / mean.
                return (sum / numbersCnt);
            }

    d3.queue()
    .defer(d3.json,"assets/maps/mum.json")
    .defer(d3.json,"assets/maps/maharashtra.json")
    .defer(d3.json,"assets/maps/india.json")
    .defer(d3.csv,"assets/data/test.csv")
    .await(ready)

    function ready (error, mum, maha, india, city){
        console.log(mum.features)
        console.log(city)
        var states=topojson.feature(india,india.objects.indiaStates).features
        var districts=topojson.feature(maha,maha.objects.maharashtraDistrict).features
        var cit=mum.features
        console.log(india.objects.indiaStates.geometries.properties)
        // d3.select("#testMap").html('<button type="submit" class="btn btn-fill btn-primary">Save</button>')
        var dots=svg.selectAll("circle")
        var mapSel = svg.selectAll("path").data(states)
        
        var statesKey = d3.map(city, function(d){return(d.state)}).keys()
        // var cityKey = d3.map(city, function(d){return(d.city)}).keys()
        var testing = [];
        var statesTable = [];
        var cityTable = [];
        var regionTable = [];
        city.forEach(function(d,i){
          // if(d.city==="Mumbai"){tes.push([d.city,d.status])}
            testing.push([d.state,d.city,d.status])
        });
        var tot = 0
        var acc = 0
        var inacc = 0
                for(var j=0;j<statesKey.length;j++){
                    for(var i=0;i<testing.length;i++){
                        
                        if(testing[i][0]===statesKey[j]){
                            if(testing[i][2]==='Active'){ acc++; }
                            else{ inacc++; }
                            tot++;
                        }
                    }
                    statesTable.push([statesKey[j],tot,acc,inacc]);
                    tot =0;
                    acc =0;
                    inacc=0;
                }
        d3.select("#tableIndex").text("State Table");
        head.append("tr")
            .selectAll("th")
            .data(["State","Total Devices","Active devices","Inactive devices"])
            .enter()
            .append("th")
            .attr("class","text-center")
            .text(function(d){return d;});
        rows=body.selectAll("tr")
                  .data(statesTable)
                  .enter().append("tr");
        cells=rows.selectAll("td")
                  .data(function(d){ return d; })
                  .enter().append("td")
                  .attr("class","text-center")
                  .text(function(d){ return d; });
        cells.filter(function(d,i){ return i === 2;}).style("color","lightgreen");
        cells.filter(function(d,i){ return i === 3;}).style("color","lightcoral");
        
        mapSel.enter().append("path")
            .attr("d", path)
            .attr("transform","translate(-1100,350)")
            .style("cursor","pointer")
            // .text(function(d) { 
            //     console.log(d.properties.st_nm)
            //     return d.properties.st_nm; })
            .on('mouseenter', function (d, i) {
                d3.select("#tableIndex").text("District Table");
                // d3.selectAll("th").remove();
                // d3.selectAll("td").remove();
                d3.selectAll("tr").remove();
                head.append("tr").selectAll("th")
                  .data(["Districts","Total Devices","Active devices","Inactive devices"])
                  .enter()
                  .append("th")
                  .attr("class","text-center")
                  .text(function(d){return d;});
                var newCity=city.filter(function(g){return g.state===d.properties.st_nm;})
                var cityKey = d3.map(newCity, function(g){return(g.city)}).keys()
                cityTable=[];
                for(var j=0;j<cityKey.length;j++){
                    for(var i=0;i<testing.length;i++){
                      if(testing[i][0]===d.properties.st_nm && testing[i][1]===cityKey[j]){
                            if(testing[i][2]==='Active'){ acc++; }
                            else{ inacc++; }
                            tot++;
                      }
                    }
                    cityTable.push([cityKey[j],tot,acc,inacc]);
                    tot =0;
                    acc =0;
                    inacc=0;
                }
                rows=body.selectAll("tr")
                  .data(cityTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(g){ return g; });
                cells.filter(function(g,i){ return i === 2;}).style("color","lightgreen");
                cells.filter(function(g,i){ return i === 3;}).style("color","lightcoral");
                d3.select(this).transition().duration(300).style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 1)
                div.text(d.properties.st_nm )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on('mouseleave', function (d, i) {
                d3.select("#tableIndex").text("State Table");
                // d3.selectAll("th").remove();
                // d3.selectAll("td").remove();
                d3.selectAll("tr").remove();
                head.append("tr").selectAll("th")
                  .data(["State","Total Devices","Active devices","Inactive devices"])
                  .enter()
                  .append("th")
                  .attr("class","text-center")
                  .text(function(d){return d;});
                rows=body.selectAll("tr")
                  .data(statesTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(d){ return d; });
                cells.filter(function(d,i){ return i === 2;}).style("color","lightgreen");
                cells.filter(function(d,i){ return i === 3;}).style("color","lightcoral");
                d3.select(this).transition().duration(300)
                    .style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 0);
            })
              
            .on("click", function(d) {
                sat=d.properties.st_nm;
                changeState(districts,sat);
            });
        
        function changeIndia(map){
            d3.select("#tableIndex").text("State Table");
            d3.selectAll("tr").remove();
            head.append("tr").selectAll("th")
              .data(["State","Total Devices","Active devices","Inactive devices"])
              .enter()
              .append("th")
              .attr("class","text-center")
              .text(function(d){return d;});
            rows=body.selectAll("tr")
                  .data(statesTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(d){ return d; });
                cells.filter(function(d,i){ return i === 2;}).style("color","lightgreen");
                cells.filter(function(d,i){ return i === 3;}).style("color","lightcoral");
            // mapSel.data(map).exit().remove();
            mapSel = svg.selectAll("path").data(map);
            mapSel.enter().append("path");
            mapSel.attr("d", path);
            mapSel.attr("transform","translate(-1100,350)");
            mapSel.style("cursor","pointer");
            mapSel.on('mouseenter', function (d, i) {
              d3.select("#tableIndex").text("District Table");
              d3.selectAll("tr").remove();
              head.append("tr").selectAll("th")
                  .data(["Districts","Total Devices","Active devices","Inactive devices"])
                  .enter()
                  .append("th")
                  .attr("class","text-center")
                  .text(function(d){return d;});
                // newCity=city.filter(function(g){return g.state===d.properties.st_nm;})
                // cityKey = d3.map(newCity, function(g){return(g.city)}).keys()
                // cityTable=[];
                // for(var j=0;j<cityKey.length;j++){
                //     for(var i=0;i<testing.length;i++){
                //       if(testing[i][0]===d.properties.st_nm && testing[i][1]===cityKey[j]){
                //             if(testing[i][2]==='Active'){ acc++; }
                //             else{ inacc++; }
                //             tot++;
                //       }
                //     }
                //     cityTable.push([cityKey[j],tot,acc,inacc]);
                //     tot =0;
                //     acc =0;
                //     inacc=0;
                // }
                rows=body.selectAll("tr")
                  .data(cityTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(g){ return g; });
                cells.filter(function(g,i){ return i === 2;}).style("color","lightgreen");
                cells.filter(function(g,i){ return i === 3;}).style("color","lightcoral");

                d3.select(this).transition().duration(300).style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 1)
                div.text(d.properties.st_nm )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            });
            mapSel.on('mouseleave', function (d, i) {
              d3.select("#tableIndex").text("State Table");
                // d3.selectAll("th").remove();
                // d3.selectAll("td").remove();
                d3.selectAll("tr").remove();
                head.append("tr").selectAll("th")
                  .data(["State","Total Devices","Active devices","Inactive devices"])
                  .enter()
                  .append("th")
                  .attr("class","text-center")
                  .text(function(d){return d;});
                rows=body.selectAll("tr")
                  .data(statesTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(d){ return d; });
                cells.filter(function(d,i){ return i === 2;}).style("color","lightgreen");
                cells.filter(function(d,i){ return i === 3;}).style("color","lightcoral");
                d3.select(this).transition().duration(300)
                    .style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 0);
            });
            mapSel.on("click", function() {
                changeState(districts);
            });        
        }

        function changeState(map,stateName) {
            d3.select("#tableIndex").text("District Table");
            d3.selectAll("tr").remove();
            // d3.selectAll("td").remove();
            head.append("tr").selectAll("th")
              .data(["Districts","Total Devices","Active devices","Inactive devices"])
              .enter()
              .append("th")
              .attr("class","text-center")
              .text(function(d){return d;});
                // newCity=[];
                // newCity=city.filter(function(g){return g.state===stateName;})
                // cityKey=[];
                // cityKey = d3.map(newCity, function(g){return(g.city)}).keys()
                // cityTable=[];
                // for(var j=0;j<cityKey.length;j++){
                //     for(var i=0;i<testing.length;i++){
                //       if(testing[i][0]===d.properties.st_nm && testing[i][1]===cityKey[j]){
                //             if(testing[i][2]==='Active'){ acc++; }
                //             else{ inacc++; }
                //             tot++;
                //       }
                //     }
                //     cityTable.push([cityKey[j],tot,acc,inacc]);
                //     tot =0;
                //     acc =0;
                //     inacc=0;
                // }
                rows=body.selectAll("tr")
                  .data(cityTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(g){ return g; });
                cells.filter(function(g,i){ return i === 2;}).style("color","lightgreen");
                cells.filter(function(g,i){ return i === 3;}).style("color","lightcoral");

            d3.selectAll("circle").remove();
            
            // d3.select("path").remove();
            // mapSel.data(map).exit().remove();
            mapSel = svg.selectAll("path").data(map);
            mapSel.enter().append("path");
            mapSel.attr("d", path2);
            mapSel.attr("transform","translate(-4100,1050)");
            mapSel.style("cursor","pointer");
            mapSel.on('mouseenter', function (d, i) {
                d3.select("#tableIndex").text("Region Table");
                d3.selectAll("tr").remove();
                head.append("tr").selectAll("th")
                  .data(["Device Id","Region name","Status","Crowd Index"])
                  .enter()
                  .append("th")
                  .attr("class","text-center")
                  .text(function(d){return d;});
                  regionTable=[];
                  city.forEach(function(g,i){
                    // tes.push(d.city)
                    if(g.city===d.properties.district){regionTable.push([g.deviceId,g.district,g.status,g.districtIndexQ1])}
                    
                });
                rows=body.selectAll("tr")
                  .data(regionTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(g){ return g; });
                cells.filter(function(g,i){ return i === 2;}).style("color","lightgreen");
                cells.filter(function(g,i){ return i === 3;}).style("color","lightcoral");

                d3.select(this).transition().duration(300).style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 1)
                div.text(d.properties.district )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            });
            mapSel.on('mouseleave', function (d, i) {
              d3.select("#tableIndex").text("District Table");
              d3.selectAll("tr").remove();
              head.append("tr").selectAll("th")
                  .data(["Districts","Total Devices","Active devices","Inactive devices"])
                  .enter()
                  .append("th")
                  .attr("class","text-center")
                  .text(function(d){return d;});
                 
                // newCity=city.filter(function(g){return g.state===d.properties.st_nm;})
                // cityKey = d3.map(newCity, function(g){return(g.city)}).keys()
                // cityTable=[];
                // for(var j=0;j<cityKey.length;j++){
                //     for(var i=0;i<testing.length;i++){
                //       if(testing[i][0]===d.properties.st_nm && testing[i][1]===cityKey[j]){
                //             if(testing[i][2]==='Active'){ acc++; }
                //             else{ inacc++; }
                //             tot++;
                //       }
                //     }
                //     cityTable.push([cityKey[j],tot,acc,inacc]);
                //     tot =0;
                //     acc =0;
                //     inacc=0;
                // }
                rows=body.selectAll("tr")
                  .data(cityTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(g){ return g; });
                cells.filter(function(g,i){ return i === 2;}).style("color","lightgreen");
                cells.filter(function(g,i){ return i === 3;}).style("color","lightcoral");

                d3.select(this).transition().duration(300)
                    .style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 0);
            });
            mapSel.on("click", function() {
                
                changeDistrict(cit);
                showDots();
            });
            butt.on("click",function(){
              changeIndia(states);
            })
              
        }

        function changeDistrict(map) {
            d3.select("#tableIndex").text("Region Table");
            d3.selectAll("tr").remove();
            head.append("tr").selectAll("th")
              .data(["Device Id","Region name","Status","Crowd Index"])
              .enter()
              .append("th")
              .attr("class","text-center")
              .text(function(d){return d;});
            rows=body.selectAll("tr")
                  .data(regionTable)
                  .enter().append("tr");
                cells=rows.selectAll("td")
                          .data(function(d){ return d; })
                          .enter().append("td")
                          .attr("class","text-center")
                          .text(function(g){ return g; });

            mapSel.data(map).exit().remove();
            mapSel = svg.selectAll("path").data(map);
            mapSel.enter().append("path");
            mapSel.attr("d", path3);
            mapSel.attr("transform","translate(-66050,17650)");
            mapSel.on('mouseenter', function (d, i) {
                d3.select(this).transition().duration(300).style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 0.5)
                div.text(d.properties.gid+":"+d.properties.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            });
            mapSel.on('mouseleave', function (d, i) {
                d3.select(this).transition().duration(300)
                    .style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 0);
            });
            
            butt.on("click",function(){
              // changeIndia(states);
              // mapSel.data(states).exit().remove();
              
              changeState(districts); 
            })
 
        }

        function showDots(){
          dots.data(city).enter().append("circle")
            .filter(function(d) { return d.city == "Mumbai" })
            // .style("fill","white")
            .style("cursor", "pointer")
            // .attr("transform","translate(-63400,17000)")
            .attr("r",3)
            .attr("cx",function(d){
                var coo = projection3([d.long,d.lat]) 
                console.log(coo)
                return coo[0]
            }).attr("cy",function(d){
                var coo = projection3([d.long,d.lat]) 
                console.log(coo)
                return coo[1]
            })
            .on('click', function (d, i) {
                  d3.select(this).transition().duration(300).style("opacity", 1);
                  div.transition().duration(300)
                      .style("opacity", 1)
                  div.text(d.district + " : " + d.districtIndexQ1)
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY - 30) + "px");
            })   
            .on('mouseleave', function (d, i) {
                d3.select(this).transition().duration(300)
                    .style("opacity", 0.5);
                div.transition().duration(300)
                    .style("opacity", 0);
            })
            .on('mouseenter', function (d, i) {
                d3.select(this).transition().duration(300)
                    .style("opacity", 0.5);
                div.transition().duration(300)
                    .style("opacity", 1);
                div.text(d.district + " : " + d.districtIndexQ1)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            });
            
        }     
        // svg.selectAll("path")
        //     .data(mum.features)
        //     .enter().append("path")
        //     .attr("d", path)                  
    }
      