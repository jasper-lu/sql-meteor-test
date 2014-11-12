
Template.latestCustomers.rendered = function() {
    Meteor.call("query", "select s.id, s.first_payment, s.next_payment, s.uid, s.pageid, u.firstname, u.lastname, u.email from stripe_subscriptions as s, users as u where s.canceled = 0 and u.uid=s.uid limit 10;", function(e, r) {
        if(e) {
            //error check
            console.log(e);
            return -1;
        }
        console.log(r);
        Session.set("latest_customers", r);
    });
}

Template.latestCustomers.subscriptions = function() {
    console.log(Session.get("latest_customers")); 
    return Session.get("latest_customers");
}

Template.lcRow.firstPayment = function() {
    return new Date(this.first_payment * 1000).toDateString();
}

Template.lcRow.nextPayment = function() {
    return new Date(this.next_payment * 1000).toDateString();
}
