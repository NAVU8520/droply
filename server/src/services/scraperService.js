const axios = require('axios');
const cheerio = require('cheerio');

const scrapeProduct = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);

        // 1. Try to get title
        let name = $('meta[property="og:title"]').attr('content') ||
            $('h1').first().text().trim() ||
            $('title').text().trim();

        // 2. Try to get image
        let imageUrl = $('meta[property="og:image"]').attr('content') ||
            $('img').first().attr('src');

        // 3. Try to get price (This is the tricky part for a generic scraper)
        // We look for common patterns or structured data
        let price = null;
        let currency = 'USD';

        // Strategy A: OpenGraph / Schema.org
        const ogPrice = $('meta[property="product:price:amount"]').attr('content') ||
            $('meta[property="og:price:amount"]').attr('content');

        const ogCurrency = $('meta[property="product:price:currency"]').attr('content') ||
            $('meta[property="og:price:currency"]').attr('content');

        if (ogPrice) {
            price = parseFloat(ogPrice);
            if (ogCurrency) currency = ogCurrency;
        } else {
            // Strategy B: Regex search in visible text for price patterns (e.g., $10.99)
            // This is risky and can pick up wrong numbers, but better than nothing for a demo
            // A better approach is to have site-specific selectors.
            // For now, we will return null if not found in metadata.
        }

        return {
            name: name || 'Unknown Product',
            currentPrice: price || 0, // 0 indicates we couldn't find the price
            imageUrl: imageUrl || '',
            currency
        };

    } catch (error) {
        console.error('Scraping error:', error.message);
        throw new Error('Failed to scrape product');
    }
};

module.exports = { scrapeProduct };
