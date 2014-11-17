if (Meteor.isClient) {
    Template.game.rendered = function() {
        Meteor.call("query", "select * from games", function(e,r) {
            Session.set("matches", r);    
            //d3 on fields
            Meteor.call("query", "select * from players", function(e, r) {
                if(e)
                console.log(e);
            _.each(r, function(r) {
                d3.selectAll("." + r.name).style("min-height", (r.elo / 10) + "px").append("h2").html(r.elo).attr("class", "hidden score");
            });
            });
        });
        $('.winner, .loser').click(function() {
            $(this).children(".score").toggleClass("hidden");
        });
    }

    toggleHidden = function($obj) {
        $obj.children(".score").toggleClass("hidden");
    }

    Template.game.events({
        'mousedown .role' : function(e) {
            toggleHidden($(e.target));
        },
        'mouseup .role' : function(e) {
            toggleHidden($(e.target));
        }
    });

    Template.game.matches = function() {
        if(Session.get("matches"))
            return Session.get("matches");
        return null;
    }
}

if (Meteor.isServer) {
    var connection;
    var queryFunc;
    Meteor.startup(function () {
        // code to run on server at startup
        connection = mysql.createConnection({
            host: 'jasperlu.com',
                   user: 'test',
                   password: 'testing123',
                   database: 'page'
        });
        connection.connect(function(e) {
            if(e) {
                console.error("error connecting: " + e.stack);
                return;
            }
            console.log("connected as id " + connection.threadId);
        });
        queryFunc = function(q, cb) {
            connection.query(q, cb);
        }
    });
    Meteor.methods({
        'query': function(query) {
            var result;
            var wrappedQuery = Meteor.wrapAsync(queryFunc);

            result = wrappedQuery(query);

            console.log(result);

            return result; 
        }
    });
}
