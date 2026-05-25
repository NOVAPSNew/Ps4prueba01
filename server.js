const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
];

// RUTA DE TEST: Solo limpia el link y te lo devuelve para que tu móvil lo descargue
app.get('/api/v1/test-download', async (req, res) => {
    // Usamos el enlace de Akirabox que me pasaste directo en el código para la prueba
    const akiraUrl = "https://akirabox.to/vgKGxY80Vm8Q/file";

    try {
        console.log(`[NovaPS Test] Intentando pescar link de Akirabox...`);
        const randomAgent = userAgents[0];

        const response = await axios.get(akiraUrl, {
            headers: { 'User-Agent': randomAgent },
            maxRedirects: 5 
        });

        // Extraemos la URL directa final (.pkg)
        let directPkgUrl = response.request.res.responseUrl || response.url;

        console.log(`[NovaPS Test] ¡Éxito! Redirigiendo móvil a: ${directPkgUrl}`);

        // REGLA CLAVE: En lugar de inyectar a la PS4, redirigimos tu navegador móvil al archivo real
        // Esto obligará a tu teléfono a iniciar la descarga del .pkg de inmediato
        return res.redirect(directPkgUrl);

    } catch (error) {
        console.error('[NovaPS Test Error]', error.message);
        return res.status(500).send('Error al minar el enlace en Render: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`=== MODO PRUEBA MÓVIL ACTIVO EN PUERTO ${PORT} ===`);
});
