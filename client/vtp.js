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
        month.update();
    });
}

Template.weeklyVTP.rendered = function() {
    var ctx = document.getElementById("weeklyVTP").getContext("2d");
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
    week = new Chart(ctx).Doughnut(data, {});
    $("#weeklyVTPLegend").html(week.generateLegend());
    Meteor.call("query", "select (select count(id) from fbpages where published_by = 0 and from_unixtime(created_on) BETWEEN (CURRENT_DATE() - INTERVAL 1 WEEK) AND CURRENT_DATE()) as trials_weekly, (SELECT count(id) FROM stripe_subscriptions WHERE from_unixtime(first_payment)  BETWEEN (CURRENT_DATE() - INTERVAL 1 WEEK) AND CURRENT_DATE() and canceled = 0) as customers_weekly;", function(e, r) {
        console.log(r);
        week.segments[1].value = r[0].trials_weekly;
        week.segments[2].value = r[0].customers_weekly;
        week.update();
    });
}
