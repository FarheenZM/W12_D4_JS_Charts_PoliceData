const makeRequest = function(url, callback){
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener('load', callback);
  request.send();
};

const requestComplete = function(response){
  const json = JSON.parse(response.target.responseText);
  displayGenderChart(json);
  displayEthnicityChart(json);
}

const displayGenderChart = function(data){
  const maleSearches = _.sumBy(data, {gender: "Male"});
  const femaleSearches = _.sumBy(data, {gender: "Female"});

  const chartData = google.visualization.arrayToDataTable([
    ["Gender", "No. of Searches"],
    ["Female", femaleSearches],
    ["Male", maleSearches]
  ]);

  const options = {
        title: 'Gender Split',
        pieHole: 0.4,
  };

  const chart = new google.visualization.PieChart(document.getElementById('genderchart'));
  chart.draw(chartData, options);

}

const displayEthnicityChart = function(data){
  // const allBlacks = _.includes(data, "Black", "self_defined_ethnicity");
  const black = _.sumBy(data, {self_defined_ethnicity: "Black"});

  // const allWhites = _.includes(data.self_defined_ethnicit, "White");
  const white = _.sumBy(data, {self_defined_ethnicity: "White"});

  // const allAsians = _.includes(data.self_defined_ethnicity, "Asian");
  const asian = _.sumBy(data, {self_defined_ethnicity: "Asian"});

  const notStated = _.sumBy(data, {self_defined_ethnicity: "Not Stated (NS)"});

  // debugger;

  const chartData = google.visualization.arrayToDataTable([
    ["Ethnicity", "No. of Searches"],
    ["Whites", white],
    ["Blacks", black],
    ["Asian", asian],
    ["Not Stated", notStated]
  ]);

  const options = {
        title: 'Ethnicity',
        pieHole: 0.4,
  };

  const chart = new google.visualization.PieChart(document.getElementById('ethnicitychart'));
  chart.draw(chartData, options);


}

window.addEventListener("load", function(){
  google.charts.load("current", {packages:["corechart"]});

  const mapWrapper = new MapWrapper("map", 51.5074, 0.1278, 10);

  mapWrapper.map.on("click", function(event){
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    const url = `https://data.police.uk/api/stops-street?lat=${lat}&lng=${lng}`;

    makeRequest(url, requestComplete);
  });
});
