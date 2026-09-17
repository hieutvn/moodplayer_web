import dotenv from 'dotenv';

dotenv.config();

const LASTFM_KEY = process.env.LASTFM_API_KEY;
const LASTFM_BASE_URL = process.env.LASTFM_BASEURL;


async function lastFmRequest(endpoint, params = {}) {

    try {

        const queryParams = new URLSearchParams({
            method: endpoint,
            ...params,
            api_key: LASTFM_KEY.toString(),
            format: 'json',
        });

        const response = await fetch(`${LASTFM_BASE_URL}?${queryParams}`);

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(`Last.fm API error ${data.error}: ${data.message}`);
        }

        return data;

    } catch (error) {
        console.error(`Last.fm request failed [${endpoint}]:`, error.message);
        throw error;
    }

}

async function getTopAlbumsForTag(tag, limit = 5, page = 1) {

    const data = await lastFmRequest("tag.getTopAlbums", { tag, limit, page });
    const tags = data.albums?.album || [];

    return Array.isArray(tags) ? tags : [tags];
}

async function getTopAlbumsFromArtist(artist, autocorrect = 5, limit = 1, page = 1) {

    const request = await lastFmRequest("artist.getTopAlbums", { artist, autocorrect, limit, page });
    const album = request.topalbums?.album || [];

    return Array.isArray(album) ? album : [album];
}

async function getAlbumTags(artist, album, limit = 10, page = 1, autocorrect = 1) {

    const data = await lastFmRequest("album.getTags", { artist, album, limit, page, autocorrect });
    const tags = data.tag?.name || [];

    return Array.isArray(tags) ? tags : [tags];
}

async function getAlbumTopTags(artist, album, limit = 10, page = 1, autocorrect = 1) {

    const data = await lastFmRequest("album.getTopTags", { artist, album, limit, page, autocorrect });
    const tags = data.toptags?.tag || [];

    return Array.isArray(tags) ? tags : [tags];
}

async function searchTags(query, limit = 10) {
    const data = await lastFmRequest('tag.search', { tag: query, limit });
    const tags = data.results?.tagmatches?.tag || [];

    return Array.isArray(tags) ? tags : [tags];
}

async function getSimilarTags(tag, autocorrect = 1, limit = 5) {
    const data = await lastFmRequest('tag.getSimilar', { tag, autocorrect, limit });
    const tags = data.similartags?.tag || [];
    return Array.isArray(tags) ? tags : [tags];
}


async function getSimilarArtists(artist, autocorrect = 1, limit = 5) {
    const data = await lastFmRequest('artist.getSimilar', { artist, autocorrect, limit });
    const artists = data.similarartists?.artist || [];
    return Array.isArray(artists) ? artists : [artists];
}

async function getAlbumInfo(artist, album) {
    const data = await lastFmRequest('album.getInfo', { artist: artist, album: album });

    return data.album || null;
}


export {

    lastFmRequest,
    getTopAlbumsForTag,
    getTopAlbumsFromArtist,
    getAlbumTags,
    getAlbumTopTags,
    searchTags,
    getSimilarTags,
    getSimilarArtists,
    getAlbumInfo,
};