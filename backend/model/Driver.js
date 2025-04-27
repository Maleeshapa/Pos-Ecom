const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Product = require("./Products.js");

const Driver = sequelize.define(
  "Driver",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    driverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driverAge: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    driverAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    driverPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driverStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driverNic: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    driverLicence: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "productId",
      },
      allowNull: true,  
    },
  },
  {
    tableName: "driver",
    timestamps: false,  
  }
);

// Define associations
Driver.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

module.exports = Driver;
