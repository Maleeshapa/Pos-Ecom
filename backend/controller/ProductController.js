const Product = require("../model/Products");
const Category = require("../model/Category");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

// Image upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const productName = req.body.productName || 'product';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const safeProductName = productName.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${safeProductName}_${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage }).single('productImage');

// Create a new product
const createProduct = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const {
                productName,
                productSellingPrice,
                productDescription,
                categoryId
            } = req.body;

            // Generate sequential product code
            const existingProducts = await Product.findAll({
                where: {
                    productName: productName
                }
            });

            const productCode = `PROD-${productName.toLowerCase().replace(/\s+/g, '')}-${String(existingProducts.length + 1).padStart(3, '0')}`;
            // Validate category
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(400).json({ message: 'Invalid category ID' });
            }

            let productImage = null;
            if (req.file) {
                const protocol = req.secure ? 'https' : req.headers['x-forwarded-proto'] || req.protocol;
                productImage = `${protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
            }

            const newProduct = await Product.create({
                productName,
                productCode, // Using our generated code
                productSellingPrice,
                productDescription,
                productImage,
                productStatus: "In stock",
                category_categoryId: categoryId,
            });

            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: `An error occurred: ${error.message}` });
        }
    });
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category, as: 'category' }]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category' }]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getProductByName = async (req, res) => {
    try {
        const { name } = req.params;

        const product = await Product.findOne({
            where: { productName: name }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } product
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// const updateProduct = async (req, res) => {
//     upload(req, res, async function (err) {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json({ error: 'Image upload failed' });
//         } else if (err) {
//             return res.status(500).json({ error: 'Unknown error: Image upload failed' });
//         }

//         try {
//             const { id } = req.params;
//             const {
//                 productName,
//                 productCode,
//                 productDiscount,
//                 productSellingPrice,
//                 productWarranty,
//                 productDescription,
//                 productEmi,
//                 productStatus,                
//                 productChassi ,
//                 categoryId,
//             } = req.body;

//             // Validate category
//             if (categoryId) {
//                 const category = await Category.findByPk(categoryId);
//                 if (!category) {
//                     return res.status(400).json({ message: 'Invalid category ID' });
//                 }
//             }

//             const product = await Product.findByPk(id);
//             if (!product) {
//                 return res.status(404).json({ message: 'Product not found' });
//             }

//             let productImage = product.productImage;
//             if (req.file) {
//                 const oldImagePath = productImage
//                     ? path.join(__dirname, '..', 'uploads', 'products', path.basename(productImage))
//                     : null;

//                 if (oldImagePath && fs.existsSync(oldImagePath)) {
//                     fs.unlinkSync(oldImagePath);
//                 }

//                 productImage = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
//             }


//             await product.update({
//                 productName,
//                 productCode,
//                 productDiscount,
//                 productSellingPrice,
//                 productWarranty,
//                 productDescription,
//                 productEmi,
//                 productStatus,
//                 productChassi ,
//                 category_categoryId: categoryId,
//                 productImage
//             });

//             const updatedProduct = await Product.findByPk(id, {
//                 include: [{ model: Category, as: 'category' }]
//             });

//             res.status(200).json(updatedProduct);
//         } catch (error) {
//             res.status(500).json({ error: `An error occurred: ${error.message}` });
//         }
//     });
// };

const updateProduct = async (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: 'Image upload failed' });
      } else if (err) {
        return res.status(500).json({ error: 'Unknown error: Image upload failed' });
      }
  
      try {
        const { id } = req.params;
        const {
          productName,
          productCode,
          productDiscount,
          productSellingPrice,
          productWarranty,
          productDescription,
          productEmi,
          productStatus,                
          productChassi,
          categoryId,
        } = req.body;
  
        // Validate category
        if (categoryId) {
          const category = await Category.findByPk(categoryId);
          if (!category) {
            return res.status(400).json({ message: 'Invalid category ID' });
          }
        }
  
        const product = await Product.findByPk(id);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
  
        let productImage = product.productImage;
            if (req.file) {
                const protocol = req.secure ? 'https' : req.headers['x-forwarded-proto'] || req.protocol;
                productImage = `${protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
                
                // Delete old image if it exists
                if (product.productImage) {
                    const oldImagePath = path.join(__dirname, '..', 'uploads', 'products', path.basename(product.productImage));
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }}}
  
        await product.update({
          productName,
          productCode,
          productDiscount,
          productSellingPrice,
          productWarranty,
          productDescription,
          productEmi,
          productStatus,
          productChassi,
          category_categoryId: categoryId,
          productImage
        });
  
        const updatedProduct = await Product.findByPk(id, {
          include: [{ model: Category, as: 'category' }]
        });
  
        res.status(200).json(updatedProduct);
      } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
      }
    });
  };

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productImagePath = product.productImage
            ? path.join(__dirname, '..', 'uploads', 'products', path.basename(product.productImage))
            : null;

        if (productImagePath && fs.existsSync(productImagePath)) {
            fs.unlinkSync(productImagePath);
        }

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getProductByCodeOrName = async (req, res) => {
    try {
        const { value } = req.params;
        const product = await Product.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { productCode: value },
                    { productName: value },
                    { productImage: value }
                ]
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: error.message });
    }
};


const getProductSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({ message: 'Query must be at least 2 characters long' });
        }

        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { productName: { [Op.like]: `%${query}%` } }, 
                    { productCode: { [Op.like]: `%${query}%` } }, 
                ],
            },
            limit: 10, 
            include: [{ model: Category, as: 'category' }], 
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No matching products found' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching product suggestions:', error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getProductImageByCode = async (req, res) => {
    try {
        const { productCode } = req.params; 
        const product = await Product.findOne({ where: { productCode } });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.productImage) {
            return res.status(404).json({ message: 'Product image not found' });
        }

        const imageFileName = path.basename(product.productImage);
        const imagePath = path.join(__dirname, '..', 'uploads', 'products', imageFileName);

        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Image file not found' });
        }

        res.sendFile(imagePath);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};


// Get products where rentOrHire column equals 'rent'
const getRentProducts = async (req, res) => {
    try {
        const rentProducts = await Product.findAll({
            where: { rentOrHire: 'rent' },
            include: [{ model: Category, as: 'category' }]
        });

        if (rentProducts.length === 0) {
            return res.status(404).json({ message: 'No rent products found' });
        }

        res.status(200).json(rentProducts);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByName,
    updateProduct,
    deleteProduct,
    getProductByCodeOrName,
    getProductSuggestions,
    getProductImageByCode,
    getRentProducts
};
