

const { Sales, Transaction } = require('../model/Sales');
const sequelize = require('../dbConfig');
const Customer = require('../model/Customer');
const Product = require('../model/Products');
const { Op, Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const RentImages = require('../model/RentImages');
const DueCustomer = require('../model/DueCustomer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/rentImages');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({ storage }).array('images', 4);


// const createSale = async (req, res) => {
//     const t = await sequelize.transaction();
    
//     try {
//         const {
//             customerId, guarantorId, productId, saleDate, cashierName,
//             driverId, refund, meeterBefore, note, price, extraCharges, totalAmount,
//             paymentType, paidAmount, due
//         } = req.body;

//         // Validate the refund field
//         const refundValue = refund === '' || refund === null ? 0 : parseInt(refund, 10);

//         // Create the sale record
//         const sale = await Sales.create({
//             customerId,
//             guarantorId: guarantorId || null,
//             productId,
//             saleDate,
//             cashierName,
//             driverId: driverId || null,
//             paymentStatus: 'pending',
//             refund: refundValue,  
//             meeterBefore,   
//             note
//         }, { transaction: t });

//         // Create the transaction record
//         const transaction = await Transaction.create({
//             salesId: sale.salesId,
//             pId: productId,
//             price: Number(price),
//             extraCharges: Number(extraCharges),
//             totalAmount: Number(totalAmount),
//             paymentType,
//             paidAmount: Number(paidAmount),
//             due: Number(due)
//         }, { transaction: t });

//         // Update sale with transaction ID
//         await sale.update({ 
//             transactionId: transaction.transactionId 
//         }, { transaction: t });

//         // Handle image uploads and save paths correctly
//         if (req.files && req.files.length > 0) {
//             const imageRecord = {
//                 salesId: sale.salesId,
//                 imageOne: null,
//                 imageTwo: null,
//                 imageThree: null,
//                 imageFour: null
//             };

//             // Map each file to the corresponding image field
//             req.files.forEach((file, index) => {
//                 const imageFieldName = `image${['One', 'Two', 'Three', 'Four'][index]}`;
//                 imageRecord[imageFieldName] = `/uploads/rentImages/${file.filename}`;
//             });

//             // Create the rentImages record
//             await RentImages.create(imageRecord, { transaction: t });
//         }

//         await t.commit();
//         res.status(201).json({ 
//             success: true,
//             sale, 
//             transaction
//         });

//     } catch (error) {
//         await t.rollback();
//         console.error('Error creating sale:', error);
//         res.status(500).json({ 
//             success: false,
//             error: error.message 
//         });
//     }
// };

// Only showing the updated createSale method
const createSale = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        let transactionData;
        
        // Handle both FormData and JSON requests
        if (req.files && req.files.length > 0) {
            // Request contains files, parse the JSON data from formData
            transactionData = JSON.parse(req.body.transactionData);
        } else {
            // Regular JSON request
            transactionData = req.body;
        }
        
        const {
            cusId, saleDate, price, extraCharges, discount, 
            totalAmount, paymentType, paidAmount, due, note, products
        } = transactionData;

        // Validate required fields
        if (!cusId || !products || !products.length) {
            await t.rollback();
            return res.status(400).json({ 
                success: false, 
                error: 'Customer ID and at least one product are required' 
            });
        }

        // 1. Create the transaction record first
        const transaction = await Transaction.create({
            cusId,
            price: Number(price),
            extraCharges: Number(extraCharges || 0),
            discount: Number(discount || 0),
            totalAmount: Number(totalAmount),
            paymentType,
            paidAmount: Number(paidAmount || 0),
            due: Number(due || 0),
            note,
            createdAt: saleDate || new Date(),
            pId: products[0].productId // Reference the first product ID (required by schema)
        }, { transaction: t });

        // 2. Create sales records for each product
        const salesRecords = await Promise.all(
            products.map(product => 
                Sales.create({
                    customerId: cusId,
                    productId: product.productId,
                    saleDate: saleDate || new Date(),
                    transactionId: transaction.transactionId,
                    price: Number(product.price),
                    quantity: Number(product.quantity || 1),
                    status: 'rent',
                    note: note || '',
                    paymentStatus: Number(paidAmount) >= Number(totalAmount) ? 'paid' : 'partial',
                }, { transaction: t })
            )
        );

        // 3. Handle image uploads if any
        if (req.files && req.files.length > 0) {
            const firstSaleId = salesRecords[0].salesId;
            
            const imageRecord = {
                salesId: firstSaleId,
                imageOne: null,
                imageTwo: null,
                imageThree: null,
                imageFour: null
            };

            // Map each file to the corresponding image field
            req.files.forEach((file, index) => {
                const imageFieldName = `image${['One', 'Two', 'Three', 'Four'][index]}`;
                imageRecord[imageFieldName] = `/uploads/rentImages/${file.filename}`;
            });

            // Create the rentImages record
            await RentImages.create(imageRecord, { transaction: t });
        }

        await t.commit();
        
        res.status(201).json({ 
            success: true,
            transactionId: transaction.transactionId,
            salesIds: salesRecords.map(record => record.salesId)
        });

    } catch (error) {
        await t.rollback();
        console.error('Error creating sale:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};




//worked
// const getAllSales = async (req, res) => {
//     try {
//         const sales = await Sales.findAll({ include: [Transaction] });
//         res.status(200).json(sales);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const getAllSales = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const sales = await Sales.findAll({
            include: [Transaction],
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getRentImagesBySalesId = async (req, res) => {
    try {
        const { salesId } = req.params;

        const rentImages = await RentImages.findOne({
            where: { salesId }
        });

        if (!rentImages) {
            return res.status(404).json({ message: 'No images found for this sale' });
        }

        res.status(200).json(rentImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const getAllSales = async (req, res) => {
//     try {
//       const sales = await Sale.findAll({
//         include: [
//           { model: Customer, attributes: ['cusName'] },
//           { model: Product, attributes: ['productName'] }
//         ]
//       });
//       res.json(sales);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

const getSaleById = async (req, res) => {
    try {
        const sale = await Sales.findByPk(req.params.id, { include: [Transaction] });
        if (!sale) return res.status(404).json({ message: 'Sale not found' });
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const updateSale = async (req, res) => {
//     const t = await sequelize.transaction();

//     try {
//         const {
//             customerId, guarantorId, productId, saleDate, cashierName,
//             driverId, note, price, extraCharges, totalAmount,
//             paymentType, paidAmount, due , returnDate
//         } = req.body;

//         const sale = await Sales.findByPk(req.params.id);
//         if (!sale) {
//             await t.rollback();
//             return res.status(404).json({ message: 'Sale not found' });
//         }

//         await sale.update({
//             customerId,
//             guarantorId: guarantorId || null,
//             productId,
//             saleDate,
//             cashierName,
//             driverId,
//             note
//         }, { transaction: t });

//         const transaction = await Transaction.findOne({ where: { salesId: sale.salesId } });
//         if (transaction) {
//             await transaction.update({
//                 returnDate,
//                 price,
//                 extraCharges,
//                 totalAmount,
//                 paymentType,
//                 paidAmount,
//                 due
//             }, { transaction: t });
//         }

//         await t.commit();
//         res.status(200).json({ sale, transaction });
//     } catch (error) {
//         await t.rollback();
//         res.status(500).json({ error: error.message });
//     }
// };


//update working

// const updateSale = async (req, res) => {
//     const t = await sequelize.transaction();
  
//     try {
//       const {
//         customerId, guarantorId, productId, saleDate, cashierName,
//         driverId, note, price, extraCharges, totalAmount,
//         paymentType, paidAmount, due, returnDate
//       } = req.body;
  
//       const sale = await Sales.findByPk(req.params.id);
//       if (!sale) {
//         await t.rollback();
//         return res.status(404).json({ message: 'Sale not found' });
//       }
  
//       await sale.update({
//         customerId,
//         guarantorId: guarantorId || null,
//         productId,
//         saleDate,
//         cashierName,
//         driverId,
//         note
//       }, { transaction: t });
  
//       const transaction = await Transaction.findOne({ where: { salesId: sale.salesId } });
//       if (transaction) {
//         await transaction.update({
//           returnDate,
//           price,
//           extraCharges,
//           totalAmount,
//           paymentType,
//           paidAmount,
//           due
//         }, { transaction: t });
//       }
  
//       await t.commit();
//       res.status(200).json({ sale, transaction });
//     } catch (error) {
//       await t.rollback();
//       res.status(500).json({ error: error.message });
//     }
//   };

const updateSale = async (req, res) => {
    const t = await sequelize.transaction();
  
    try {
      const {
        customerId, guarantorId, productId, saleDate, cashierName,
        driverId, note, price, extraCharges, totalAmount,
        payingAmount, due, returnDate
      } = req.body;
  
      const sale = await Sales.findByPk(req.params.id);
      if (!sale) {
        await t.rollback();
        return res.status(404).json({ message: 'Sale not found' });
      }
  
      await sale.update({
        customerId,
        guarantorId: guarantorId || null,
        productId,
        saleDate,
        cashierName,
        driverId,
        note
      }, { transaction: t });
  
      const transaction = await Transaction.findOne({ 
        where: { salesId: sale.salesId } 
      });
  
      if (transaction) {
        // Add new payment to existing paidAmount
        const updatedPaidAmount = transaction.paidAmount + payingAmount;
  
        await transaction.update({
          returnDate,
          price,
          extraCharges,
          totalAmount,
          paidAmount: updatedPaidAmount,
          due: due // Use the calculated due amount from frontend
        }, { transaction: t });
      }
  
      await t.commit();
      
      // Fetch updated records to return
      const updatedSale = await Sales.findByPk(req.params.id, {
        include: [Transaction]
      });
      
      res.status(200).json(updatedSale);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  };

const deleteSale = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const sale = await Sales.findByPk(req.params.id);
        if (!sale) {
            await t.rollback();
            return res.status(404).json({ message: 'Sale not found' });
        }

        await Transaction.destroy({ where: { salesId: sale.salesId }, transaction: t });
        await sale.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

// const getAllSalesHire = async (req, res) => {
//     try {
//         // Fetch only sales where the status is 'hire' and include the associated transactions
//         const sales = await Sales.findAll({
//             where: { status: 'hire' },  // Filter by 'hire' status
//             include: [Transaction]      // Include associated Transaction data
//         });

//         if (sales.length === 0) {
//             return res.status(404).json({ message: 'No sales with status "hire" found' });
//         }

//         res.status(200).json(sales);  // Return the filtered sales data
//     } catch (error) {
//         res.status(500).json({ error: error.message });  // Handle any errors
//     }
// };

const getAllSalesHire = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const sales = await Sales.findAll({
            where: { status: 'hire' },  // Filter by 'hire' status
            include: [Transaction],      // Include associated Transaction data
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]  // Order by creation date
        });

        if (sales.length === 0) {
            return res.status(404).json({ message: 'No sales with status "hire" found' });
        }

        res.status(200).json(sales);  // Return the filtered and paginated sales data
    } catch (error) {
        res.status(500).json({ error: error.message });  // Handle any errors
    }
};


// const getAllSalesRent = async (req, res) => {
//     try {
         
//         const sales = await Sales.findAll({
//             where: { status: 'rent' },   
//             include: [Transaction]       
//         });

//         if (sales.length === 0) {
//             return res.status(404).json({ message: 'No sales with status "rent" found' });
//         }

//         res.status(200).json(sales);   
//     } catch (error) {
//         res.status(500).json({ error: error.message });   
//     }
// };

// const getAllSalesRent = async (req, res) => {
//     try {
//         const { page = 1, pageSize = 10 } = req.query;
//         const offset = (page - 1) * pageSize;

//         const sales = await Sales.findAll({
//             where: { status: 'rent' },  // Filter by 'rent' status
//             include: [Transaction],     // Include associated Transaction data
//             limit: parseInt(pageSize),
//             offset: parseInt(offset),
//             order: [['createdAt', 'DESC']]  // Order by creation date
//         });

//         if (sales.length === 0) {
//             return res.status(404).json({ message: 'No sales with status "rent" found' });
//         }

//         res.status(200).json(sales);  // Return the filtered and paginated sales data
//     } catch (error) {
//         res.status(500).json({ error: error.message });  // Handle any errors
//     }
// };

const getAllSalesRent = async (req, res) => {
    try {
        // Make pagination optional
        const { page, pageSize } = req.query;
        
        // Base query options
        const queryOptions = {
            where: { status: 'rent' },
            include: [Transaction],
            order: [['createdAt', 'DESC']]
        };
        
        // Only add pagination if both parameters are provided
        if (page && pageSize) {
            const offset = (parseInt(page) - 1) * parseInt(pageSize);
            queryOptions.limit = parseInt(pageSize);
            queryOptions.offset = offset;
        }
        
        // Add explicit attributes to exclude problematic fields
        // This is a workaround if you can't modify the model right away
        queryOptions.attributes = {
            exclude: ['meeterBefore', 'meeterAfter'] // Exclude any columns that might not exist
        };
        
        const sales = await Sales.findAll(queryOptions);
        
        // Always return 200 with data, even if empty
        return res.status(200).json(sales);
        
    } catch (error) {
        console.error('Error in getAllSalesRent:', error);
        // Return a more client-friendly error message
        res.status(500).json({ 
            error: "Database error. Please contact support." 
        });
    }
};


const hireCreate = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            customerId, guarantorId, productId, saleDate, cashierName,
            driverId, note, price, extraCharges, totalAmount,
            paymentType, paidAmount, due
        } = req.body;

        const sale = await Sales.create({
            customerId,
            guarantorId: guarantorId || null,
            productId,
            saleDate,
            cashierName,
            driverId,
            paymentStatus: 'pending', 
            status: 'hire',
            note
        }, { transaction: t });

    
        const transaction = await Transaction.create({
            salesId: sale.salesId,
            price,
            extraCharges,
            totalAmount,
            paymentType,
            paidAmount,
            due,
            pId: productId
        }, { transaction: t });

        // Update the Sale record with the transactionId
        await sale.update({ transactionId: transaction.transactionId }, { transaction: t });

        // Commit the transaction
        await t.commit();

        // Send the response
        res.status(201).json({ sale, transaction });
    } catch (error) {
        // Rollback the transaction in case of error
        await t.rollback();
        console.error('Error creating sale:', error);
        res.status(500).json({ error: error.message });
    }
};

const getRevenueAnalytics = async (req, res) => {
  try {
      const { startDate, endDate, groupBy = 'day' } = req.query;

      // Validate date parameters
      if (!startDate || !endDate) {
          return res.status(400).json({ 
              error: 'Both startDate and endDate are required' 
          });
      }

      // Define time grouping formats based on groupBy parameter
      const timeFormats = {
          day: '%Y-%m-%d',
          week: '%Y-%U',
          month: '%Y-%m',
          year: '%Y'
      };

      const format = timeFormats[groupBy] || timeFormats.day;

      // Perform optimized aggregate query
      const revenue = await Transaction.findAll({
          attributes: [
              [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), format), 'timePeriod'],
              [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'totalRevenue'],
              [Sequelize.fn('SUM', Sequelize.col('paidAmount')), 'receivedRevenue'],
              [Sequelize.fn('COUNT', Sequelize.col('transactionId')), 'transactionCount']
          ],
          where: {
              createdAt: {
                  [Op.between]: [startDate, endDate]
              },
              totalAmount: {
                  [Op.not]: null  // Only include transactions with amounts
              }
          },
          group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), format)],
          order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), format), 'ASC']],
          raw: true
      });

      // Calculate summary statistics
      const summary = {
          totalRevenue: revenue.reduce((sum, record) => sum + parseFloat(record.totalRevenue || 0), 0),
          receivedRevenue: revenue.reduce((sum, record) => sum + parseFloat(record.receivedRevenue || 0), 0),
          totalTransactions: revenue.reduce((sum, record) => sum + parseInt(record.transactionCount || 0), 0),
          averageRevenuePerPeriod: revenue.length > 0 
              ? (revenue.reduce((sum, record) => sum + parseFloat(record.totalRevenue || 0), 0) / revenue.length).toFixed(2)
              : 0
      };

      res.status(200).json({
          groupedBy: groupBy,
          timeRange: {
              start: startDate,
              end: endDate
          },
          summary,
          revenueData: revenue
      });

  } catch (error) {
      console.error('Error in revenue analytics:', error);
      res.status(500).json({ 
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
  }
};

// const getAllTransactions = async (req, res) => {
//     try {
//         const transaction = await Transaction.findAll();
//         res.status(200).json(transaction);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getAllTransactions = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const transactions = await Transaction.findAll({
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]  // Order by creation date
        });

        res.status(200).json(transactions);  // Return the paginated transactions
    } catch (error) {
        res.status(500).json({ message: error.message });  // Handle any errors
    }
};

// const getAllSalesWithTransactions = async (req, res) => {
//     try {
//         const sales = await Sales.findAll({
//             include: [
//                 {
//                     model: Transaction,
//                     attributes: ['transactionId', 'pId', 'price', 'totalAmount', 'paidAmount', 'due', 'paymentType'],
//                 },
//                 {
//                     model: Customer,
//                     attributes: ['cusName'], // Fetch customer name
//                 },
//                 {
//                     model: Product,
//                     attributes: ['productName'], // Fetch product name
//                 }
//             ],
//             order: [['createdAt', 'DESC']]
//         });

//         res.status(200).json(sales);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const getCurrentMonthTransactions = async (req, res) => {
    try {
        // Get the first and last date of the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Fetch transactions only from the current month
        const transactions = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getCurrentMonthSales = async (req, res) => {
    try {
        // Get the first and last date of the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Fetch transactions only from the current month
        const sales = await Sales.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const checkout = async (req, res) => {
//     // Start transaction
//     const t = await sequelize.transaction();
    
//     try {
//       const { cartItems, discount, paidAmount, due, note } = req.body;
      
//       if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Cart items are required' 
//         });
//       }
  
//       // Calculate total price from cart items
//       const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//       const totalAmount = subtotal - (discount || 0);
      
//       // First create the transaction record
//       const transaction = await Transaction.create({
//         price: subtotal,
//         discount: discount || 0,
//         totalAmount: totalAmount,
//         paidAmount: paidAmount || 0,
//         due: due || 0,
//         note: note || '',
//         paymentType: 'cash', // Default or can be passed from frontend
//         createdAt: new Date()
//       }, { transaction: t });
  
//       // Create sales records for each item in the cart
//       const salesPromises = cartItems.map(item => {
//         return Sales.create({
//           productId: item.id,
//           saleDate: new Date(),
//           transactionId: transaction.transactionId,
//           price: item.price,
//           quantity: item.quantity,
//           note: note || '',
//           status: 'sold'
//         }, { transaction: t });
//       });
  
//       // Wait for all sales records to be created
//       const salesRecords = await Promise.all(salesPromises);
      
//       // Commit transaction
//       await t.commit();
      
//       res.status(200).json({
//         success: true,
//         message: 'Checkout successful',
//         transactionId: transaction.transactionId,
//         salesIds: salesRecords.map(sale => sale.salesId)
//       });
      
//     } catch (error) {
//       // Rollback transaction in case of error
//       await t.rollback();
//       console.error('Checkout error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Checkout failed',
//         error: error.message
//       });
//     }
//   };

const checkout = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { cartItems, discount, paidAmount, due, note, paymentType } = req.body;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ 
                success: false, 
                message: 'Cart items are required' 
            });
        }

        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalAmount = subtotal - discount;

        // Create transaction
        const transaction = await Transaction.create({
            price: subtotal,
            discount: discount || 0,
            totalAmount: totalAmount,
            paidAmount: paidAmount || 0,
            due: due || 0,
            note: note || '',
            paymentType: paymentType || 'cash',
            pId: cartItems[0].productId // Using first product ID as reference
        }, { transaction: t });

        // Create sales records
        const salesRecords = await Promise.all(
            cartItems.map(item => 
                Sales.create({
                    productId: item.productId,
                    saleDate: new Date(),
                    transactionId: transaction.transactionId,
                    price: item.price,
                    quantity: item.quantity,
                    note: note || '',
                    status: 'sold',
                    // paymentStatus: paidAmount >= totalAmount ? 'paid' : 'partial',
                    // customerId: 1 // Default customer or get from request
                }, { transaction: t })
            )
        );

        await t.commit();
        
        res.status(200).json({
            success: true,
            message: 'Checkout successful',
            transactionId: transaction.transactionId,
            salesRecords: salesRecords.map(s => s.salesId)
        });
        
    } catch (error) {
        await t.rollback();
        console.error('Checkout error:', error);
        res.status(500).json({
            success: false,
            message: 'Checkout failed',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getTodayIncome = async (req, res) => {
    try {
        // Get today's date at start and end of day (local time)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Sum all totalAmount for transactions created today
        const result = await Transaction.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'totalIncome']
            ],
            where: {
                createdAt: {
                    [Op.between]: [todayStart, todayEnd]
                }
            },
            raw: true
        });

        // Handle null result (no transactions today)
        const totalIncome = result && result.totalIncome ? parseFloat(result.totalIncome) : 0;
        
        res.status(200).json({ 
            success: true,
            totalIncome: totalIncome
        });
    } catch (error) {
        console.error('Error in getTodayIncome:', error);
        res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
};

const getTodayOrderCount = async (req, res) => {
    try {
        // Get today's date at start and end of day (local time)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Count all transactions created today
        const orderCount = await Transaction.count({
            where: {
                createdAt: {
                    [Op.between]: [todayStart, todayEnd]
                }
            }
        });

        res.status(200).json({ 
            success: true,
            orderCount: orderCount
        });
    } catch (error) {
        console.error('Error in getTodayOrderCount:', error);
        res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
};

const getTodayReceivedMoney = async (req, res) => {
    try {
        // Get today's date at start and end of day (local time)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Sum all paidAmount for transactions created today
        const result = await Transaction.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('paidAmount')), 'totalReceived']
            ],
            where: {
                createdAt: {
                    [Op.between]: [todayStart, todayEnd]
                }
            },
            raw: true
        });

        // Handle null result (no transactions today)
        const totalReceived = result && result.totalReceived ? parseFloat(result.totalReceived) : 0;
        
        res.status(200).json({ 
            success: true,
            totalReceived: totalReceived
        });
    } catch (error) {
        console.error('Error in getTodayReceivedMoney:', error);
        res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
};

const getSalesByTransactionId = async (req, res) => {
    try {
      const { transactionId } = req.params;
      
      // Validate input
      if (!transactionId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Transaction ID is required' 
        });
      }
  
      // Find sales associated with the transaction ID
      const sales = await Sales.findAll({
        where: { transactionId: transactionId },
        order: [['salesId', 'DESC']]
      });
  
      res.status(200).json(sales);
    } catch (error) {
      console.error('Error fetching sales by transaction ID:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  };
  
  // Add this new endpoint to your transactionController.js (or create it)
  
  const deleteTransaction = async (req, res) => {
    const t = await sequelize.transaction();
  
    try {
      const { id } = req.params;
      
      // First find the transaction
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        await t.rollback();
        return res.status(404).json({ 
          success: false, 
          message: 'Transaction not found' 
        });
      }
  
      // Find associated sales
      const sales = await Sales.findAll({
        where: { transactionId: id },
        transaction: t
      });
  
      // Delete all associated sales
      if (sales.length > 0) {
        await Sales.destroy({
          where: { transactionId: id },
          transaction: t
        });
      }
  
      // Finally delete the transaction
      await transaction.destroy({ transaction: t });
  
      await t.commit();
      
      res.status(200).json({ 
        success: true, 
        message: 'Transaction and associated sales deleted successfully' 
      });
    } catch (error) {
      await t.rollback();
      console.error('Error deleting transaction:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  };

  const getDueTransactions = async (req, res) => {
    try {
      // Fetch transactions with due amount greater than 0
      const transactions = await Transaction.findAll({
        where: {
          due: {
            [Op.gt]: 0 // Due greater than 0
          }
        },
        order: [['createdAt', 'DESC']]
      });
  
      if (transactions.length === 0) {
        return res.status(200).json([]);
      }
  
      // Get customer data separately to avoid relation issues
      const results = [];
      for (const transaction of transactions) {
        // Find the first sale associated with this transaction to get the customer
        const sale = await Sales.findOne({
          where: { transactionId: transaction.transactionId },
          attributes: ['customerId']
        });
  
        let customerData = null;
        if (sale && sale.customerId) {
          const customer = await Customer.findByPk(sale.customerId);
          if (customer) {
            customerData = {
              cusId: customer.cusId,
              cusName: customer.cusName,
              cusCode: customer.cusCode || '',
              cusOffice: customer.cusOffice || ''
            };
          }
        }
  
        results.push({
          ...transaction.toJSON(),
          customer: customerData || {
            cusId: 0,
            cusName: 'Unknown Customer',
            cusCode: '',
            cusOffice: ''
          }
        });
      }
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching due transactions:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  };

  const getCustomerDueDetails = async (req, res) => {
    try {
      const { cusId } = req.params;
      
      if (!cusId) {
        return res.status(400).json({
          success: false,
          error: 'Customer ID is required'
        });
      }
      
      // First, get the customer details
      const customer = await Customer.findByPk(cusId);
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }
      
      // Find all sales associated with this customer
      const sales = await Sales.findAll({
        where: { customerId: cusId }
      });
      
      // Get the transaction IDs from sales
      const transactionIds = sales.map(sale => sale.transactionId).filter(Boolean);
      
      // Fetch all transactions with due amounts
      const transactions = await Transaction.findAll({
        where: {
          transactionId: { [Op.in]: transactionIds },
          due: { [Op.gt]: 0 }
        },
        order: [['createdAt', 'DESC']]
      });
      
      // Calculate total due amount
      const totalDueAmount = transactions.reduce((sum, txn) => sum + Number(txn.due || 0), 0);
      
      res.status(200).json({
        success: true,
        customer: {
          cusId: customer.cusId,
          cusName: customer.cusName,
          cusCode: customer.cusCode || '',
          cusOffice: customer.cusOffice || '',
          cusPhone: customer.cusPhone || '',
          cusEmail: customer.cusEmail || ''
        },
        totalDueAmount,
        transactions
      });
      
    } catch (error) {
      console.error('Error fetching customer due details:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  const payTransactionDue = async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { payingAmount, cusId, payType, datedCheque, chequeDetail } = req.body;
  
      if (!transactionId || !payingAmount || !cusId || !payType) {
        return res.status(400).json({ error: "Transaction ID, paying amount, customer ID, and payment type are required." });
      }
  
      // Additional validation for cheque payments
      if (payType === 'cheque' && (!datedCheque || !chequeDetail)) {
        return res.status(400).json({ error: "Cheque date and details are required for cheque payments." });
      }
  
      // Find the transaction
      const transaction = await Transaction.findByPk(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Validate paying amount
      if (parseFloat(payingAmount) > parseFloat(transaction.due)) {
        return res.status(400).json({ error: "Paying amount cannot be greater than due amount." });
      }
  
      // Calculate new amounts
      const updatedPaid = parseFloat(transaction.paidAmount || 0) + parseFloat(payingAmount);
      const updatedDue = parseFloat(transaction.due || 0) - parseFloat(payingAmount);
  
      // Update the transaction
      await transaction.update({
        paidAmount: updatedPaid,
        due: updatedDue,
      });
  
      // Create due payment record
      await DueCustomer.create({
        transactionId: transactionId,
        cusId: cusId,
        dueDate: new Date(),
        dueAmount: updatedDue,
        paidAmount: payingAmount,
        status: 'paid',
        payType: payType,
        datedCheque: payType === 'cheque' ? datedCheque : null,
        chequeDetail: payType === 'cheque' ? chequeDetail : null,
      });
  
      res.status(200).json({ 
        message: 'Payment successful', 
        transaction: {
          transactionId: transaction.transactionId,
          totalAmount: transaction.totalAmount,
          paidAmount: updatedPaid,
          due: updatedDue
        }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ message: 'An error occurred while processing the payment.' });
    }
  };

module.exports = { 
    createSale, 
    getAllSales, 
    getSaleById, 
    updateSale, 
    deleteSale, 
    getAllSalesHire , 
    getAllSalesRent , 
    hireCreate ,
    getCurrentMonthTransactions,
    getCurrentMonthSales,
    getRentImagesBySalesId ,

    
    getAllTransactions,
    getRevenueAnalytics, 
    checkout,
    getTodayIncome,
    getTodayOrderCount,
    getTodayReceivedMoney,
    getSalesByTransactionId,
    deleteTransaction,
    getDueTransactions,
    getCustomerDueDetails,
    payTransactionDue 
   
    

  };
