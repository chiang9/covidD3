//Read the data
// Afghanistan": [
//     {
//       "date": "2020-1-22",
//       "confirmed": 0,
//       "deaths": 0,
//       "recovered": 0
//     },

function gBarGenerate() {

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 60, bottom: 60, left: 70 },
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
    var subgroups = ["confirmed", "recovered", "death"];
    var x;
    var y;
    var xSubgroup;
    var xAxis;
    var yAxis;

    // Data display
    var groups = ["US", "Canada"];

    d3.json("https://pomber.github.io/covid19/timeseries.json",
        function (data) {
            // Re-construct data as array of object {country, confirmed, death, recovered}
            countries = Object.getOwnPropertyNames(data);

            mainData = groupDataFilter(data, groups);
            console.log(mainData);

            // Add X axis
            x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])
            xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0));

            // Add Y axis
            y = d3.scaleLinear()
                .domain([0, maxConfirmed])
                .range([height, 0]);
            yAxis = svg.append("g")
                .call(d3.axisLeft(y));

            // Another scale for subgroup position
            xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])

            // color palette = one color per subgroup
            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#377eb8', '#4daf4a', '#e41a1c'])

            // axis label
            svg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.top) + ")")
                .style("text-anchor", "middle")
                .text("Country");

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Number of Cases");

            // Title
            var title = svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Covid19 Bar Chart");

            // create legend
            var svgLegend = svg.append('g')
                .attr('class', 'gLegend')
                .attr("transform", "translate(" + (width + 20) + "," + 0 + ")")

            var legend = svgLegend.selectAll('.legend')
                .data(subgroups)
                .enter().append('g')
                .attr("class", "legend")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")" })

            legend.append("circle")
                .attr("class", "legend-node")
                .attr("cx", -30)
                .attr("cy", 0)
                .attr("r", 6)
                .style("fill", d => color(d))

            legend.append("text")
                .attr("class", "legend-text")
                .attr("x", -18)
                .attr("y", 3)
                .style("fill", "#161616")
                .style("font-size", 12)
                .text(d => d)



            // Show the bars
            svg.append("g")
                .selectAll("g")
                // Enter in data = loop group per group
                .data(mainData)
                .enter()
                .append("g")
                .attr("transform", function (d) { return "translate(" + x(d.country) + ",0)"; })
                .selectAll("rect")
                .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
                .enter().append("rect")
                .attr("x", function (d) { return xSubgroup(d.key); })
                .attr("y", function (d) { return y(d.value); })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function (d) { return height - y(d.value); })
                .attr("fill", function (d) { return color(d.key); });

                // d3.select("#cbtn").on('click', updateChart(data, "Taiwan*"));
                $("#cbtn").on("click", function() {
                    updateChart(data,"Taiwan*")
                })
        });

    function groupDataFilter(data, selected) {
        var result = [];
        maxConfirmed = maxDeaths = maxRecovered = 0;

        selected.forEach(country => {
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

            result.push(sdata);
        });
        return result;
    }

    // chart update by country
    function updateChart(data, chartcountry) {

        groups.push(chartcountry);
        mainData = groupDataFilter(data, groups);

        console.log(mainData);
        // axis transform
        x.domain(groups);
        y.domain([0, maxConfirmed])

        // Update the axis
        yAxis.transition()
            .duration(500)
            .call(d3.axisLeft(y))
            
        xAxis.transition()
            .duration(500)
            .call(d3.axisBottom(x).tickSize(0))

        
    }

}

gBarGenerate();
d3.selectAll("#navGroupBar").attr("class", "active");

