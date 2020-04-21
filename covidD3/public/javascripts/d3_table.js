//Read the data
// Afghanistan": [
//     {
//       "date": "2020-1-22",
//       "confirmed": 0,
//       "deaths": 0,
//       "recovered": 0
//     },

function tableGenerate() {
  // variable definition
  var countries;
  var mainData = [];


  d3.json("https://pomber.github.io/covid19/timeseries.json",
    function (data) {
      countries = Object.getOwnPropertyNames(data);

      countries.forEach(country => {
        let element = data[country];
        let elen = element.length;

        for (var i =0; i<element.length; i++) {
          if (element[i].confirmed != 0) {
            console.log(country);
            console.log(element[i].date);
            break;
          }
        };

        let confirmed_number = element[elen - 1].confirmed;
        let death_number = element[elen - 1].deaths;
        let recovered_number = element[elen - 1].recovered;
        let new_cases = confirmed_number - element[elen - 2].confirmed;
        let new_deaths = death_number - element[elen - 2].deaths;
        let fatality_rate = (death_number / confirmed_number) * 100;
        let recovering_rate = (recovered_number / confirmed_number) * 100;

        let countryMain = {
          country: country,
          confirmed_number: confirmed_number,
          recovered_number: recovered_number,
          death_number: death_number,
          new_cases: new_cases,
          new_deaths: new_deaths,
          fatality_rate: fatality_rate.toFixed(4),
          recovering_rate: recovering_rate.toFixed(4)

        };
        mainData.push(countryMain);
      });



      renderTable(mainData);

      var tr = d3.select("tbody").selectAll("tr");
      tr.on('click', function () {
        console.log(this.id);
        updateChart(this.id);
      });
      
      $(function () {
        $("#myDataTalbe").DataTable({
          searching: true,
          columnDefs: [{
            targets: [3],
            orderable: false,
          }]
        });
      });

    });

}


function renderTable(mainData) {
  // create table header
  d3.select("body").append("div").html(`
  <table id="myDataTalbe"  class="display"  >
  <thead>
      <tr>
          <th>Country</th>
          <th>Total Case</th>
          <th>Deaths</th>
          <th>Recovered</th>
          <th>New Cases</th>
          <th>New Deaths</th>
          <th>Fatality Rate (%)</th>
          <th>Recovering Rate (%)</th>
      </tr>
  </thead>
  <tbody>
      
  </tbody>
  </table>`);
  
        // create table body
        for (var i = 0; i < mainData.length; i++) {
          var e = mainData[i];
          d3.select("tbody").append("tr").attr("id", e.country).html(`<td>${e.country}</td>
  <td>${e.confirmed_number}</td>
  <td>${e.death_number}</td>
  <td>${e.recovered_number}</td>
  <td>${e.new_cases}</td>
  <td>${e.new_deaths}</td>
  <td>${e.fatality_rate}</td>
  <td>${e.recovering_rate}</td>`)
        };
}

