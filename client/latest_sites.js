Template.latestSites.rendered = function() {
    Meteor.call("query", "select name, pic_square, pageid, category, created_on from fbpages where published_by > 0 order by created_on desc limit 10;", function(e, r) {
        if(e) {
            //error check
            console.log(e);
            return -1;
        }
        console.log(r);
        Session.set("latest_sites", r);
    });
}

Template.latestSites.fbpages = function() {
    console.log(Session.get("latest_sites"));
    return Session.get("latest_sites");
}

Template.lsPageRow.timestamp = function() {
    return new Date(this.created_on * 1000).toDateString();
}
