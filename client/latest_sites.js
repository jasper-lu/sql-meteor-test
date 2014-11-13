Template.latestSites.rendered = function() {
    Meteor.call("query", "select name, pic_square, pageid, category, created_on from fbpages where published_by > 0 order by created_on desc limit 10;", function(e, r) {
        if(e) {
            //error check
            console.log(e);
            return -1;
        }
        Session.set("latest_sites", r);
    });
}

Template.latestSites.fbpages = function() {
    //console.log(Session.get("latest_sites"));
    return Session.get("latest_sites");
}

Template.lsPageRow.timestamp = function() {
    return new Date(this.created_on * 1000).toDateString();
}

Template.refCodes.rendered = function() {
    Meteor.call("query", "select f.ref_code, count(f.id) as count, u.firstname, u.lastname, u.email from fbpages as f, referral_codes as r, users as u  where r.referral_code = f.ref_code and u.uid = r.user_id and f.ref_code!= '' group by ref_code limit 10;", function(e, r){ 
        if(e) {
            //error check
            console.log(e);
            return -1;
        }
        Session.set("ref_codes", r);
    });
}

Template.refCodes.codes = function() {
    return Session.get("ref_codes");
}
