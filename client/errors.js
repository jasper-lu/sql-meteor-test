Template.stripeFailures.rendered = function() {
    Meteor.call("query", "select u.email, u.firstname, u.lastname , s.pageid, s.item, s.reason, s.transaction_date from stripe_transactions as s, users as u where s.canceled = 1 and s.uid=u.uid  order by transaction_date desc limit 10;", function(e, r) {
        if(e) {
            //error check
            console.log(e);
            return -1;
        }
        console.log(r);
        Session.set("latest_stripe_failures", r);
    });
}

Template.stripeFailures.failures = function() {
    console.log(Session.get("latest_stripe_failures")); 
    return Session.get("latest_stripe_failures");
}

Template.stripeFailures.transactionDate = function() {
    return new Date(this.transaction_date * 100).toDateString();
}

Template.vampErrors.rendered = function() {
    Meteor.call("query", "select * from log_errors order by timestamp desc limit 10;", function(e, r) {
        if(e) {
            //error check
            console.log(e);
            return -1;
        }
        console.log(r);
        Session.set("latest_vamp_errors", r);
    });
}

Template.vampErrors.errors = function() {
    console.log(Session.get("latest_vamp_errors")); 
    return Session.get("latest_vamp_errors");
}

Template.vampErrors.timeStamp = function() {
    return new Date(timestamp).toDateString();
}