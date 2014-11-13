Template.login.rendered = function() {
    $('#loginForm').submit(function(e) {
        console.log("logging in");
        e.preventDefault();
        Meteor.loginWithPassword("admin", $('#password').val(), function(e,r) {
            if(e) {
                alert(e);
            }
            console.log(r);
        });
    });
}
