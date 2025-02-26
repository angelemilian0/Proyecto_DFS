const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/clima', async (req, res) => {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: 'Mexico City',
                appid: process.env.OPENWEATHER_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;