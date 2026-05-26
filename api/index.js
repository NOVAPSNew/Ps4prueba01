// api/index.js (Para Vercel)
import axios from 'axios';

export default async function handler(req, res) {
  // Permitir que tu web de Infinity use el puente sin bloqueos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pescamos el link de Akirabox que mandó tu web
  const { url: akiraUrl } = req.query;

  if (!akiraUrl) {
    return res.status(400).json({ error: "Falta el parámetro 'url'" });
  }

  try {
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    
    // Vercel va a Akirabox fingiendo ser una PC
    const response = await axios.get(akiraUrl, {
      headers: { 'User-Agent': userAgent },
      maxRedirects: 5
    });

    let directPkgUrl = response.request.res.responseUrl || response.url;

    // Lo convertimos a HTTP plano para la PS4
    if (directPkgUrl.startsWith("https://")) {
      directPkgUrl = "http://" + directPkgUrl.substring(8);
    }

    // Le devolvemos el enlace limpio a tu página de Infinity
    return res.status(200).json({ directUrl: directPkgUrl });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
