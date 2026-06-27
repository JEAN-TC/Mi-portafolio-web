/**
 * Spotify OAuth 2.0 PKCE Flow Utilities
 * Este módulo gestiona la autenticación segura sin backend (PKCE)
 * y la comunicación con la API de Spotify.
 */

// Generar una cadena aleatoria segura para el Code Verifier
export function generateCodeVerifier(length = 64): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// Convertir un buffer en SHA-256 en formato Base64 URL-safe
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Iniciar redirección de autorización de Spotify
export async function redirectToSpotifyAuth(clientId: string, redirectUri: string) {
  const verifier = generateCodeVerifier();
  localStorage.setItem('spotify_code_verifier', verifier);

  const challenge = await generateCodeChallenge(verifier);

  const scope = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-library-read'
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Obtener el token de acceso usando el código de autorización y el verifier
export async function getSpotifyToken(
  clientId: string,
  code: string,
  redirectUri: string,
  codeVerifier: string
): Promise<any> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al intercambiar el código por el token de Spotify');
  }

  return response.json();
}

// Refrescar el token de acceso expirado
export async function refreshSpotifyToken(clientId: string, refreshToken: string): Promise<any> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al refrescar el token de Spotify');
  }

  return response.json();
}

// Interfaz para la API de Spotify
export class SpotifyAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // Obtener perfil del usuario autenticado
  async getUserProfile() {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Error al obtener perfil');
    return res.json();
  }

  // Obtener canción actual en reproducción
  async getCurrentlyPlaying() {
    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: this.getHeaders()
    });
    if (res.status === 204 || res.status === 404) {
      return null;
    }
    if (!res.ok) throw new Error('Error al obtener reproducción actual');
    return res.json();
  }

  // Buscar canciones
  async searchTracks(query: string, limit = 5) {
    if (!query.trim()) return [];
    const params = new URLSearchParams({
      q: query,
      type: 'track',
      limit: limit.toString()
    });
    const res = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Error al buscar canciones');
    const data = await res.json();
    return data.tracks?.items || [];
  }

  // Intentar reproducir una canción en el dispositivo activo
  async playTrack(trackUri: string) {
    const res = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        uris: [trackUri]
      })
    });
    if (res.status === 404) {
      throw new Error('No se encontró ningún dispositivo activo en tu cuenta de Spotify. Abre Spotify en tu móvil o PC e inténtalo de nuevo.');
    }
    if (res.status === 403) {
      throw new Error('Esta acción requiere una cuenta de Spotify Premium.');
    }
    if (!res.ok) {
      throw new Error('Error al reproducir canción');
    }
    return true;
  }

  // Pausar reproducción en el dispositivo activo
  async pause() {
    await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: this.getHeaders()
    });
  }

  // Reanudar reproducción en el dispositivo activo
  async resume() {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: this.getHeaders()
    });
  }

  // Saltar a la siguiente canción
  async next() {
    await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  // Volver a la canción anterior
  async previous() {
    await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: this.getHeaders()
    });
  }
}
