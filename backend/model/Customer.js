// const { DataTypes } = require("sequelize");
// const sequelize = require("../dbConfig");

// const Customer = sequelize.define(
//     "Customer",
//     {
//         cusId: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         cusCode: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         cusName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         cusAddress: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         cusPhone: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         cusJob: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         cusOffice: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         cusStore: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },        
//         cusEmail: {
//             type: DataTypes.STRING,
//             allowNull: true, 
//         },
//     },
//     {
//         tableName: "customer",
//         timestamps: false,
//     }
// );
// module.exports = Customer;

// Guarantor Model


const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

const Customer = sequelize.define(
    "Customer",
    {
        cusId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cusCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cusName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cusPhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cusJob: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // cusOffice: {
        //     type: DataTypes.STRING,
        //     allowNull: true,
        // },
        // cusStore: {
        //     type: DataTypes.STRING,
        //     allowNull: true,
        // },
        // cusEmail: {
        //     type: DataTypes.STRING,
        //     allowNull: true,
        // },
        nic: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nicFront: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nicBack: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        license: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guarantorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Guarantor',
                key: 'guarantorId',
            },
        },
        customerReview: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        customerDescription: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "customer",
        timestamps: false,
    }
);

module.exports = Customer;