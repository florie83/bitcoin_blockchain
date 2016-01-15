/*
run SQL commands to provde basic table structure
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `payment_log`
-- ----------------------------
DROP TABLE IF EXISTS `payment_log`;
CREATE TABLE payment_log
(
    id INT(11) PRIMARY KEY NOT NULL,
    user_id INT(11) NOT NULL,
    date_created TIMESTAMP DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
    amount FLOAT(9,2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    request_log TEXT NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of payment_log
-- ----------------------------

-- ----------------------------
-- Table structure for `premium_order`
-- ----------------------------
DROP TABLE IF EXISTS `premium_order`;
CREATE TABLE premium_order
(
    id INT(11) PRIMARY KEY NOT NULL,
    user_id INT(11) NOT NULL,
    payment_hash VARCHAR(32) NOT NULL,
    days INT(11) NOT NULL,
    amount FLOAT(11,11) NOT NULL,
    order_status ENUM('PENDING', 'CANCELLED', 'COMPLETED', 'FORWARDED') NOT NULL,
    bitcoin_address VARCHAR(36) NOT NULL,
    secret VARCHAR(256) NOT NULL,
    createdAt DATETIME,
    updatedAt DATETIME,
    callback_url VARCHAR(256) NOT NULL,
    amount_satoshi INT(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE users
(
    id INT(11) PRIMARY KEY NOT NULL,
    username VARCHAR(65) NOT NULL,
    password VARCHAR(65) NOT NULL,
    level ENUM('FREE USER', 'INVITED', 'NEOPHITE', 'PAID USER', 'ADMIN') NOT NULL,
    email VARCHAR(65),
    lastlogindate DATE,
    lastloginip VARCHAR(32) NOT NULL,
    status ENUM('ACTIVE', 'PENDING', 'DISABLED', 'SUSPENDED') DEFAULT 'active' NOT NULL,
    title VARCHAR(10) NOT NULL,
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    datecreated DATE,
    createdip VARCHAR(15),
    lastPayment DATE,
    paidExpiryDate DATE,
    paymentTracker VARCHAR(32),
    passwordResetHash VARCHAR(32),
    identifier VARCHAR(32) NOT NULL,
    apikey VARCHAR(32) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO users VALUES ('1', 'admin', '5f4dcc3b5aa765d61d8327deb882cf99', 'admin', 'email@yoursite.com', '2012-01-19 21:44:07', '192.168.2.100', 'active', 'Mr', 'Admin', 'User', null, null, '2011-12-27 13:45:22', '2012-01-12 13:45:16', '5f4dcc3b5aa765d61d8327deb882cf99');

