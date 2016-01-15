/**
 * creates interface for users to create bitcoin orders
 * Created by ad on 1/3/14.
 */
var _ = require('underscore');
var express     = require('express');
var session     = require('express-session');
var Sequelize   = require('sequelize');
var request     = require('request');

var bitcoin = require('./BitcoinOps.js');

function BitcoinAPI() {
    var p = BitcoinAPI.prototype;
    p = this;
    var self = this;

    p.init = function(url, appCode) {
        self.settings = {};

        self.server_config = require( ''+'../' + 'server_config.json' );

        self.initSequelize();

        self.app = express();
        self.decorateRoute();

        self.app.listen(8888); ///todo: load from cluster config
    }

    p.initSequelize = function() {
        var	sequelize = new Sequelize('yetidb',
            self.server_config.general_mysql_user,
            self.server_config.general_mysql_pass,
            {
                host:self.server_config.general_mysql_ip,
                dialect:'mysql',
                port:self.server_config.general_mysql_port,
                define:{
                    chareset: 'utf8',
                    collate: 'utf8_general_ci'
                }
            });
        //todo:: need global access to this??
        sequelize.sync({force:false});
        self.settings.sequelize = sequelize;
        self.settings.mdl_payment = sequelize.import(__dirname + "/models/premium_order.js");
        self.settings.mdl_user = sequelize.import(__dirname + "/models/users.js");

    }

    p.decorateRoute = function(url, appCode) {

        self.app.use(function topMiddleware_AllowCrossDomain(req, res, next) {
            //console.log('allowing cross domain');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            next();
        });

        self.app.get('/getPriceOfRenewal', function(req, res){
            var priceOfRenewal_USD = 10; //todo:  pull this value from database or config
            var url = "https://blockchain.info";

            request.get(url + '/tobtc?currency=USD&value=' + priceOfRenewal_USD,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.json({value_btc: body, value_usd: priceOfRenewal_USD});
                    }
                    else{
                        //todo: write error responses here
                        res.json({error: 'error occurred'});
                    }
            });
            return false;
        })

        self.app.get('/paymentCreate', function(req, res){

            var payment = {            //todo: use error as error indicator
                blockchain_return : null,
                bitcoin_address: null,
                invoice_id : null,
                invoice_amt : null,
                invoice_amtsat: null,
                invoice_productname : "1 month extension",
                invoice_amtusd : 10,
                product_id : 1,
                callback_url: null,
                error: null
            }

            var username = findUsername(req);

            if(username === false ){
                res.json({error:'no username'});
                return;
            }

            bitcoin.findUsersPendingPayment(username, self.settings.mdl_user, self.settings.mdl_payment,
                function(existingPayment, err){

                    if(_.isNull(existingPayment) )
                    {
                        //create new invoiceID and then request new payment from blockchain.info
                        payment.invoice_id = bitcoin.createPaymentID( username );
                        bitcoin.createNewPayment(payment, self.server_config.bitcoin.address,
                            function(err, result){
                                if(_.isUndefined(err)){

                                    bitcoin.insertPaymentIntoDatabase(
                                        payment,
                                        username,
                                        self.settings.mdl_payment,
                                        function respondWithResult(result){
                                            if(_.isUndefined(result.err))
                                                res.json({payment: payment});
                                            else
                                                res.json({payment: err}); //todo: handle errors better
                                        }
                                    )

                                }
                                else {
                                    //todo: handle errors better
                                    res.json({payment: err});
                                }
                        });
                    }
                    else {
                        //todo:: indicate in the database that this was forwarded
                        payment.invoice_id = existingPayment.payment_hash;
                        payment.invoice_amt = existingPayment.amount;
                        payment.invoice_amtsat = existingPayment.amount_satoshi;
                        payment.bitcoin_address = existingPayment.bitcoin_address;

                        res.json({payment:payment});
                        return false;
                    }
                });


            return false;
        })

        function findUsername(req){
            var username =  req.username;
            var query_username = req.query.username ;

            if( !_.isUndefined(username ) ){
                return username
            }
            else if (!_.isUndefined(query_username)){
                return query_username
            }
            else
                return false
        }
    }

    p.proc = function debugLogger() {
        if ( self.silent == true) {
            return
        }
    }


}


if (module.parent == null) {
    var service = new BitcoinAPI();
    service.init();

}


exports.BasicClass = BitcoinAPI;

