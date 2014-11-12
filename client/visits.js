Template.visitsWeek.rendered = function() {
    gapi.client.analytics.data.ga.get({
        "ids" : "ga:" + 74950580,
        "start-date": "30daysAgo",
        "end-date": "today",
        "dimensions": "ga:date",
        "metrics": "ga:sessions"
    }).execute(function(r) {
        console.log(r);
        Session.set("visitsMonth", r.totalsForAllResults['ga:sessions']);
        var d = r.rows;
        var total = 0;
        for(var i = d.length - 1; i > d.length - 8; --i) {
            total += parseInt(d[i][1]);
        }
        Session.set("visitsWeek", total);
    });
}

Template.visitsWeek.visits = function() {
    return Session.get("visitsWeek");
}

Template.visitsMonth.visits = function() {
    return Session.get("visitsMonth");
}
