const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Ruta para obtener el clima actual por ciudad
router.get('/:ciudad', async (req, res) => {
    try {
        const { ciudad } = req.params;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener datos del clima:', error);
        res.status(500).json({ error: 'No se pudo obtener el clima' });
    }
});

module.exports = router;
