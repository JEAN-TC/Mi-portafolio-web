import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:8888/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Error: Por favor, asegúrate de que SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET están definidos en tu archivo .env');
  process.exit(1);
}

const app = express();
const PORT = 8888;

app.get('/login', (req, res) => {
  const scope = 'user-read-currently-playing user-read-playback-state';
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send('Error: No se recibió ningún código de autorización.');
  }

  try {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (data.refresh_token) {
      console.log('\n✅ ¡ÉXITO! Se obtuvo el Refresh Token.');
      console.log('----------------------------------------------------');
      console.log('Refresh Token:', data.refresh_token);
      console.log('----------------------------------------------------\n');

      // Guardar en el .env
      let envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('SPOTIFY_REFRESH_TOKEN=')) {
        envContent = envContent.replace(/SPOTIFY_REFRESH_TOKEN=.*/, `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
      } else {
        envContent += `\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`;
      }
      fs.writeFileSync(envPath, envContent);

      console.log('📝 Se ha guardado automáticamente en tu archivo .env');
      console.log('Ya puedes cerrar esta ventana de la terminal (Ctrl+C).\n');

      res.send('<h1>¡Todo listo!</h1><p>El Refresh Token se ha obtenido y guardado con éxito. Ya puedes cerrar esta pestaña y volver al editor.</p>');
      
      setTimeout(() => process.exit(0), 1000);
    } else {
      res.send(`<h1>Error al obtener token</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
    }

  } catch (error) {
    console.error(error);
    res.send('Error interno');
  }
});

app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log('🎵 SPOTIFY AUTH SCRIPT 🎵');
  console.log('======================================================\n');
  console.log('1. Asegúrate de haber agregado esta URL exacta a los "Redirect URIs" de tu App en Spotify Developer:');
  console.log('   http://localhost:8888/callback\n');
  console.log('2. Haz CLIC (o Ctrl+Clic) en el siguiente enlace para autorizar tu cuenta:');
  console.log(`   http://localhost:${PORT}/login\n`);
});
