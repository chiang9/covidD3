// define variables
var category = ["Confirmed", "Deaths", "Recovered"]
var color = d3.scaleOrdinal()
        .domain(category)
        .range(["#395af9", "#FF0000", "#00bd03"])

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right + 60)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
// Afghanistan": [
//     {
//       "date": "2020-1-22",
//       "confirmed": 0,
//       "deaths": 0,
//       "recovered": 0
//     },

d3.json("https://pomber.github.io/covid19/timeseries.json",

  function(data){
    let countries = Object.getOwnPropertyNames(data);
    // console.log(data);

    let dateList = [];
    let mainData = [];
    
    countries.forEach(country => {
      let countryMain = {
        country: country,
        value: data[country]
      };
      mainData.push(countryMain);
    });

    caData = mainData.filter(x=>x.country =="Canada")[0];
    console.log(caData);

    lineData = caData.value;
    lineData.forEach(d=>{
      dateList.push(d3.timeParse("%Y-%m-%d")(d.date));
    });

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(dateList))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(lineData, function(d) { return +d.confirmed; })])
      .range([ height, 0 ]);
    
    
    // svg.append("g")
    //    .call(d3.axisLeft(y));

    var yAxis = d3.axisLeft(y).ticks(20).tickSize(-width) //horizontal ticks across svg width

    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .call(g => {
            g.selectAll("text")
            .style("text-anchor", "middle")
            .attr('fill', '#A9A9A9')
            g.selectAll("line")
              .attr('stroke', '#A9A9A9')
              .attr('stroke-width', 0.7) // make horizontal tick thinner and lighter so that line paths can stand out
              .attr('opacity', 0.3)

            g.select(".domain").remove()

           });
          

    // axis label
    svg.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("Date");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Confirmed");

    // Title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(caData.country + " Confirmed Cases");
    
    // create legend
    var svgLegend = svg.append('g')
            .attr('class', 'gLegend')
            .attr("transform", "translate(" + (width + 20) + "," + 0 + ")")

    var legend = svgLegend.selectAll('.legend')
          .data(category)
          .enter().append('g')
            .attr("class", "legend")
            .attr("transform", function (d, i) {return "translate(0," + i * 20 + ")"})

    legend.append("circle")
            .attr("class", "legend-node")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 6)
            .style("fill", d=>color(d))

    legend.append("text")
            .attr("class", "legend-text")
            .attr("x", 12)
            .attr("y", 3)
            .style("fill", "#161616")
            .style("font-size", 12)
            .text(d=>d)

    // Add the line
    svg.append("path")
      .datum(lineData)
      .attr("fill", "none")
      .attr("stroke", "#395af9")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
        .y(function(d) { return y(d.confirmed) })
        )
    svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "#FF000")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
          .y(function(d) { return y(d.deaths) })
          )
    svg.append("path")
      .datum(lineData)
      .attr("fill", "none")
      .attr("stroke", "#00bd03")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
        .y(function(d) { return y(d.recovered) })
        )

  }
)


  