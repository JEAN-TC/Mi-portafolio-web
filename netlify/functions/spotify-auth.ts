const SPOTIFY_SCOPE = 'user-read-currently-playing user-read-playback-state';
const STATE_COOKIE = 'spotify_oauth_state';
const TOKEN_COOKIE = STATE_COOKIE + '=; Path=/api/spotify; Max-Age=0; HttpOnly; SameSite=Lax';

const noStoreHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff'
};

type SpotifyConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const readCookie = (request: Request, name: string) => {
  const cookie = request.headers.get('cookie') || '';
  const entry = cookie
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(name + '='));

  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : '';
};

const getSpotifyConfig = (): SpotifyConfig | null => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) return null;

  return { clientId, clientSecret, redirectUri };
};

const page = (title: string, content: string, status = 200) => new Response(
  `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${escapeHtml(title)} · Spotify</title>
      <style>
        :root { color-scheme: dark; font-family: Inter, system-ui, sans-serif; }
        body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #09090c; color: #f4f4f5; }
        main { width: min(34rem, calc(100% - 2rem)); padding: 2rem; border: 1px solid #282830; border-radius: 16px; background: #111116; box-shadow: 0 18px 48px rgba(0, 0, 0, .35); }
        h1 { margin: 0; font-size: 1.45rem; }
        p { color: #b3b3bd; line-height: 1.6; }
        code, textarea { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        code { color: #ff7878; }
        textarea { width: 100%; min-height: 7rem; box-sizing: border-box; padding: .8rem; border: 1px solid #34343d; border-radius: 10px; background: #09090c; color: #f4f4f5; resize: vertical; }
        a { color: #ff7878; }
      </style>
    </head>
    <body><main>${content}</main></body>
  </html>`,
  {
    status,
    headers: { ...noStoreHeaders, 'Content-Type': 'text/html; charset=utf-8' }
  }
);

const setupError = () => page(
  'Falta configurar Spotify',
  '<h1>Falta una configuración</h1><p>Agrega <code>SPOTIFY_REDIRECT_URI</code> en Netlify con este valor:</p><p><code>https://jean-tc.netlify.app/api/spotify/callback</code></p><p>Después agrega esa misma URL en el campo Redirect URI de tu app de Spotify y vuelve a intentarlo.</p>',
  503
);

const startAuthorization = (request: Request, config: SpotifyConfig) => {
  const state = crypto.randomUUID().replaceAll('-', '');
  const authorizeUrl = new URL('https://accounts.spotify.com/authorize');

  authorizeUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: SPOTIFY_SCOPE,
    state
  }).toString();

  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';

  return new Response(null, {
    status: 302,
    headers: {
      ...noStoreHeaders,
      Location: authorizeUrl.toString(),
      'Set-Cookie': STATE_COOKIE + '=' + encodeURIComponent(state) +
        '; Path=/api/spotify; Max-Age=600; HttpOnly; SameSite=Lax' + secure
    }
  });
};

const completeAuthorization = async (request: Request, config: SpotifyConfig) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = readCookie(request, STATE_COOKIE);

  if (!code || !state || !expectedState || state !== expectedState) {
    const response = page(
      'Autorización no válida',
      '<h1>No se pudo validar el inicio de sesión</h1><p>Vuelve a tu portafolio e inicia el proceso otra vez. La autorización expira después de unos minutos.</p>',
      400
    );
    response.headers.set('Set-Cookie', TOKEN_COOKIE);
    return response;
  }

  const credentials = Buffer
    .from(config.clientId + ':' + config.clientSecret)
    .toString('base64');

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri
    })
  });

  const tokenData = await tokenResponse.json().catch(() => ({}));

  if (!tokenResponse.ok || !tokenData.refresh_token) {
    const message = typeof tokenData.error_description === 'string'
      ? tokenData.error_description
      : 'Spotify no devolvió un refresh token.';

    const response = page(
      'Spotify rechazó la autorización',
      '<h1>No se pudo completar la conexión</h1><p>' + escapeHtml(message) + '</p><p>Revisa el Client ID, Client Secret y Redirect URI de la misma app de Spotify.</p>',
      502
    );
    response.headers.set('Set-Cookie', TOKEN_COOKIE);
    return response;
  }

  const refreshToken = escapeHtml(String(tokenData.refresh_token));
  const response = page(
    'Spotify conectado',
    '<h1>Spotify quedó autorizado</h1><p>Copia este token y reemplaza <code>SPOTIFY_REFRESH_TOKEN</code> en Netlify. Trátalo como una contraseña: no lo compartas ni lo subas a GitHub.</p><textarea readonly spellcheck="false" aria-label="Nuevo refresh token">' +
      refreshToken +
      '</textarea><p>Luego publica un nuevo deploy y vuelve a tu portafolio.</p>'
  );
  response.headers.set('Set-Cookie', TOKEN_COOKIE);
  return response;
};

export default async (request: Request) => {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: noStoreHeaders
    });
  }

  const config = getSpotifyConfig();
  if (!config) return setupError();

  const path = new URL(request.url).pathname;

  if (path.endsWith('/login')) {
    return startAuthorization(request, config);
  }

  if (path.endsWith('/callback')) {
    return completeAuthorization(request, config);
  }

  return page(
    'Ruta no encontrada',
    '<h1>Ruta de Spotify no encontrada</h1><p>Vuelve al portafolio e inicia sesión desde el panel de Spotify.</p>',
    404
  );
};

export const config = {
  path: ['/api/spotify/login', '/api/spotify/callback']
};
