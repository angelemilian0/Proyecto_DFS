const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/clima', async (req, res) => {
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Ciudad&appid=TU_API_KEY');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener datos de la API externa' });
    }
});

module.exports = router;
