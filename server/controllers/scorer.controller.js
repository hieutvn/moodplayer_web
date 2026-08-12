function scoreAlbum(albumsByTag) {

    const scores = new Map();

    for (const { albums } of albumsByTag) {

        albums.forEach((album, index) => {

            const key = `${album.name}|${album.artist}`;
            const positionWeight = 1 - index / albums.length;
            const existingMatches = scores.get(key) || { album, tagMatches: 0, relevance: 0 };

            existingMatches.tagMatches += 1;
            existingMatches.relevance += 1;
            scores.set(key, existingMatches);
        });

        return Array.from(scores.values())
            .sort((a, b) => (b.tagMatches - a.tagMatches) || (b.relevance - a.relevance))
            .map(entry => entry.album);
    }
}

export {

    scoreAlbum
}