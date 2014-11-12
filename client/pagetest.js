scopes = 'https://www.googleapis.com/auth/analytics.readonly'; 
var parseDate = function(d) {
    s = d.toString();
    date = new Date(s.substring(0,4), s.substring(4,6) - 1, s.substring(6));
    return date;
}

var drawChart = function(data) {
    var ctx = $('#lineGraph').get(0).getContext("2d");
    var newChart = new Chart(ctx);
    newChart.Line(data);
}
