/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('premium_order', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    payment_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    days: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    order_status: {
      type: DataTypes.ENUM('PENDING','CANCELLED','COMPLETED','FORWARDED'),
      allowNull: false
    },
    bitcoin_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false
    },
    callback_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount_satoshi: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
     tableName: 'premium_order'
  });
};
