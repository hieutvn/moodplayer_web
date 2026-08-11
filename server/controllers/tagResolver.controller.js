import {
    getTopAlbumsForTag,
    searchTags,
    getSimilarTags,
    getAlbumInfo,
} from "./lastfm.controller";

export async function resolveKeywords(keyword) {

    const kw = keyword.trim().toLowerCase();

    const matches = await searchTags(kw, 5);
    const directMatches = matches.find(tag => tag.name.toLowerCase() === kw);

    if (directMatches) {
        return [directMatches.name];
    }

    if (matches.length > 0) {
        return matches.slice(0, 3).map(tag => tag.name);
    }

    return [kw];
}