const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const InvoiceProduct = require('../model/InvoiceProduct');

const createInvoiceProduct = async (req, res) => {
  try {
    const invoiceProducts = req.body;

    if (!Array.isArray(invoiceProducts) || invoiceProducts.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const newProducts = [];

    for (const invoiceProduct of invoiceProducts) {
      const { productId, invoiceId, invoiceNo, totalAmount, invoiceQty, sendQty, deliverdQty, discount, unitAmount, invoiceProductStatus } = invoiceProduct;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(400).json({ message: `Invalid product ID: ${productId}` });
      }

      const invoice = await Invoice.findByPk(invoiceId);
      if (!invoice) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
      }

      const existingProduct = await InvoiceProduct.findOne({ where: { invoiceId, productId } });
      if (!existingProduct) {
        newProducts.push(invoiceProduct);
      }
    }

    const createdInvoiceProducts = [];
    for (const invoiceProduct of newProducts) {
      const { productId, invoiceId, invoiceNo, totalAmount, invoiceQty, sendQty, deliverdQty, discount, unitAmount, invoiceProductStatus } = invoiceProduct;

      const newInvoiceProduct = await InvoiceProduct.create({
        productId,
        invoiceId,
        invoiceNo,
        totalAmount,
        invoiceQty,
        sendQty,
        deliverdQty,
        discount,
        unitAmount,
        invoiceProductStatus,
      });

      createdInvoiceProducts.push(newInvoiceProduct);
    }

    res.status(201).json({
      message: 'Invoice products created successfully',
      invoiceProducts: createdInvoiceProducts
    });
  } catch (error) {
    console.error('Error creating invoice products:', error);
    res.status(500).json({
      message: 'Server error occurred while creating the invoice products',
      error: error.message,
    });
  }
};

const getAllInvoiceProducts = async (req, res) => {
  try {
    const invoiceProduct = await InvoiceProduct.findAll({
      include: [
        { model: Invoice, as: 'invoice' },
        { model: Product, as: 'product' }
      ]
    });
    res.status(200).json(invoiceProduct);
  } catch (error) {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};

const deleteInvoiceProductById = async (req, res) => {
  try {
    const { invoiceProductId } = req.params;
    const invoiceProduct = await InvoiceProduct.findByPk(invoiceProductId);
    if (!invoiceProduct) {
      return res.status(404).json({ message: 'Invoice product not found' });
    }
    await invoiceProduct.destroy();
    res.status(200).json({ message: 'Invoice product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete invoice product', error: error.message });
  }
};

module.exports = {
  createInvoiceProduct,
  getAllInvoiceProducts,
  deleteInvoiceProductById
};
