const spotifyFetch = globalThis.fetch;

const responseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

type SpotifyFailure = {
  code: string;
  message: string;
  spotifyStatus: number;
};

const jsonResponse = (body: unknown, status = 200) => new Response(
  JSON.stringify(body),
  { status, headers: responseHeaders }
);

const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const describeSpotifyFailure = async (response: Response): Promise<SpotifyFailure> => {
  const payload = await readJson(response);
  const spotifyMessage = payload?.error?.message || payload?.error_description || '';

  if (spotifyMessage.toLowerCase().includes('invalid client')) {
    return {
      code: 'spotify_client_invalid',
      message: 'Spotify rechazó el Client ID o Client Secret. Actualiza las credenciales de esta app en Netlify.',
      spotifyStatus: response.status
    };
  }

  if (response.status === 401) {
    return {
      code: 'spotify_authorization_expired',
      message: 'La autorización de Spotify necesita renovarse.',
      spotifyStatus: response.status
    };
  }

  if (response.status === 403) {
    return {
      code: 'spotify_access_restricted',
      message: 'Spotify restringió el acceso. Revisa que la cuenta propietaria de la app tenga Premium y que el usuario esté autorizado.',
      spotifyStatus: response.status
    };
  }

  if (response.status === 429) {
    return {
      code: 'spotify_rate_limited',
      message: 'Spotify limitó temporalmente las consultas. Vuelve a intentarlo en unos minutos.',
      spotifyStatus: response.status
    };
  }

  return {
    code: 'spotify_unavailable',
    message: spotifyMessage || 'Spotify no respondió correctamente.',
    spotifyStatus: response.status
  };
};

export default async (request: Request) => {
  if (request.method !== 'GET') {
    return jsonResponse({
      error: {
        code: 'method_not_allowed',
        message: 'Esta integración solo permite consultar el estado de reproducción.'
      }
    }, 405);
  }

  const {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN
  } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return jsonResponse({
      available: false,
      is_playing: false,
      error: {
        code: 'spotify_configuration_missing',
        message: 'La integración de Spotify no está configurada.'
      }
    }, 503);
  }

  try {
    const basicAuth = Buffer
      .from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
      .toString('base64');

    const tokenResponse = await spotifyFetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + basicAuth,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN
      })
    });

    if (!tokenResponse.ok) {
      const failure = await describeSpotifyFailure(tokenResponse);
      return jsonResponse({
        available: false,
        is_playing: false,
        error: failure
      }, 502);
    }

    const tokenData = await tokenResponse.json();
    const playingResponse = await spotifyFetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: 'Bearer ' + tokenData.access_token } }
    );

    if (playingResponse.status === 204 || playingResponse.status === 404) {
      return jsonResponse({ available: true, is_playing: false });
    }

    if (!playingResponse.ok) {
      const failure = await describeSpotifyFailure(playingResponse);
      return jsonResponse({
        available: false,
        is_playing: false,
        error: failure
      }, playingResponse.status === 429 ? 429 : 200);
    }

    const playingData = await playingResponse.json();

    return jsonResponse({
      available: true,
      is_playing: playingData.is_playing,
      progress_ms: playingData.progress_ms,
      item: playingData.item ? {
        id: playingData.item.id,
        name: playingData.item.name,
        duration_ms: playingData.item.duration_ms,
        uri: playingData.item.uri,
        external_url: playingData.item.external_urls?.spotify || null,
        artists: playingData.item.artists?.map((artist: { name: string }) => ({
          name: artist.name
        })),
        album: playingData.item.album ? {
          name: playingData.item.album.name,
          images: playingData.item.album.images
        } : null
      } : null
    });
  } catch {
    return jsonResponse({
      available: false,
      is_playing: false,
      error: {
        code: 'spotify_network_error',
        message: 'No se pudo consultar Spotify en este momento.'
      }
    }, 503);
  }
};
