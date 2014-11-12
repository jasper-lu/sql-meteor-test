if (Meteor.isServer) {
    var connection;
    var queryFunc;
    Meteor.startup(function () {
        // code to run on server at startup
        connection = mysql.createConnection({
            host: 'jasperlu.com',
                   user: mysqlUser.user,
                   password: mysqlUser.password,
                   database: 'pagevamp'
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
        },
        'getGapiKeys': function() {
            return gapiKeys; 
        }
    });
}
