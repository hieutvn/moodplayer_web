import { APIService } from "../scripts/classes/APIService.js";

async function findAlbumOnSpotify(token, artist, album) {
    const apiService = new APIService(token);

    const spotifyRequest = apiService.request(`v1/search?q=${encodeURIComponent(`album:${album} artist:${artist}`)}&type=album&limit=1`, "GET");
    const data = await spotifyRequest;

    const item = data.albums?.items?.[0];


    if (!item) return null;

    return {
        spotify_id: item.id,
        spotify_url: item.external_urls?.spotify,
        spotify_data: {
            image_url: item.images?.[0]?.url,
            featured_artists: item.artists.map((artist) => ({
                artist: artist.name,
                artist_id: artist.id,
            }))
        }
    };
}


export { findAlbumOnSpotify };