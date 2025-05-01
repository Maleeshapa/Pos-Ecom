const EcomStock = require("../model/EcomStock");
const Product = require("../model/Products");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");


const createEcomStock = async (req, res) => {
    const { productId, stockQTY, stockDate } = req.body;

    if (!productId || !stockQTY) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const newStock = await EcomStock.create({
            productId,
            stockQTY,
            stockDate,
        });

        res.status(201).json({
            message: "Stock created successfully",
            stock: newStock
        });
    } catch (error) {
        console.error("Error creating Stock:", error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
};


const getEcomStock = async (req, res) => {
    try {

        const ecomStock = await EcomStock.findAll({
            include: [
                {
                    model: Product,
                    as: "product",
                },
            ],
        });
        res.status(200).json(ecomStock);
    } catch (error) {
        console.error("Error fetching Stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteStock=async(req,res)=>{
    try {
        const {ecomstockId}=req.params;
        const ecomStock=await EcomStock.findByPk(ecomstockId);
        if(!ecomStock){
            return res.status(404).json({message:"Stock not found"});
        }
        await ecomStock.destroy();
        res.status(200).json({message:"Stock deleted successfully"});
    } catch (error) {
        console.error("Error deleting Stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateStock=async(req,res)=>{
    try {
        const { ecomstockId } = req.params;
        const { stockQTY, stockPrice } = req.body;
        const ecomStock = await EcomStock.findByPk(ecomstockId);
        if (!ecomStock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        ecomStock.stockQTY = stockQTY;
        await ecomStock.save();
        res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
        console.error("Error updating Stock:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports={ createEcomStock,getEcomStock,deleteStock,updateStock};