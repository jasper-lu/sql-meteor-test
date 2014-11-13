Template.weeklyVTP.loadGoogleData = function(d) {
    //crappy for function
    var total = 0;
    for(var i = d.length - 1; i > d.length - 8; --i) {
        console.log(d);
        console.log(d[i]);
        total += parseInt(d[i][1]);
    }
    console.log("total week: " + total);
    week.segments[0].value = total;
    week.update();
}

Template.weeklyVTP.rendered = function() {
    week = null;
    /**Messy async withiin an async call**/
    Template.weeklyVTP.loadChart("(current_date() - interval 8 week)", "current_date()");
}

Template.weeklyVTP.loadChart = function(from, to) {
    var ctx = document.getElementById("weeklyVTP").getContext("2d");
    if(week) {
        week.destroy();
    }

    Meteor.call("query", "select from_unixtime(p.created_on) as date, count(p.id) as trials_weekly from fbpages as p where p.published_by=0 and from_unixtime(p.created_on) between " + from + " and " + to + " group by week(date);", function(e,r) {
        var dates = [];
        var trials = [];
        _.each(r, function(entry) {
            var d = entry.date;

            dates.push(dateString(d));
            trials.push(entry.trials_weekly);
        });
        Meteor.call("query", "select from_unixtime(first_payment) as date, count(id) as customers_weekly from stripe_subscriptions where from_unixtime(first_payment) between " + from + " and " + to + " group by week(date);", function(e,r) {
            var customers = [];
            _.each(r, function(entry) {
                customers.push(entry.customers_weekly);
            });
            var data = {
                labels: dates,
                datasets: [{
                    data: trials,
                    fillColor: "rgba(230,126,34,.2)",
                    strokeColor: "#e67e22",
                    pointColor: "#e67e22",
                    label: "Trials"
                },{
                    data: customers,
                    fillColor: "rgba(142,68,173,.2)",
                    strokeColor: "#8e44ad",
                    pointColor: "#8e44ad",
                    label: "Customers"
                }]
            }
            week = new Chart(ctx).Line(data, {responsive: true});
        });
    });

}

dateString = function(d) {
    var sd = d.toDateString().substring(d.toDateString().indexOf(' ') + 1);
    return sd;
}
