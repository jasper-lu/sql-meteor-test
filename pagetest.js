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

    scopes = 'https://www.googleapis.com/auth/analytics.readonly';

    var parseDate = function(d) {
        s = d.toString();
        date = new Date(s.substring(0,4), s.substring(4,6) - 1, s.substring(6));
        return date;
    }

    var drawChart = function(data) {
        var ctx = $('#lineGraph').get(0).getContext("2d");
        var newChart = new Chart(ctx);
        newChart.Line(data);
    }


    var apiCallResultHandler = function(r) {
                        console.log(r);
                        var labels = [];
                        var data = [];
                        _.each(r.rows, function(row) {
                            labels.push(parseDate(row[0]).toDateString());
                            data.push(row[1]);
                        });
                        console.log(labels);
                        console.log(data);
                        var lineData = {
                            labels: labels,
                            datasets: [{
                                fillColor : "rgba(220,220,220,0.5)",
                                strokeColor : "rgba(220,220,220,1)",
                                pointColor : "rgba(220,220,220,1)",
                                pointStrokeColor : "#fff",
                                data: data 
                            }]
                        }
                        drawChart(lineData);

    }

    Template.analyticsBody.events({
        'click #al': function() {
            console.log("clicked");
            gapi.client.setApiKey(apiKey);
            gapi.auth.authorize({client_id: clientId, scope: scopes}, function() {
                gapi.client.load("analytics", "v3", function() {
                    console.log("loaded");
                    var apiQuery = gapi.client.analytics.data.ga.get({
                        'ids': "ga:88189745",
                        'start-date': '7daysAgo',
                        'end-date':'yesterday',
                        'metrics': 'ga:sessions',
                        'dimensions' : 'ga:date',
                        'max-results': 25
                    });
                    apiQuery.execute(apiCallResultHandler);
                });
            });
        }
    });
}

if (Meteor.isServer) {
    var connection;
    var queryFunc;
    Meteor.startup(function () {
        // code to run on server at startup
        connection = mysql.createConnection({
            host: 'jasperlu.com',
                   user: mysqlUser.user,
                   mysqluser.password,
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
