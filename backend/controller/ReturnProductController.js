const ReturnProduct = require('../model/ReturnProduct');
const InvoiceProduct = require('../model/InvoiceProduct');
const Return = require('../model/Return');
const Product = require('../model/Products');

async function createReturnProduct(req, res) {
    try {
        const returns = req.body;

        // Validate input
        if (!Array.isArray(returns) || returns.length === 0) {
            return res.status(400).json({ message: "No returns provided" });
        }

        const createdReturns = [];

        for (const returnItem of returns) {
            const { returnQty, returnAmount, returnItemType, returnNote, returnDate, invoiceProductId, returnItemId, productId } = returnItem;

            // Validate required fields
            if (!returnQty || !returnItemType || !invoiceProductId || !returnItemId || !productId) {
                return res.status(400).json({
                    message: "Missing required fields in return item",
                    returnItem,
                });
            }

            // Validate related entities
            const invoiceProduct = await InvoiceProduct.findByPk(invoiceProductId);
            if (!invoiceProduct) {
                return res.status(400).json({
                    message: `Invalid invoice product ID: ${invoiceProductId}`,
                });
            }

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ message: `Invalid Product ID: ${productId}` });
            }

            // Create return product
            const newReturnProduct = await ReturnProduct.create({
                returnQty,
                returnAmount,
                returnItemType,
                returnNote,
                returnDate,
                invoiceProductId,
                returnItemId,
                productId
            });

            createdReturns.push(newReturnProduct);
        }

        res.status(201).json({
            message: "New returns added successfully",
            returns: createdReturns,
        });
    } catch (error) {
        console.error("Error creating return products:", error);
        res.status(500).json({
            error: `An error occurred: ${error.message}`,
        });
    }
}

async function getAllReturnProducts(req, res) {
    try {
        const returnProducts = await ReturnProduct.findAll({
            include: [
                {
                    model: InvoiceProduct,
                    as: 'invoiceProduct'
                },
                {
                    model: Return,
                    as: 'return'
                },
            ]
        });

        res.status(200).json(returnProducts);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getAllReturnProductsById(req, res) {
    try {
        const returnProductId = req.params.id;

        const returnProducts = await ReturnProduct.findAll({
            where: { returnProductId },
            include: [
                {
                    model: InvoiceProduct,
                    as: 'invoiceProduct',
                },
                {
                    model: Return,
                    as: 'return'
                },
            ],
        });

        if (returnProducts.length === 0) {
            return res.status(404).json({ message: 'No return products found for the given ID' });
        }

        res.status(200).json(returnProducts);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

async function getReturnProductsByInvoiceProductId(req, res) {
    try {
        const { returnItemId } = req.params;

        if (!returnItemId) {
            return res.status(400).json({ message: "Return product ID is required" });
        }

        const returnProducts = await ReturnProduct.findAll({
            where: { returnItemId },
            include: [
                {
                    model: InvoiceProduct,
                    as: 'invoiceProduct',
                },
                {
                    model: Return,
                    as: 'return'
                },
                {
                    model: Product,
                    as: 'product'
                }
            ],
        });

        if (returnProducts.length === 0) {
            return res.status(404).json({ message: 'No return products found for the given invoice product ID' });
        }

        res.status(200).json(returnProducts);
    } catch (error) {
        console.error("Error fetching return products by invoice product ID:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
}

module.exports = {
    createReturnProduct,
    getAllReturnProducts,
    getAllReturnProductsById,
    getReturnProductsByInvoiceProductId
};
