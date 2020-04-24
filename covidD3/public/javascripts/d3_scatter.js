//Read the data
// Afghanistan": [
//     {
//       "date": "2020-1-22",
//       "confirmed": 0,
//       "deaths": 0,
//       "recovered": 0
//     },

function scatterGenerate() {

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 60, left: 70 },
        width = 780 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // variable definition
    var countries;
    var mainData = [];
    var maxConfirmed = 0;
    var maxDeaths = 0;
    var maxRecovered = 0;


    d3.json("https://pomber.github.io/covid19/timeseries.json",
        function (data) {
            // Re-construct data as array of object {country, confirmed, death, recovered}
            countries = Object.getOwnPropertyNames(data);

            countries.forEach(country => {
                let element = data[country];
                let cdata = element[element.length - 1];

                maxConfirmed = d3.max([maxConfirmed, cdata.confirmed]);
                maxDeaths = d3.max([maxDeaths, cdata.deaths]);
                maxRecovered = d3.max([maxRecovered, cdata.recovered]);

                var sdata = {
                    country: country,
                    confirmed: cdata.confirmed,
                    death: cdata.deaths,
                    recovered: cdata.recovered
                };

                mainData.push(sdata);
            });

            console.log(mainData);

            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, maxDeaths])
                .range([0, width]);
            var xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, maxConfirmed])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // axis label
            svg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.top) + ")")
                .style("text-anchor", "middle")
                .text("Deaths");

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left )
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Confirmed");

            // Title
            title = svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Covid19 World Scatter Map");

            // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
            // Its opacity is set to 0: we don't see it by default.
            var tooltip = d3.select("#my_dataviz")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")



            // A function that change this tooltip when the user hover a point.
            // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
            var mouseover = function (d) {
                tooltip
                    .transition()
                    .duration(200)
                tooltip
                    .style("opacity", 1)
                    .html("Country: " + d.country + "<br>Confirmed: " + d.confirmed + "<br>Deaths: " + d.death + "<br>Recovered: " + d.recovered)
                    .style("left", (d3.mouse(this)[0] + 30) + "px")
                    .style("top", (d3.mouse(this)[1] + 30) + "px")

            }

            var mousemove = function (d) {
                tooltip
                    .style("left", (d3.mouse(this)[0]) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    .style("top", (d3.mouse(this)[1]) + "px")
            }

            // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
            var mouseleave = function (d) {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
            }

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(mainData) // the .filter part is just to keep a few dots on the chart, not all of them
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.death); })
                .attr("cy", function (d) { return y(d.confirmed); })
                .attr("r", 7)
                .style("fill", "#69b3a2")
                .style("opacity", 0.8)
                .style("stroke", "white")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)


            function updatePlot() {

                // Get the value of the button
                xlim = this.value

                // Update X axis
                x.domain([0, xlim])
                xAxis.transition().duration(1000).call(d3.axisBottom(x))

                // Update chart
                svg.selectAll("circle")
                    .data(mainData)
                    .transition()
                    .duration(1000)
                    .attr("cx", function (d) { return x(d.death); })
                    .attr("cy", function (d) { return y(d.confirmed); })
            }

            // Add an event listener to the button created in the html part
            d3.select("#Xlim").on("input", updatePlot)
        });

}

scatterGenerate();

