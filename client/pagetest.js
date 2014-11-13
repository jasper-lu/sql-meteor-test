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

Template.pageBody.rendered = function() {
    $.getScript("https://apis.google.com/js/client.js?onload=handleClientLoad").done(function(script, textStatus) {
        Meteor.call('getGapiKeys', function(e, r) {
            gapi.client.setApiKey(r.apiKey);
            Session.set("table", r.table);
            gapi.auth.authorize({client_id: r.clientId, scope: scopes, immediate: true}, function(e,r) {
                console.log(e);
                console.log(r);
                gapi.client.load("analytics", "v3", function() {
                    console.log("analytics loaded");
                    Session.set("loaded", true);
                });
            });
        });
    });
}

Template.pageBody.gLoading = function() {
    return Session.get("loaded");
}

Template.graphs.rendered = function() {
    $.getScript("//code.jquery.com/ui/1.11.2/jquery-ui.js").done(function(script, textStatus){ 
        $( "#from" ).datepicker({
            changeMonth: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
            $( "#to" ).datepicker( "option", "minDate", selectedDate );
        }
        }).datepicker("setDate", -60) ;
        $( "#to" ).datepicker({
            defaultDate: "0",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( "#from" ).datepicker( "option", "maxDate", selectedDate );
            }
        }).datepicker("setDate", -1);;
    });
    $("#refreshGraphs").click(function() {
        var from = $("#from").datepicker("getDate");
        var to = $("#to").datepicker("getDate");
        refreshLineGraphs(from, to);
    });
}

refreshLineGraphs = function(from, to) {
    var fromIso = from.toISOString().substring(0, 10);
    var toIso = to.toISOString().substring(0, 10);

    Template.visitsWeek.loadChart(fromIso, toIso);
    Template.vampVisitsWeek.loadChart(fromIso, toIso);

    var fromUnix = from.getTime()/1000;
    var toUnix = to.getTime()/1000;

    var fromUnixWrapper = function(s) {
        return "from_unixtime(" + s + ")";
    }

    Template.weeklyVTP.loadChart(fromUnixWrapper(fromUnix), fromUnixWrapper(toUnix));
}
