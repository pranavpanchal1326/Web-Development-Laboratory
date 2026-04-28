// server.js - Upgraded Version

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
const PORT = 3000;

// Initialize a cache. Data will be stored for 10 minutes (600 seconds).
// This prevents us from hitting the NewsAPI rate limit on every refresh.
const newsCache = new NodeCache({ stdTTL: 600 });

app.use(cors());
app.use(express.static('frontend'));

// A helper function to make API requests with caching
async function getNews(apiUrl, cacheKey) {
    if (newsCache.has(cacheKey)) {
        console.log(`Serving '${cacheKey}' from cache`);
        return newsCache.get(cacheKey); // Serve from cache if available
    } else {
        console.log(`Fetching '${cacheKey}' from API`);
        const response = await axios.get(apiUrl);
        newsCache.set(cacheKey, response.data); // Store the new data in the cache
        return response.data;
    }
}

// === UPGRADED API ENDPOINTS ===

// Endpoint for top headlines (now with caching)
app.get('/api/top-headlines', async (req, res) => {
    try {
        const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`;
        const data = await getNews(url, 'top-headlines');
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top headlines', details: error.message });
    }
});

// NEW: Dynamic endpoint for categories
app.get('/api/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const url = `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
        const data = await getNews(url, `category-${category}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category news', details: error.message });
    }
});


// Endpoint for search (now with caching)
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}`;
        const data = await getNews(url, `search-${query}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching search results', details: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Upgraded server is running at http://localhost:${PORT}`);
    console.log(`Pimpri-Chinchwad is ready for the upgraded news!`);
});