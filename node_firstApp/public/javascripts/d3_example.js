// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
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
    let confirmedList = [];

    let mainData = [];
    
    countries.forEach(country => {
      let countryMain = {
        country: country,
        value: data[country]
      };
      mainData.push(countryMain);
    });

    caData = mainData.filter(x=>x.country =="Canada")[0].value;
    console.log(caData);

    caData.forEach(d=>{
      dateList.push(d3.timeParse("%Y-%m-%d")(d.date));
      confirmedList.push(d.confirmed);
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
      .domain([0, d3.max(caData, function(d) { return +d.confirmed; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(caData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
        .y(function(d) { return y(d.confirmed) })
        )

  }
)


  