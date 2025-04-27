const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');

const RentImages = sequelize.define('RentImages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imageOne: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageTwo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageThree: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageFour: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    salesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Sales',
            key: 'salesId'
        }
    }
}, {
    tableName: 'rentImages',
    timestamps: false
});

module.exports = RentImages;