const Driver = require('../model/Driver');
const { Op } = require('sequelize');

// Create a new driver
const createDriver = async (req, res) => {
    try {
        const { driverName, driverAge, driverAddress, driverPhone, driverStatus, driverNic, driverLicence, productId } = req.body;
        const newDriver = await Driver.create({
            driverName,
            driverAge,
            driverAddress,
            driverPhone,
            driverStatus,
            driverNic,
            driverLicence,
            productId
        });
        res.status(201).json(newDriver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get driver by ID
const getDriverById = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findByPk(id);
        if (driver) {
            res.status(200).json(driver);
        } else {
            res.status(404).json({ message: 'Driver not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all drivers
const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.findAll();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get driver suggestions based on name
const getDriverSuggestions = async (req, res) => {
    try {
        const { name } = req.params;
        const drivers = await Driver.findAll({
            where: {
                driverName: {
                    [Op.like]: name + '%'
                }
            }
        });
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update driver details
const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverName, driverAge, driverAddress, driverPhone, driverStatus, driverNic, driverLicence, productId } = req.body;
        const driver = await Driver.findByPk(id);
        if (driver) {
            driver.driverName = driverName;
            driver.driverAge = driverAge;
            driver.driverAddress = driverAddress;
            driver.driverPhone = driverPhone;
            driver.driverStatus = driverStatus;
            driver.driverNic = driverNic;
            driver.driverLicence = driverLicence;
            driver.productId = productId;
            await driver.save();
            res.status(200).json(driver);
        } else {
            res.status(404).json({ message: 'Driver not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete driver
const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findByPk(id);
        if (driver) {
            await driver.destroy();
            res.status(200).json({ message: 'Driver deleted successfully' });
        } else {
            res.status(404).json({ message: 'Driver not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get driver suggestions based on NIC
const getDriverNICSuggestions = async (req, res) => {
    try {
        const { query } = req.params;
        const drivers = await Driver.findAll({
            where: {
                driverNic: {
                    [Op.like]: `%${query}%`
                }
            },
            limit: 10
        });
        res.status(200).json(drivers);
    } catch (error) {
        console.error('Error fetching driver suggestions:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createDriver,
    getDriverById,
    getAllDrivers,
    getDriverSuggestions,
    updateDriver,
    deleteDriver,
    getDriverNICSuggestions
};
