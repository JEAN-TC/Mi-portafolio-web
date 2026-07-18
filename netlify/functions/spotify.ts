const fetch = globalThis.fetch;

export default async (req: Request) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return new Response(JSON.stringify({ error: 'Faltan variables' }), { status: 500, headers });
  }

  try {
    const url = new URL(req.url);
    const basicAuth = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    
    // 1. Obtener Token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basicAuth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN }),
    });

    if (!tokenResponse.ok) throw new Error('Error token');
    const { access_token } = await tokenResponse.json();

    // 2. Rutas
    if (url.pathname.endsWith('/action')) {
      const { action, uri } = await req.json();
      let spotifyUrl = '';
      let method = 'POST';
      let body: any = null;

      if (action === 'play') {
        spotifyUrl = 'https://api.spotify.com/v1/me/player/play';
        method = 'PUT';
        if (uri) body = JSON.stringify({ uris: [uri] });
      } else if (action === 'pause') {
        spotifyUrl = 'https://api.spotify.com/v1/me/player/pause';
        method = 'PUT';
      } else if (action === 'next') {
        spotifyUrl = 'https://api.spotify.com/v1/me/player/next';
      } else if (action === 'previous') {
        spotifyUrl = 'https://api.spotify.com/v1/me/player/previous';
      } else {
        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
      }

      await fetch(spotifyUrl, {
        method,
        headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body
      });

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    if (url.pathname.endsWith('/search')) {
      const q = url.searchParams.get('q');
      if (!q) return new Response(JSON.stringify({ tracks: { items: [] } }), { status: 200, headers });

      const searchRes = await fetch(`https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${access_token}` }
      });
      const data = await searchRes.json();
      return new Response(JSON.stringify(data), { status: 200, headers });
    }

    // Default: GET status
    const playingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${access_token}` },
    });

    if (playingResponse.status === 204 || playingResponse.status === 404) {
      return new Response(JSON.stringify({ is_playing: false }), { status: 200, headers });
    }
    if (!playingResponse.ok) throw new Error('Error playing');

    const playingData = await playingResponse.json();
    return new Response(JSON.stringify({
      is_playing: playingData.is_playing,
      progress_ms: playingData.progress_ms,
      item: playingData.item ? {
        id: playingData.item.id,
        name: playingData.item.name,
        duration_ms: playingData.item.duration_ms,
        uri: playingData.item.uri,
        artists: playingData.item.artists?.map((a: any) => ({ name: a.name, uri: a.uri })),
        album: playingData.item.album ? { name: playingData.item.album.name, images: playingData.item.album.images } : null,
      } : null,
    }), { status: 200, headers });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
};
