Template.visitsWeek.rendered = function() {
    gapi.client.analytics.data.ga.get({
        "ids" : "ga:" + 74950580,
        "start-date": "60daysAgo",
        "end-date": "today",
        "dimensions": "ga:isoyearisoweek",
        "metrics": "ga:sessions"
    }).execute(function(r) {
        console.log(r);
        var d = r.rows;

        var weeks = [];
        var values = [];
        _.each(d, function(entry) {
            var year = parseInt(entry[0].substring(0,4));
            var week = parseInt(entry[0].substring(4));
            weeks.push(dateString(firstDayOfWeek(year, week)));
            values.push(entry[1]);
        });
        var ctx = document.getElementById("visitsWeekly").getContext("2d");
            var data = {
                labels: weeks,
                datasets: [{
                    data: values,
                    fillColor: "rgba(230,126,34,.2)",
                    strokeColor: "#e67e22",
                    pointColor: "#e67e22",
                    label: "Visits"
                }]
            }
            console.log(data);
            visitsWeekly = new Chart(ctx).Line(data, {responsive: true});
    });
}

Template.vampVisitsWeek.rendered = function() {
    gapi.client.analytics.data.ga.get({
        "ids" : "ga:" + Session.get("table"),
        "start-date": "60daysAgo",
        "end-date": "today",
        "dimensions": "ga:isoyearisoweek",
        "metrics": "ga:sessions"
    }).execute(function(r) {
        console.log(r);
        var d = r.rows;

        var weeks = [];
        var values = [];
        _.each(d, function(entry) {
            var year = parseInt(entry[0].substring(0,4));
            var week = parseInt(entry[0].substring(4));
            weeks.push(dateString(firstDayOfWeek(year, week)));
            values.push(entry[1]);
        });
        var ctx = document.getElementById("visitsVampWeekly").getContext("2d");
            var data = {
                labels: weeks,
                datasets: [{
                    data: values,
                    fillColor: "rgba(78,185,114,.2)",
                    strokeColor: "#4eb972",
                    pointColor: "#4eb972",
                    label: "Visits"
                }]
            }
            console.log(data);
            visitsWeekly = new Chart(ctx).Line(data, {responsive: true});
    });
}

firstDayOfWeek = function(year, week) {

    // Jan 1 of 'year'
    var d = new Date(year, 0, 1),
        offset = d.getTimezoneOffset();

    // ISO: week 1 is the one with the year's first Thursday 
    // so nearest Thursday: current date + 4 - current day number
    // Sunday is converted from 0 to 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));

    // 7 days * (week - overlapping first week)
    d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000 
        * (week + (year == d.getFullYear() ? -1 : 0 )));

    // daylight savings fix
    d.setTime(d.getTime() 
        + (d.getTimezoneOffset() - offset) * 60 * 1000);

    // back to Monday (from Thursday)
    d.setDate(d.getDate() - 3);

    return d;
}
