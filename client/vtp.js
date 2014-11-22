Template.monthlyVTP.rendered = function() {
    var ctx = document.getElementById("monthlyVTP").getContext("2d");
    var data = [{
        value: 0,
        color: "#4eb972",
        label: "Pagevamp Visits"
    },{
        value: 0,
        color: "#e67e22",
        label: "Trials"
    },{
        value: 0,
        color:"#8e44ad",
        label: "Customers"
    }]
    month = new Chart(ctx).Doughnut(data, {});
    Meteor.call("query", "SELECT count(id) FROM stripe_subscriptions WHERE from_unixtime(first_payment)  BETWEEN (CURRENT_DATE() - INTERVAL 1 MONTH) AND CURRENT_DATE() and canceled = 0;", function(e, r) {
        console.log(r);
        month.segments[2].value = r[0]['count(id)'];
        month.update();
    });
}
