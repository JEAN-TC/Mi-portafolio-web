import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
// Usaremos google.com solo para engañar a Spotify y que no arroje advertencias de seguridad
const REDIRECT_URI = 'https://google.com/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Error: SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET deben estar en el archivo .env');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n======================================================');
console.log('🎵 SPOTIFY AUTH SCRIPT (MODO SEGURO HTTPS) 🎵');
console.log('======================================================\n');
console.log('PASO 1: Ve a tu Spotify Developer Dashboard y agrega exactamente esta URL en los Redirect URIs:');
console.log('\x1b[36m%s\x1b[0m', `  ${REDIRECT_URI}`);
console.log('(Como es HTTPS, Spotify no se quejará). ¡Asegúrate de guardar los cambios en Spotify!\n');

console.log('PASO 2: Haz CLIC (o Ctrl+Clic) en el siguiente enlace para autorizar tu cuenta:');
const scope = 'user-read-currently-playing user-read-playback-state';
const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
console.log('\x1b[32m%s\x1b[0m', `  ${authUrl}\n`);

console.log('PASO 3: Después de aceptar en Spotify, serás redirigido a la página de Google.');
console.log('Copía la URL COMPLETA que aparece en la barra de direcciones de tu navegador (que empieza con https://google.com/callback?code=...)');

rl.question('\n👉 Pega la URL COMPLETA aquí y presiona Enter: ', async (urlInput) => {
  try {
    const url = new URL(urlInput.trim());
    const code = url.searchParams.get('code');

    if (!code) {
      console.error('❌ Error: No se encontró ningún "code" en la URL proporcionada.');
      process.exit(1);
    }

    console.log('\nObteniendo Refresh Token...');

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
      console.log('Refresh Token:', data.refresh_token);

      // Guardar en el .env
      let envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('SPOTIFY_REFRESH_TOKEN=')) {
        envContent = envContent.replace(/SPOTIFY_REFRESH_TOKEN=.*/, `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
      } else {
        envContent += `\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`;
      }
      fs.writeFileSync(envPath, envContent);

      console.log('\n📝 Se ha guardado automáticamente en tu archivo .env');
    } else {
      console.error('❌ Error al obtener token:', data);
    }

  } catch (error) {
    console.error('❌ Error procesando la URL. Asegúrate de pegar la URL completa.');
  }
  
  rl.close();
});
