const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');

const SupplierPayment = sequelize.define('SupplierPayment', {
    payId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    payDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    payAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
},
    {
        timestamps: false,
        tableName: 'supplierpayments',
    });

module.exports = SupplierPayment;
