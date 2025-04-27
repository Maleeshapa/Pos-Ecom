const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const InvoiceProduct = require('./InvoiceProduct');
const Return = require('./Return');
const Product = require('./Products');

const ReturnProduct = sequelize.define(
    'ReturnProduct',
    {
        returnProductId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        returnQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        returnAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        returnItemType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        returnDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        returnNote: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        invoiceProductId: {
            type: DataTypes.INTEGER,
            references: {
                model: InvoiceProduct,
                key: "invoiceProductId",  // Now matches primary key in InvoiceProduct
            },
            allowNull: false,
        },
        returnItemId: {
            type: DataTypes.INTEGER,
            references: {
                model: Return,
                key: "returnItemId",
            },
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "productId"  // Fixed typo: was 'product'
            },
            allowNull: false,
        },
    },
    {
        tableName: 'returnproducts',
        timestamps: false,
    }
);

ReturnProduct.belongsTo(InvoiceProduct, { foreignKey: 'invoiceProductId', as: 'invoiceProduct' });
ReturnProduct.belongsTo(Return, { foreignKey: 'returnItemId', as: 'return' });
ReturnProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = ReturnProduct;