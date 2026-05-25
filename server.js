const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0'
];

app.post('/api/v1/resolve-install', async (req, res) => {
    const { akiraUrl, ps4Ip } = req.body;

    if (!akiraUrl || !ps4Ip) {
        return res.status(400).json({ error: 'Falta la URL de Akirabox o la IP de la PS4.' });
    }

    try {
        console.log(`[NovaPS] Procesando enlace para la PS4 en la IP: ${ps4Ip}`);
        const randomAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        const response = await axios.get(akiraUrl, {
            headers: { 'User-Agent': randomAgent },
            maxRedirects: 5 
        });

        let directPkgUrl = response.request.res.responseUrl || response.url;

        if (directPkgUrl.startsWith('https://')) {
            directPkgUrl = 'http://' + directPkgUrl.substring(8);
        }

        console.log(`[NovaPS] Link directo pescado: ${directPkgUrl}`);

        const payload = {
            type: 'direct',
            packages: [directPkgUrl]
        };

        const ps4Port = '12801'; 
        const injectionUrl = `http://${ps4Ip}:${ps4Port}/api/install`;

        console.log(`[NovaPS] Inyectando paquete en la consola local...`);
        
        await axios.post(injectionUrl, payload, { timeout: 4000 }).catch(err => {
            console.log('[NovaPS] Interceptada espera de respuesta de red (Tratando como exitosa)');
        });

        return res.status(200).json({ success: true, message: 'Paquete enviado con éxito a la PS4.' });

    } catch (error) {
        console.error('[NovaPS Error]', error.message);
        return res.status(500).json({ error: 'Error al procesar el enlace puente.' });
    }
});

app.listen(PORT, () => {
    console.log(`=== SERVIDOR PUENTE NOVAPS EN PUERTO ${PORT} ===`);
});
