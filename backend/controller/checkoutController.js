// controllers/checkoutController.js
const { Sales, Transaction } = require('../model/Sales');
const Product = require('../model/Products');
const sequelize = require('../dbConfig');

const checkout = async (req, res) => {
  // Start transaction
  const t = await sequelize.transaction();
  
  try {
    const { cartItems, discount, paidAmount, due, note } = req.body;
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart items are required' 
      });
    }

    // Calculate total price from cart items
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = subtotal - (discount || 0);
    
    // First create the transaction record
    const transaction = await Transaction.create({
      price: subtotal,
      discount: discount || 0,
      totalAmount: totalAmount,
      paidAmount: paidAmount || 0,
      due: due || 0,
      note: note || '',
      paymentType: 'cash', // Default or can be passed from frontend
      createdAt: new Date()
    }, { transaction: t });

    // Create sales records for each item in the cart
    const salesPromises = cartItems.map(item => {
      return Sales.create({
        productId: item.id,
        saleDate: new Date(),
        transactionId: transaction.transactionId,
        price: item.price,
        quantity: item.quantity,
        note: note || '',
        status: 'sold'
      }, { transaction: t });
    });

    // Wait for all sales records to be created
    const salesRecords = await Promise.all(salesPromises);
    
    // Commit transaction
    await t.commit();
    
    res.status(200).json({
      success: true,
      message: 'Checkout successful',
      transactionId: transaction.transactionId,
      salesIds: salesRecords.map(sale => sale.salesId)
    });
    
  } catch (error) {
    // Rollback transaction in case of error
    await t.rollback();
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Checkout failed',
      error: error.message
    });
  }
};

module.exports = { checkout };