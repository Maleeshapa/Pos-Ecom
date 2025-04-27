const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Invoice = require('./Invoice')
const Product = require("./Products");

const InvoiceProduct = sequelize.define(
    "InvoiceProduct",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'invoiceProductId'  // Maps 'id' to 'invoiceProductId' in database
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "productId",
            },
            allowNull: false,
        },
        invoiceId: {
            type: DataTypes.INTEGER,
            references: {
                model: Invoice,
                key: "invoiceId",
            },
            allowNull: false,
        },
        invoiceNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        invoiceQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sendQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deliverdQty: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        unitAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoiceProductStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "invoiceproduct",
        timestamps: false,
    }
);

InvoiceProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });
InvoiceProduct.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });

module.exports = InvoiceProduct;