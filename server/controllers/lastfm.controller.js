import dotenv from 'dotenv';

dotenv.config();

const LASTFM_KEY = process.env.LASTFM_KEY;
const LASTFM_BASE_URL = process.env.LASTFM_BASE_URL;


export async function lastFmRequest(method, params = {}) {

    try {

        const queryParams = new URLSearchParams({
            method,
            api_key: LASTFM_KEY,
            format: 'json',
            ...params,
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
        console.error(`Last.fm request failed [${method}]:`, error.message);
        throw error;
    }

}

export async function getTopAlbumsForTag(tag, limit = 50, page = 1) {

    const data = await lastFmRequest("tag.getTopAlbums", { tag, limit, page });
    const tags = data.albums?.albums || [];

    return Array.isArray(tags) ? tags : [tags];
}

export async function searchTags(query, limit = 10) {
    const data = await lastfmRequest('tag.search', { tag: query, limit });
    const tags = data.results?.tagmatches?.tag || [];
    return Array.isArray(tags) ? tags : [tags];
}

export async function getSimilarTags(tag) {
    const data = await lastfmRequest('tag.getSimilar', { tag });
    const tags = data.similartags?.tag || [];
    return Array.isArray(tags) ? tags : [tags];
}

export async function getAlbumInfo(artist, album) {
    const data = await lastfmRequest('album.getInfo', { artist, album });
    return data.album || null;
}
