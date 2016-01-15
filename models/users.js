/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('FREE USER','INVITED','NEOPHITE','PAID USER','ADMIN'),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastlogindate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastloginip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE','PENDING','DISABLED','SUSPENDED'),
      allowNull: false,
      defaultValue: 'active'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    datecreated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastPayment: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paidExpiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentTracker: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetHash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apikey: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{
    createdAt: 'datecreated',
    updatedAt: false
  });
};
