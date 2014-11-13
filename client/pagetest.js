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
        
    });
}
