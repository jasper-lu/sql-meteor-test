Template.monthlyRevenue.rendered = function() {
    revenue = null;
    var start = new Date();
    start.setMonth(start.getMonth() - 2);
    start.setDate(1);

    //initialize months array to make it easier
    months = new Array(12);
    months[0] = "January";
    months[1] = "February";
    months[2] = "March";
    months[3] = "April";
    months[4] = "May";
    months[5] = "June";
    months[6] = "July";
    months[7] = "August";
    months[8] = "September";
    months[9] = "October";
    months[10] = "November";
    months[11] = "December";

    Template.monthlyRevenue.loadGraph(start, null);
}

Template.monthlyRevenue.loadGraph = function(from, to) {
    fromIso = from.toISOString();
    toIso = null;
    toSec = null;

    fromSec = Math.floor(from.getTime() / 1000);

    if(to != null) {
        toIso = to.toISOString();
        toSec = Math.floor(to.getTime() / 1000);
    }
    var query = {
        method: "TransactionSearch",
        startdate: fromIso,
        enddate: toIso,
        transactionclass: "received"
    }
    revData = [];
    Meteor.call("paypalTransactionsQuery", query, function(e, r) {
        console.log(r);
        var payments = [];
        var dates = [];
        _.each(r, function(val, key) {
            if(key.indexOf("L_NETAMT") == 0) {
                payments.push(val);
            }
            if(key.indexOf("L_TIMESTAMP") == 0 ) {
                dates.push(new Date(val));
            }
        });
            for(var i = 0; i != payments.length; ++i) {
                console.log(i);
                revData.push({
                    date: dates[i],
                    month: dates[i].getMonth(),
                    pay: payments[i]
                });
            }

        /**create stripe query**/
        var stripeQuery = {
            limit:100,
            created: {
                gte: fromSec,
            }
        }
        if(toSec != null) {
            stripeQuery.lte = toSec;
        }
        console.log(stripeQuery);
        Meteor.call("stripeListQuery", stripeQuery, function(e, r) {
            //format into revdata array
            _.each(r, function(d) {
                var dateObj = new Date(d.created * 1000);
                revData.push({
                    date: dateObj,
                    month: dateObj.getMonth(),
                    pay: d.amount/100
                });
            });
            console.log(revData);
            //format data into monthly
            monthlyData = {};
            _.each(revData, function(d) {
                if(monthlyData[d.month]){
                    monthlyData[d.month] += parseFloat(d.pay);
                }else{
                    monthlyData[d.month] = parseFloat(d.pay);
                }
            });
            console.log(monthlyData);

            //into separate arrays now
            var labels = [];
            var labelVals = [];
            _.each(monthlyData, function(val, key) {
                labelVals.push(val);
                labels.push(months[key]);
            });

            //into chart data format
            var chartData = {
                labels: labels,
                datasets: [{
                    data: labelVals,
                    fillColor: "rgba(78,185,114,.2)",
                    strokeColor: "#4eb972",
                    pointColor: "#4eb972",
                    label: "revenue"
                }]
            }
            //get canvas context
            var ctx = document.getElementById("monthlyRev").getContext("2d");
            //if graph is made already, destroy it
            if(revenue) {
                revenue.destroy();
            }
            revenue = new Chart(ctx).Line(chartData, {responsive: true});

            Session.set("revenueChartLoaded", true);
        });
    });
}

Template.monthlyRevenue.loaded = function() {
    if(Session.get("revenueChartLoaded"))
        return true;
    return false;
}
