// const { DataTypes } = require("sequelize");
// const sequelize = require("../dbConfig");
// const Transaction = require("./Transaction");

// const Sales = sequelize.define(
//     "Sales",
//     {
//         salesId: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         customerId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Customer',
//                 key: 'cusId',
//             },
//         },
//         guarantorId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Guarantor',
//                 key: 'guarantorId',
//             },
//         },
//         productId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Products',
//                 key: 'productId',
//             },
//         },
//         saleDate: {
//             type: DataTypes.DATE,
//             allowNull: true,
//         },
//         cashierName: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         driverId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Driver',
//                 key: 'id',
//             },
//         },
//         transactionId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Transaction',
//                 key: 'transactionId',
//             },
//         },
//         paymentStatus: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         status: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         note: {
//             type: DataTypes.TEXT,
//             allowNull: true,
//         },
//     },
//     {
//         tableName: "sales",
//         timestamps: false,
//     }
// );

// Sales.belongsTo(Transaction, { foreignKey: 'transactionId' });
// Transaction.hasOne(Sales, { foreignKey: 'transactionId' });

// module.exports = { Sales, Transaction };


// const { DataTypes } = require("sequelize");
// const sequelize = require("../dbConfig");
// const Customer = require("./Customer");
// const Guarantor = require("./Guarantor");
// const Products = require("./Products");
// const Driver = require("./Driver");

// const Sales = sequelize.define(
//     "Sales",
//     {
//         sales_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         customerId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Customer',
//                 key: 'cusId',
//             },
//         },
//         guarantorId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Guarantor',
//                 key: 'guarantorId',
//             },
//         },
//         productId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Products',
//                 key: 'productId',
//             },
//         },
//         saleDate: {
//             type: DataTypes.DATE,
//             allowNull: true,
//         },
//         cashierName: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         driverId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'Driver',
//                 key: 'id',
//             },
//         },
//         paymentStatus: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         status: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         note: {
//             type: DataTypes.TEXT,
//             allowNull: true,
//         },
//         // Fields from Transaction model
//         price: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//         },
//         extraCharges: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//         },
//         totalAmount: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//         },
//         paymentType: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         paidAmount: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//         },
//         due: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//         },
//     },
//     {
//         tableName: "sales",
//         timestamps: false,
//     }
// );

// // Associations
// Sales.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
// Sales.belongsTo(Guarantor, { foreignKey: 'guarantorId', as: 'guarantor' });
// Sales.belongsTo(Products, { foreignKey: 'productId', as: 'product' });
// Sales.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });

// module.exports = Sales;


// In model/Sales.js

//works





// const { DataTypes } = require('sequelize');
// const sequelize = require('../dbConfig');

// const Sales = sequelize.define('Sales', {
//     salesId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     customerId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     guarantorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     productId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     saleDate: {
//         type: DataTypes.DATE,
//         allowNull: false
//     },
//     cashierName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     driverId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     transactionId: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     paymentStatus: {
//         type: DataTypes.ENUM('pending', 'completed'),
//         defaultValue: 'pending'
//     },
//     status: {
//         type: DataTypes.ENUM('hire', 'rent', 'sale'),
//         defaultValue: 'hire'
//     },
//     note: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     }
// });

// const Transaction = sequelize.define('Transaction', {
//     transactionId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     salesId: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     price: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false
//     },
//     extraCharges: {
//         type: DataTypes.DECIMAL(10, 2),
//         defaultValue: 0
//     },
//     totalAmount: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false
//     },
//     paymentType: {
//         type: DataTypes.ENUM('cash', 'pay_later', 'online'),
//         allowNull: false
//     },
//     paidAmount: {
//         type: DataTypes.DECIMAL(10, 2),
//         defaultValue: 0
//     },
//     due: {
//         type: DataTypes.DECIMAL(10, 2),
//         defaultValue: 0
//     }
// });

// // Define associations
// Sales.hasOne(Transaction, { foreignKey: 'salesId' });
// Transaction.belongsTo(Sales, { foreignKey: 'salesId' });

// module.exports = { Sales, Transaction };


///const { DataTypes } = require('sequelize');
// const sequelize = require('../dbConfig');

// const Sales = sequelize.define('Sales', {
//     salesId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     customerId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'customer', // Ensure this matches the table name
//             key: 'cusId' // Ensure this matches the column name
//         }
//     },
//     guarantorId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'guarantor', // Ensure this matches the table name
//             key: 'guarantorId' // Ensure this matches the column name
//         }
//     },
//     productId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'products', // Ensure this matches the table name
//             key: 'productId' // Ensure this matches the column name
//         }
//     },
//     saleDate: {
//         type: DataTypes.DATE,
//         allowNull: true
//     },
//     cashierName: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     driverId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'driver', // Ensure this matches the table name
//             key: 'id' // Ensure this matches the column name
//         }
//     },
//     transactionId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'transactions', // Ensure this matches the table name
//             key: 'transactionId' // Ensure this matches the column name
//         }
//     },
//     paymentStatus: {
//         type: DataTypes.STRING,
//         defaultValue: 'pending'
//     },
//     status: {
//         type: DataTypes.STRING,
//         // defaultValue: 'hire'
//     },
//     note: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     }
// }, {
//     tableName: 'sales',
//     timestamps: true,
//     underscored: true
// });

// const Transaction = sequelize.define('Transaction', {
//     transactionId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     salesId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'sales', // Ensure this matches the table name
//             key: 'salesId' // Ensure this matches the column name
//         }
//     },
//     price: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     extraCharges: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//     },
//     totalAmount: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     paymentType: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     paidAmount: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//     },
//     due: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//     }
// }, {
//     tableName: 'transactions',
//     timestamps: true,
//     underscored: true
// });

// // Define associations
// Sales.belongsTo(Transaction, { foreignKey: 'transactionId' });
// Transaction.hasOne(Sales, { foreignKey: 'transactionId' });

// module.exports = { Sales, Transaction };























// const { DataTypes } = require('sequelize');
// const sequelize = require('../dbConfig');
// const Customer = require('./Customer');
// const Guarantor = require('./Guarantor');
// const Product = require('./Products');
// const Driver = require('./Driver');

// const Sales = sequelize.define('Sales', {
//     salesId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     customerId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'customer',
//             key: 'cusId'
//         }
//     },
//     guarantorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'guarantor',
//             key: 'guarantorId'
//         }
//     },
//     productId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'products',
//             key: 'productId'
//         }
//     },
//     saleDate: {
//         type: DataTypes.DATE,
//         allowNull: true
//     },
//     cashierName: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     driverId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'driver',
//             key: 'id'
//         }
//     },
//     transactionId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'transactions',
//             key: 'transactionId'
//         }
//     },
//     paymentStatus: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     status: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     note: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     },
//     createdAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     },
//     updatedAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     }
// }, {
//     tableName: 'sales',
//     timestamps: true,
//     underscored: true
// });

// const Transaction = sequelize.define('Transaction', {
//     transactionId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     salesId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'sales',
//             key: 'salesId'
//         }
//     },
//     price: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     extraCharges: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     totalAmount: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     paymentType: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     paidAmount: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     due: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     createdAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     },
//     updatedAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     }
// }, {
//     tableName: 'transactions',
//     timestamps: true,
//     underscored: true
// });

// // Define associations
// Sales.belongsTo(Transaction, { foreignKey: 'transactionId' });
// Transaction.hasOne(Sales, { foreignKey: 'transactionId' });

// // Additional associations for Sales
// Sales.belongsTo(Customer, { foreignKey: 'cusId' });
// Sales.belongsTo(Guarantor, { foreignKey: 'guarantorId' });
// Sales.belongsTo(Product, { foreignKey: 'productId' });
// Sales.belongsTo(Driver, { foreignKey: 'id' });

// module.exports = { Sales, Transaction };
















// const { DataTypes } = require('sequelize');
// const sequelize = require('../dbConfig');
// const Customer = require('./Customer');
// const Guarantor = require('./Guarantor');
// const Driver = require('./Driver');
// const Product = require('./Products');

// const Sales = sequelize.define('Sales', {
//     salesId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     customerId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//                         model: 'customer',
//                         key: 'cusId'
//                     }
//     },
//     guarantorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//                 references: {
//             model: 'guarantor',
//             key: 'guarantorId'
//         }
//     },
//     productId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     saleDate: {
//         type: DataTypes.DATE,
//         allowNull: false
//     },
//     cashierName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     driverId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//                 references: {
//                     model: 'driver',
//                     key: 'id'
//                 }
//     },
//     transactionId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//                 references: {
//                     model: 'transactions',
//                     key: 'transactionId'
//                 }
//     },
//     paymentStatus: {
//         type: DataTypes.ENUM('pending', 'completed'),
//         defaultValue: 'pending'
//     },
//     status: {
//         type: DataTypes.ENUM('hire', 'rent', 'sale'),
//         defaultValue: 'hire'
//     },
//     note: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     }
//     }, {
//         tableName: 'sales',
//         //     timestamps: true,
//         //     underscored: true
//     });

// const Transaction = sequelize.define('Transaction', {
//     transactionId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     salesId: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     price: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false
//     },
//     extraCharges: {
//         type: DataTypes.DECIMAL(10, 2),
//         defaultValue: 0
//     },
//     totalAmount: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false
//     },
//     paymentType: {
//         type: DataTypes.ENUM('cash', 'pay_later', 'online'),
//         allowNull: false
//     },
//     paidAmount: {
//         type: DataTypes.DECIMAL(10, 2),
//         defaultValue: 0
//     },
//     due: {
//         type: DataTypes.DECIMAL(10, 2),
//         defaultValue: 0
//     }
// });

// // Define associations
// // Sales.hasOne(Transaction, { foreignKey: 'salesId' });
// // Transaction.belongsTo(Sales, { foreignKey: 'salesId' });

// Sales.belongsTo(Transaction, { foreignKey: 'transactionId' });
// Transaction.hasOne(Sales, { foreignKey: 'transactionId' });

// // Additional associations for Sales
// Sales.belongsTo(Customer, { foreignKey: 'cusId' });
// Sales.belongsTo(Guarantor, { foreignKey: 'guarantorId' });
// Sales.belongsTo(Product, { foreignKey: 'productId' });
// Sales.belongsTo(Driver, { foreignKey: 'id' });

// module.exports = { Sales, Transaction };



///----------------------------------------------------------------------------------------------------------------

// const { DataTypes } = require('sequelize');
// const sequelize = require('../dbConfig');

// const Sales = sequelize.define('Sales', {
//     salesId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     customerId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: { model: 'Customers', key: 'cusId' }
//     },
//     guarantorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: { model: 'Guarantors', key: 'guarantorId' }
//     },
//     productId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: { model: 'Products', key: 'productId' }
//     },
//     saleDate: {
//         type: DataTypes.DATE,
//         allowNull: false
//     },
//     cashierName: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     driverId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: { model: 'Drivers', key: 'id' }
//     },
//     transactionId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: { model: 'Transactions', key: 'transactionId' }
//     },
//     paymentStatus: {
//         type: DataTypes.ENUM('pending', 'completed'),
//         defaultValue: 'pending'
//     },
//     status: {
//         type: DataTypes.ENUM('hire', 'rent', 'sale'),
//         defaultValue: 'hire'
//     },
//     note: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     }
// });

// const Transaction = sequelize.define('Transaction', {
//     transactionId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     salesId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: { model: 'Sales', key: 'salesId' }
//     },
//     price: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     extraCharges: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//     },
//     totalAmount: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     paymentType: {
//         type: DataTypes.ENUM('cash', 'pay_later', 'online'),
//         allowNull: false
//     },
//     paidAmount: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//     },
//     due: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//     }
// });

// Sales.belongsTo(Transaction, { foreignKey: 'transactionId' });
// Transaction.hasOne(Sales, { foreignKey: 'transactionId' });

// module.exports = { Sales, Transaction };


// const { DataTypes } = require('sequelize');
// const sequelize = require('../dbConfig');

// const Sales = sequelize.define('Sales', {
//     salesId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     customerId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: { model: 'Customers', key: 'cusId' }
//     },
//     guarantorId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: { model: 'Guarantors', key: 'guarantorId' }
//     },
//     productId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: { model: 'Products', key: 'productId' }
//     },
//     saleDate: {
//         type: DataTypes.DATE,
//         allowNull: true
//     },
//     cashierName: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     driverId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: { model: 'Drivers', key: 'id' }
//     },
//     note: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     }
// });

// const Transaction = sequelize.define('Transaction', {
//     transactionId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     salesId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: { model: 'Sales', key: 'salesId' }
//     },
//     price: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     extraCharges: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     totalAmount: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     paymentType: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     paidAmount: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     due: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     }
// });

 
// Sales.hasOne(Transaction, { foreignKey: 'salesId' });
// Transaction.belongsTo(Sales, { foreignKey: 'salesId' });

// module.exports = { Sales, Transaction };



const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const Product = require('./Products');
const Customer = require('./Customer');

const Sales = sequelize.define('Sales', {
    salesId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'customer',
            key: 'cusId'
        }
    },
    guarantorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'guarantor',
            key: 'guarantorId'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'products',
            key: 'productId'
        }
    },
    saleDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cashierName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'driver',
            key: 'id'
        }
    },
    transactionId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    paymentStatus: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    refund: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    meeterBefore: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    meeterAfter: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: true
    },

}, {
    tableName: 'sales',
    indexes: [
        {
            name: 'idx_sale_date',
            fields: ['saleDate']
        }
    ]
});

const Transaction = sequelize.define('Transaction', {
    transactionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    salesId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'sales',
            key: 'salesId'
        }
    },
    cusId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'customer',
            key: 'cusId'
        }
    },
    pId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'products',
            key: 'productId'
        }
    },
    returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
       
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    extraCharges: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    paymentType: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    paidAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    due: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    },
    note: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    tableName: 'transactions'
});

Sales.hasOne(Transaction, { 
    foreignKey: 'salesId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});
Transaction.belongsTo(Sales, { 
    foreignKey: 'salesId'
});
Transaction.belongsTo(Product, {
    foreignKey: 'pId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});
Transaction.belongsTo(Customer, {
    foreignKey: 'cusId'
});


module.exports = { Sales, Transaction };