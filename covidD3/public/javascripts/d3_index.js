d3.selectAll("#navHome").attr("class", "active");

function indexGenerate() {
    // variable definition
    var countries;
    var mainData = [];
    var totalValue = {
        confirmed_number : 0,
        death_number : 0,
        recovered_number : 0
    }
  
    d3.json("https://pomber.github.io/covid19/timeseries.json",
      function (data) {
        countries = Object.getOwnPropertyNames(data);
  
        countries.forEach(country => {
          let element = data[country];
          let elen = element.length;
  
          let confirmed_number = element[elen - 1].confirmed;
          let death_number = element[elen - 1].deaths;
          let recovered_number = element[elen - 1].recovered;
  
          totalValue.confirmed_number += confirmed_number;
          totalValue.death_number += death_number;
          totalValue.recovered_number += recovered_number;

        });
  
        indexRender(totalValue);

      });
  
  }
  
function indexRender(data) {
    var active_case = numberWithCommas(data.confirmed_number-data.recovered_number-data.death_number);
    var fatality_rate = (data.death_number)/(data.confirmed_number) * 100
    var recovered_rate = (data.recovered_number)/(data.confirmed_number) * 100

    d3.select(".card-content-div").append("div").html(`
    <div class="card_container">
    <div class="card">
    <div class="front card_container_div">
      <div class="modal-dialog">
        <div class="modal-content-card">
    
          <!-- Modal Header -->
          <div class="modal-header-card">
            <h3 class="modal-title">Current Status</h3>
          </div>
    
          <!-- Modal body -->
          <div class="modal-body-card">
            <div>
            <h5>Confirmed Case</h5>
            <h4 style="color: blue;">${numberWithCommas(data.confirmed_number)}</h4>
            <h5>Recovered Case</h5>
            <h4 style="color: green;">${numberWithCommas(data.recovered_number)}</h4>
            <h5>Deaths</h5>
            <h4 style="color: red;">${numberWithCommas(data.death_number)}</h4>
            </div>
          </div>
        </div>
    </div>`);
    d3.select(".card-content-div").append("div").html(`
    <div class="card_container">
    <div class="card">
    <div class="front card_container_div">
      <div class="modal-dialog">
        <div class="modal-content-card">
    
          <!-- Modal Header -->
          <div class="modal-header-card">
            <h3 class="modal-title">Analysis</h3>
          </div>
    
          <!-- Modal body -->
          <div class="modal-body-card">
            <div>
            <h5>Active Case</h5>
            <h4 style="color: blue;">${active_case}</h4>
            <h5>Recovered Rate</h5>
            <h4 style="color: green;">${recovered_rate.toFixed(4)}%</h4>
            <h5>Fatality Rate</h5>
            <h4 style="color: red;">${fatality_rate.toFixed(4)}%</h4>
            </div>
          </div>
        </div>
    </div>`);
}
  
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

indexGenerate();