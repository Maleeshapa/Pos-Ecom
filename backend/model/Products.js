const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Category = require("./Category");

const Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false    
    },
    productDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    productSellingPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    productWarranty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productEmi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "In stock",
    },
    productChassi: {
      type: DataTypes.STRING,
      allowNull: true,  
    },
    rentOrHire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "category",
        key: "categoryId",
      },
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

Product.belongsTo(Category, {
  foreignKey: "category_categoryId",
  as: "category",
});


module.exports = Product;
