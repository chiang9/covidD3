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
    var margin = { top: 30, right: 30, bottom: 60, left: 40 },
        width = 1080 - margin.left - margin.right,
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
                    datevalue = element[i].date;
                    if (element[i].confirmed != 0) {
                        if (!(datevalue in histData)) {
                            histData[datevalue] = [];
                            histData[datevalue].value = 0;
                        }
                        histData[datevalue].push(country);
                        histData[datevalue].value += 1;
                        histData[datevalue].x0 = datevalue;
                        break;
                    }
                };
            });

            var dateList = [];
            var mainData = [];
            Object.getOwnPropertyNames(histData).forEach(e => {
                if (e != "length") {
                    var ele = histData[e];
                    var x = {
                        date: ele.x0,
                        value: ele.value
                    };
                    mainData.push(x);
                    dateList.push(e);
                }
            });

            dateList.sort(sortByDateAscending);

            // Title
            title = svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "underline")
                .text("Newly Affected Country Number");

            // X axis: scale and draw:
            var x = d3.scaleBand()
                .domain(dateList)
                .range([0, width]);


            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)");


            // Y axis: scale and draw:
            var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, 15]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // append the bar rectangles to the svg element

            svg.selectAll("bar")
                .data(mainData)
                .enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", function (d) { return x(d.date); })
                .attr("width", x.bandwidth() - 1)
                .attr("y", function (d) { return y(d.value); })
                .attr("height", function (d) { return height - y(d.value); });

        });

}

histGenerate();

function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    return parseDate(a) - parseDate(b);
}

parseDate = d3.timeParse("%Y-%m-%d");
d3.selectAll("#navHist").attr("class", "active");