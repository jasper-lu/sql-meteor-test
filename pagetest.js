if (Meteor.isServer) {
    var connection;
    var queryFunc;
    Meteor.startup(function () {
        // code to run on server at startup
        connection = mysql.createConnection({
            host: mysqlUser.host,
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
        connection.end();
        queryFunc = function(q, cb) {
            connection.query(q, cb);
        }
        paypal_classic.configure({
            host: "api-3t.paypal.com",
            path: "/nvp",
            port: "443",
            credentials: {
                user: paypal.username,
            pwd: paypal.password,
            signature: paypal.signature
            },
            timeout: 30000,
            paypal_api_version: "109.0"
        });
        stripe = StripeAPI(stripe.secret);
        /*
           Meteor.Paypal.config = {
           'host': 'api.sandbox.paypal.com',
           'port': '',
           'client_id': paypal.clientId,
           'client_secret': paypal.secret
           }
        */

    });
    Meteor.methods({
        'query': function(query) {
            if(!this.userId) {
                return -1;
            }
        connection = mysql.createConnection({
            host: mysqlUser.host,
                   user: mysqlUser.user,
                   password: mysqlUser.password,
                   database: 'pagevamp'
        });
            connection.connect();
            var result;
            var wrappedQuery = Meteor.wrapAsync(queryFunc);

            result = wrappedQuery(query);
            connection.end();

            return result; 
        },
        'paypalTransactionsQuery': function(query) {
            if(!this.userId) {
                return -1;
            }
            /*
               paypal_classic.execute({
               method: "TransactionSearch",
               startdate: start,
               enddate: end
               }, function(e,r) {
               console.log(e);
               console.log(r);
               return r.decoded;
               });
               */
            var result;
            var wrappedQuery = Meteor.wrapAsync(paypal_classic.execute);

            result = wrappedQuery(query);

            return result.response.decoded;
        },
        'stripeListQuery': function(options) {
            if(!this.userId) {
                return -1;
            }
            var result;
            var wrappedQuery = Meteor.wrapAsync(_.bind(stripe.charges.list, stripe.charges));
            var retArr = [];

            result = wrappedQuery(options);
            retArr = retArr.concat(result.data);

            while(result.has_more == true) {
                options.starting_after = result.data[result.data.length - 1].id;
                result = wrappedQuery(options);
                retArr = retArr.concat(result.data);
            }

            return retArr;
        },
        'getGapiKeys': function() {
            if(!this.userId) {
                return -1;
            }
            return gapiKeys; 
        }
    });

}
