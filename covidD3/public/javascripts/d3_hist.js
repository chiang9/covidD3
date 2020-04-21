//Read the data
// Afghanistan": [
//     {
//       "date": "2020-1-22",
//       "confirmed": 0,
//       "deaths": 0,
//       "recovered": 0
//     },

function histGenerate() {

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
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

    // variable definition
    var countries;
    var histData = [];


    d3.json("https://pomber.github.io/covid19/timeseries.json",
        function (data) {
            countries = Object.getOwnPropertyNames(data);

            countries.forEach(country => {
                let element = data[country];
                let elen = element.length;

                for (var i = 0; i < elen; i++) {
                    if (element[i].confirmed != 0) {
                        if (!(element[i].date in histData)) {
                            histData[element[i].date] = [];
                            histData[element[i].date].value = 0;
                        }
                        histData[element[i].date].push(country);
                        histData[element[i].date].value += 1;
                        break;
                    }
                };

            });

            console.log(histData);
            var dateList = [];
            Object.getOwnPropertyNames(histData).forEach(e => {
                dateList.push(d3.timeParse("%Y-%m-%d")(e));
            });

            var valList = [];
            histData.forEach(e=>{
                valList.push(e.vale);
            });

            // X axis: scale and draw:
            var x = d3.scaleTime()
                .domain(d3.extent(dateList))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(function (d) { return d.value; })   // I need to give the vector of value
                .domain(x.domain());  // then the domain of the graphic
            // .thresholds(x.ticks(70)); // then the numbers of bins

            // And apply this function to data to get the bins
            var bins = histogram(histData);
            console.log(bins);
            // Y axis: scale and draw:
            var y = d3.scaleLinear()
                .range([height, 0]);
            y.domain([0, 10]);   // d3.hist has to be called before the Y axis obviously
            svg.append("g")
                .call(d3.axisLeft(y));

            // append the bar rectangles to the svg element
            // svg.selectAll("rect")
            //     .data(bins)
            //     .enter()
            //     .append("rect")
            //     .attr("x", 1)
            //     // .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            //     // .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
            //     // .attr("height", function (d) { return height - y(d.length); })
            //     .style("fill", "#69b3a2");

            svg.selectAll("rect")
                .data(histData)
                .attr("x", d => dateList)
                .attr("y", d => y(valList));


        });

}



histGenerate();