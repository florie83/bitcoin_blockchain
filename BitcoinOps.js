var _ = require('underscore');
async = require("async");
var MD5 = require('MD5');

module.exports = {
    version: '1.0',

    createNewPayment: function( payment, bitcoin_destination_address, callback ){
        var self = this;
        self.bitcoin_destination_address = bitcoin_destination_address;
        async.parallel(
            {
                findBTCPrice: function(){
                    self.findBTCPrice( payment, callback );
                },
                getBlockchaininfoPaymentData: function(){
                    self.getBlockchaininfoPaymentData(payment, self.bitcoin_destination_address, callback);
                }
            },callback
        );
    },

    findBTCPrice: function(payment, callback) {
        request.get('https://blockchain.info/tobtc?currency=USD&value=10', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                payment.invoice_amt = body;
                payment.invoice_amtsat = Math.ceil( payment.invoice_amt / Math.pow(10,-8) );
                callback();
            }
            else
                callback(error)

        });
    },

    createPaymentID: function(username) {
        var date = new Date();

        return date.getMonth() + date.getYear() + MD5( username + date );
    },

    findUsersPendingPayment: function(username, sequilize_user_mdl, sequilize_payment_mdl, callback) {
        var user_id = null;
        //get user_id associated with username
        sequilize_user_mdl.find({
            where: {
                username: username
            }
        }).then(function(user,err){
            if( !_.isUndefined(user) && err == null ){
                user_id = user.id;

                //find existing payments
                sequilize_payment_mdl.find({
                    where: {
                        user_id: user_id,
                        order_status: 'PENDING'
                    }
                }).then(callback)

            }
        })

    },

    insertPaymentIntoDatabase: function(payment, user_id, premium_order_mdl, callback) {
        premium_order_mdl.create({
            id:"",
            user_id: user_id,
            payment_hash: payment.invoice_id,
            days: 30,
            amount: payment.invoice_amt,
            amount_satoshi: payment.invoice_amtsat,
            bitcoin_address: payment.bitcoin_address,
            secret: 'qwer1234',
            order_status: 'PENDING',
            callback_url: payment.callback_url

        }).then(function(order,err){
            callback( { order: order, err: err } );
        })
    },

    getBlockchaininfoPaymentData: function( payment, bitcoin_destination_address, callback ) {
        var host_url = 'http://test.com';//cluster_settings.server_hostname
        ///todo: make this secret unique for each transaction
        var callback_url =  host_url + '/plugin/bitcoin/callback.php?invoice_id=' + payment.invoice_id + '&secret=qwer1234';
        ///todo: place bitcoin address in clusterconfig
        var bitcoinaddr = bitcoin_destination_address;

        if(_.isNull( bitcoinaddr )) {
            console.log('no bitcoin address, halting');
            return;
        }
        var payment_generator_url = 'https://blockchain.info/api/receive?method=create&callback=' + encodeURI( callback_url ) + '&address=' + bitcoinaddr;

        request.get(payment_generator_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var blockchain_return = JSON.parse( body);

                payment.bitcoin_address = blockchain_return.input_address;
                payment.callback_url = blockchain_return.callback_url;
                callback();
            }
            else{
                payment.error = 'error';
                callback(body)
            }

        });
    }
}