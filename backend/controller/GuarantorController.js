const Guarantor = require('../model/Guarantor');
const { Op } = require('sequelize');
const path = require("path");
const multer = require("multer");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/guarantorNicImages");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        let fileName = req.body.guarantorNic || "unknown";

        if (file.fieldname === "nicFront") {
            fileName += "-front";
        } else if (file.fieldname === "nicBack") {
            fileName += "-back";
        }

        cb(null, `${fileName}${ext}`);
    },
});

const upload = multer({ storage }).fields([
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
]);

const createGuarantor = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: `Image upload failed: ${err.message}` });
        }

        try {
            const { guarantorName, guarantorNic, guarantorPhone, guarantorAddress } = req.body;

            if (!guarantorName || !guarantorNic || !guarantorPhone || !guarantorAddress) {
                return res.status(400).json({ error: "All fields are required." });
            }

            const nicFront = req.files?.nicFront?.[0]?.filename
                ? `/uploads/guarantorNicImages/${req.files.nicFront[0].filename}`
                : null;
            const nicBack = req.files?.nicBack?.[0]?.filename
                ? `/uploads/guarantorNicImages/${req.files.nicBack[0].filename}`
                : null;

            const newGuarantor = await Guarantor.create({
                guarantorName,
                guarantorNic,
                guarantorPhone,
                guarantorAddress,
                nicFront,
                nicBack,
            });

            return res.status(201).json(newGuarantor);
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                return res.status(400).json({
                    error: "Validation error",
                    details: error.errors.map(err => err.message)
                });
            }
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(409).json({ error: "Guarantor already exists." });
            }
            return res.status(500).json({ error: `Internal server error: ${error.message}` });
        }
    });
};

const getGurantorById = async (req, res) => {
    try {
        const { id } = req.params;
        const guarantor = await Guarantor.findByPk(id);
        if (guarantor) {
            res.status(200).json(guarantor);
        } else {
            res.status(404).json({ message: 'Guarantor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllGuarantors = async (req, res) => {
    try {
        const guarantors = await Guarantor.findAll();
        res.status(200).json(guarantors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGurantorSuggestions = async (req, res) => {
    try {
        const { name } = req.params;
        const guarantors = await Guarantor.findAll({
            where: {
                guarantorName: {
                    [Op.like]: name + '%'
                }
            }
        });
        res.status(200).json(guarantors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGuarantor = async (req, res) => {
    try {
        const { id } = req.params;
        const { guarantorName, guarantorNic, guarantorPhone, guarantorAddress } = req.body;
        const guarantor = await Guarantor.findByPk(id);
        if (guarantor) {
            guarantor.guarantorName = guarantorName;
            guarantor.guarantorNic = guarantorNic;
            guarantor.guarantorPhone = guarantorPhone;
            guarantor.guarantorAddress = guarantorAddress;
            await guarantor.save();
            res.status(200).json(guarantor);
        } else {
            res.status(404).json({ message: 'Guarantor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const deleteGuarantor = async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log(`Attempting to delete guarantor with ID: ${id}`); // Log the ID

//         const guarantor = await Guarantor.findByPk(id);
//         if (!guarantor) {
//             console.log('Guarantor not found'); // Log if guarantor is not found
//             return res.status(404).json({ message: 'Guarantor not found' });
//         }

//         await guarantor.destroy();
//         console.log('Guarantor deleted successfully'); // Log success
//         res.status(200).json({ message: 'Guarantor deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting guarantor:', error); // Log the error
//         res.status(500).json({ message: error.message });
//     }
// };


const deleteGuarantor = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete guarantor with ID: ${id}`); // Log the ID

        const guarantor = await Guarantor.findByPk(id);
        if (!guarantor) {
            console.log('Guarantor not found'); // Log if guarantor is not found
            return res.status(404).json({ message: 'Guarantor not found' });
        }

        await guarantor.destroy();
        console.log('Guarantor deleted successfully'); // Log success
        res.status(200).json({ message: 'Guarantor deleted successfully' });
    } catch (error) {
        console.error('Error deleting guarantor:', error); // Log the error
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ message: 'Guarantor is in use and cannot be deleted' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

async function getGurantorNICsuggestions(req, res) {
    try {
        const { query } = req.params;

        const guarantors = await Guarantor.findAll({
            where: {
                guarantorNic: {  // Changed to match model field name
                    [Op.like]: `%${query}%`
                }
            },
            limit: 10
        });

        res.status(200).json(guarantors);
    } catch (error) {
        console.error('Error fetching guarantor suggestions:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createGuarantor,
    getGurantorById,
    getAllGuarantors,
    getGurantorSuggestions,
    updateGuarantor,
    deleteGuarantor,
    getGurantorNICsuggestions
};