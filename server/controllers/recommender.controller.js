import { resolveKeyword } from "./tagResolver.controller.js";
import { getTopAlbumsForTag } from "./lastfm.controller.js";
import { scoreAlbum } from "./scorer.controller.js";
import { findAlbumOnSpotify } from "./spotify.controller.js";


export async function recommendAlbums(keywords) {

    const resolvedTagSets = await Promise.all(keywords.map(resolveKeyword));
    const tags = [...new Set(resolvedTagSets.flat())];

    const albumsByTag = await Promise.all(
        tags.map(async tag => ({ tag, albums: await getAlbumForTag(tag) }))
    );

    const ranked = scoreAlbum(albumsByTag);
    const shortenedList = ranked.slice(0, 20);

    const enriched = await Promise.all(
        shortlist.map(async album => {
            const spotifyData = await findAlbumOnSpotify(album.name, album.artist).catch(() => null);
            return { ...album, ...spotifyData };
        })
    );

    return enriched;
}

async function recommendAlbums_Sketch(keywords) {

    const rawKeywords = keywords.trim() || '';

    if (!rawKeywords || rawKeywords === '') {
        return res.status(400).json({ error: 'Keywords are required' });
    }

    const resolvedTagSets = await Promise.all(keywords.map(resolveKeyword));
    const tags = [...new Set(resolvedTagSets.flat())];

    const albumsByTag = await Promise.all(
        tags.map(async tag => ({ tag, albums: await getAlbumForTag(tag) }))
    );

    const ranked = scoreAlbum(albumsByTag);
    const shortenedList = ranked.slice(0, 20);

    const enriched = await Promise.all(
        shortlist.map(async album => {
            const spotifyData = await findAlbumOnSpotify(album.name, album.artist).catch(() => null);
            return { ...album, ...spotifyData };
        })
    );

    return enriched;
}