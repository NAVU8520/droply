const prisma = require('../utils/prisma');
const { scrapeProduct } = require('../services/scraperService');

const addProduct = async (req, res) => {
    try {
        const { url, targetPrice } = req.body;
        const userId = req.user.userId; // Assumes auth middleware adds user to req

        // 1. Scrape product details
        const scrapedData = await scrapeProduct(url);

        // 2. Save to database
        const product = await prisma.product.create({
            data: {
                url,
                name: scrapedData.name,
                imageUrl: scrapedData.imageUrl,
                currentPrice: scrapedData.currentPrice,
                currency: scrapedData.currency,
                targetPrice: targetPrice ? parseFloat(targetPrice) : null,
                userId
            }
        });

        // 3. Create initial price history entry
        await prisma.priceHistory.create({
            data: {
                price: scrapedData.currentPrice,
                productId: product.id
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const products = await prisma.product.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Ensure user owns the product
        const product = await prisma.product.findFirst({
            where: { id, userId }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete related price history first (or use cascade delete in schema)
        await prisma.priceHistory.deleteMany({ where: { productId: id } });
        await prisma.product.delete({ where: { id } });

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

module.exports = { addProduct, getProducts, deleteProduct };
