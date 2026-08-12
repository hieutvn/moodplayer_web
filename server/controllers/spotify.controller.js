// MOVE ALL SPOTIFY REQ TO HERE???


export default async function findAlbumOnSpotify(token, name, artist) {
    const res = await axios.get('https://api.spotify.com/v1/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: `album:${name} artist:${artist}`, type: 'album', limit: 1 },
    });

    const item = res.data.albums?.items?.[0];
    if (!item) return null;

    return {
        spotify_url: item.external_urls?.spotify,
        image_url: item.images?.[0]?.url,
    };
}