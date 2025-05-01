const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Product = require("./Products");  

const EcomStock = sequelize.define(
    "EcomStock",
    {
        ecomstockId : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "productId",
            },
        },
        stockQTY: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stockDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "ecomstock",
        timestamps: false,
    }
);

EcomStock.belongsTo(Product,{
    foreignKey:'productId',
    as:'product'
})

module.exports=EcomStock;