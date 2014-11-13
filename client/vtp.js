/*
   Template.monthlyVTP.rendered = function() {
   var ctx = document.getElementById("monthlyVTP").getContext("2d");
   var data = [{
   value: 1,
   color: "#4eb972",
   label: "Pagevamp Visits"
   },{
   value: 1,
   color: "#e67e22",
   label: "Trials"
   },{
   value: 1,
   color:"#8e44ad",
   label: "Customers"
   }]
   month = new Chart(ctx).Doughnut(data, {});
   $("#monthlyVTPLegend").html(month.generateLegend());
   Meteor.call("query", "select (select count(id) from fbpages where published_by = 0 and from_unixtime(created_on) BETWEEN (CURRENT_DATE() - INTERVAL 1 MONTH) AND CURRENT_DATE()) as trials_monthly, (SELECT count(id) FROM stripe_subscriptions WHERE from_unixtime(first_payment)  BETWEEN (CURRENT_DATE() - INTERVAL 1 MONTH) AND CURRENT_DATE() and canceled = 0) as customers_monthly;", function(e, r) {
   console.log(r);
   console.log(r[0].trials_monthly);
   month.segments[1].value = r[0].trials_monthly;
   month.segments[2].value = r[0].customers_monthly;
/*
data[0].value = 100;
data[1].value = r[0].trials_monthly;
data[2].value = r[0].customers_monthly; 
*/
/*
   month.update();
   });
   gapi.client.analytics.data.ga.get({
   "ids" : "ga:" + Session.get("table"),
   "start-date": "30daysAgo",
   "end-date": "today",
   "dimensions": "ga:date",
   "metrics": "ga:sessions"
   }).execute(function(r) {
   month.segments[0].value = parseInt(r.totalsForAllResults['ga:sessions']);
   month.update();
   Template.weeklyVTP.loadGoogleData(r.rows);
   });
   }
   */

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
    var ctx = document.getElementById("weeklyVTP").getContext("2d");
    /*
    var data = {
        labels: [],
        datasets: [{
            data: [],
            color: "#e67e22",
            label: "Trials"
        },{
            data: [],
            color:"#8e44ad",
            label: "Customers"
        }]
    };
    week = new Chart(ctx).Line(dataset, {});
    $("#weeklyVTPLegend").html(week.generateLegend());
    */
    /*
       Meteor.call("query", "select (select count(id) from fbpages where published_by = 0 and from_unixtime(created_on) BETWEEN (CURRENT_DATE() - INTERVAL 1 WEEK) AND CURRENT_DATE()) as trials_weekly, (SELECT count(id) FROM stripe_subscriptions WHERE from_unixtime(first_payment)  BETWEEN (CURRENT_DATE() - INTERVAL 1 WEEK) AND CURRENT_DATE() and canceled = 0) as customers_weekly;", function(e, r) {
       console.log(r);

    /*
    week.segments[].value = r[0].trials_weekly;
    week.segments[2].value = r[0].customers_weekly;
    week.update();
    */
    //});
    Meteor.call("query", "select from_unixtime(p.created_on) as date, count(p.id) as trials_weekly from fbpages as p where p.published_by=0 and from_unixtime(p.created_on) between (current_date() - interval 8 week) and current_date() group by week(date);", function(e,r) {
        var dates = [];
        var trials = [];
        _.each(r, function(entry) {
            var d = entry.date;

            dates.push(dateString(d));
            trials.push(entry.trials_weekly);
        });
        Meteor.call("query", "select from_unixtime(first_payment) as date, count(id) as customers_weekly from stripe_subscriptions where from_unixtime(first_payment) between (current_date() - interval 8 week) and current_date() group by week(date);", function(e,r) {
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
