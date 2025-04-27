const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const ExpensesCat = require("./ExpensesCat");
const Product = require("./Products");  

const Expenses = sequelize.define(
    "Expenses",
    {
        expensesId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        expensesCatId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: ExpensesCat,
                key: "expensesCatId",
            },
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Product,
                key: "productId",
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "expenses",
        timestamps: false,
    }
);

 
Expenses.belongsTo(ExpensesCat, { foreignKey: "expensesCatId", as: "expensesCategory" });
Expenses.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = Expenses;
