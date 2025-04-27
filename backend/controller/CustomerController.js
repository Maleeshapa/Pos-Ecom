const path = require("path");
const multer = require("multer");
const Customer = require("../model/Customer");
const { Op } = require("sequelize");
const fs = require('fs'); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/cusNicImages");
    },
    filename: function (req, file, cb) {
        const nic = req.body.nic || "unknown";

        let fileName = nic;
        if (file.fieldname === "nicFront") {
            fileName += "-front.jpg"; // Enforce .jpg extension
        } else if (file.fieldname === "nicBack") {
            fileName += "-back.jpg"; // Enforce .jpg extension
        }

        cb(null, fileName);
    },
});

const upload = multer({ storage: storage }).fields([
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
]);
 
async function createCustomer(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Image upload failed" });
        }

        try {
            const { cusName, cusAddress, cusPhone, cusJob, nic, license, customerReview, customerDescription } = req.body;

            const lastCustomer = await Customer.findOne({
                order: [["cusCode", "DESC"]],
            });

            const lastCusCode = lastCustomer?.cusCode || "CUS000";
            const lastNumber = parseInt(lastCusCode.slice(3), 10);
            const newNumber = lastNumber + 1;
            const cusCode = `CUS${newNumber.toString().padStart(3, "0")}`;

            const nicFront = req.files["nicFront"] ? `/uploads/cusNicImages/${nic}-front.jpg` : null;
            const nicBack = req.files["nicBack"] ? `/uploads/cusNicImages/${nic}-back.jpg` : null;

            const newCustomer = await Customer.create({
                cusName,
                cusCode,
                cusAddress,
                cusPhone,
                cusJob,
                nic,
                license,
                customerReview,
                customerDescription,
                nicFront,
                nicBack,
            });

            return res.status(201).json({ message: "Customer created successfully.", newCustomer });

        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                return res.status(400).json({ error: "Validation error: Please check the provided data." });
            }
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(409).json({ error: "Customer already exists." });
            }
            return res.status(500).json({ error: `An internal server error occurred: ${error.message}` });
        }
    });
}

// async function getAllCustomers(req, res) {
//     try {
//         const customer = await Customer.findAll();
//         res.status(200).json(customer);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

async function getAllCustomers(req, res) {
    try {
        // Extract pagination parameters from request query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        // Get total count for pagination info
        const totalCount = await Customer.count();
        
        // Query with pagination - FIXED: removed sorting by createdAt
        // Either use an existing column for sorting or remove sorting completely
        const customers = await Customer.findAll({
            limit: limit,
            offset: offset,
            // Sort by cusId instead of createdAt
            order: [['cusId', 'DESC']] 
        });
        
        // Return paginated results
        res.status(200).json({
            data: customers,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error in getAllCustomers:', error);
        res.status(500).json({ message: error.message });
    }
}

async function getCustomerById(req, res) {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);

        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// async function updateCustomer(req, res) {
//     try {
//         const { id } = req.params;
//         const {
//             cusName,
//             cusAddress,
//             cusPhone,
//             cusJob,
//             nic,
//             license,
//             customerReview,
//             customerDescription
//         } = req.body;

//         const customer = await Customer.findByPk(id);
//         if (!customer) {
//             return res.status(404).json({ message: "Customer not found" });
//         }

//         let nicFrontPath = customer.nicFront;
//         let nicBackPath = customer.nicBack;

//         if (req.files) {
//             if (req.files["nicFront"]) {
//                 const nicFrontFile = req.files["nicFront"][0];
//                 nicFrontPath = `/uploads/cusNicImages/${nic}-front${path.extname(nicFrontFile.originalname)}`;
//                 fs.renameSync(nicFrontFile.path, nicFrontPath);
//             }

//             if (req.files["nicBack"]) {
//                 const nicBackFile = req.files["nicBack"][0];
//                 nicBackPath = `/uploads/cusNicImages/${nic}-back${path.extname(nicBackFile.originalname)}`;
//                 fs.renameSync(nicBackFile.path, nicBackPath);
//             }
//         }

//         await customer.update({
//             cusName,
//             cusAddress,
//             cusPhone,
//             cusJob,
//             nic,
//             license,
//             customerReview,
//             customerDescription,
//             nicFront: nicFrontPath,
//             nicBack: nicBackPath,
//         });

//         res.status(200).json({ message: "Customer updated successfully", customer });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }


async function updateCustomer(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Image upload failed" });
        }
        
        try {
            const { id } = req.params;
            const {
                cusName,
                cusAddress,
                cusPhone,
                cusJob,
                nic,
                license,
                customerReview,
                customerDescription,
                existingNicFront,
                existingNicBack
            } = req.body;

            const customer = await Customer.findByPk(id);
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }

            // Start with current paths
            let nicFrontPath = customer.nicFront;
            let nicBackPath = customer.nicBack;

            // Check if new files were uploaded
            if (req.files) {
                if (req.files["nicFront"]) {
                    nicFrontPath = `/uploads/cusNicImages/${nic}-front.jpg`;
                }

                if (req.files["nicBack"]) {
                    nicBackPath = `/uploads/cusNicImages/${nic}-back.jpg`;
                }
            }

            await customer.update({
                cusName,
                cusAddress,
                cusPhone,
                cusJob,
                nic,
                license,
                customerReview,
                customerDescription,
                nicFront: nicFrontPath,
                nicBack: nicBackPath,
            });

            res.status(200).json({ message: "Customer updated successfully", customer });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}

async function checkNicExists(req, res) {
    try {
        const { nic } = req.params;
        
        // Validate the NIC parameter
        if (!nic || nic.trim() === '') {
            return res.status(400).json({ 
                exists: false, 
                message: "NIC parameter is required" 
            });
        }
        
        // Check if a customer with this NIC exists
        const existingCustomer = await Customer.findOne({
            where: { nic: nic.trim() }
        });
        
        // Return the result
        return res.status(200).json({
            exists: !!existingCustomer,
            message: existingCustomer ? "Customer with this NIC already exists" : "No customer found with this NIC"
        });
    } catch (error) {
        console.error("Error checking NIC existence:", error);
        return res.status(500).json({ 
            exists: false,
            message: "Error checking customer NIC",
            error: error.message 
        });
    }
}

async function deleteCustomer(req, res) {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        await customer.destroy();
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerByCode(req, res) {
    try {
        const { code } = req.params;

        const customer = await Customer.findOne({
            where: { cusCode: code }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        } customer
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerByName(req, res) {
    try {
        const { name } = req.params;

        const customer = await Customer.findOne({
            where: { cusName: name }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        } customer
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerSuggestions(req, res) {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({ message: 'Query must be at least 2 characters long' });
        }

        const customer = await Customer.findAll({
            where: {
                [Op.or]: [
                    { cusName: { [Op.like]: `%${query}%` } },
                ]
            },
            attributes: ['cusName'],
            limit: 10
        });

        res.status(200).json(customer);
    } catch (error) {
        console.error('Error fetching product suggestions:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerSuggestion(req, res) {
    try {
        const { name } = req.query; // Ensure this matches the query parameter name

        if (!name || name.length < 2) {
            return res.status(400).json({ message: 'Query must be at least 2 characters long' });
        }

        const customers = await Customer.findAll({
            where: {
                cusName: {
                    [Op.like]: `%${name}%`, // Search for customers with names containing the input
                },
            },
            limit: 10, // Limit the number of suggestions
        });

        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customer suggestions:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getCustomerByNIC(req, res) {
    try {
        const { nic } = req.params;

        // Using an exact match instead of a LIKE query
        const customer = await Customer.findOne({
            where: { nic }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Return the customer data as an object (or in the required format)
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getNICsuggestions(req, res) {
    try {
        const { query } = req.params;

        const customers = await Customer.findAll({
            where: {
                nic: {
                    [Op.like]: `%${query}%`
                }
            },
            limit: 10  // Limit the number of suggestions
        });

        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    checkNicExists,
    deleteCustomer,
    getCustomerByCode,
    getCustomerByName,
    getCustomerSuggestions,
    getCustomerSuggestion,
    getCustomerByNIC,
    getNICsuggestions
}