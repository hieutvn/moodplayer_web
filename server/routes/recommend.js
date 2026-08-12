import express from 'express';

import resolveKeyword from '../utils/tagResolver.controller.js';
import getAlbumForTag from '../utils/lastfm.controller.js';
import scoreAlbum from '../utils/scorer.controller.js';
import findAlbumOnSpotify from '../utils/spotify.controller.js';

const router = express.Router();

router.get('/api/recommend', async (req, res) => {

    const rawKeywords = req.query.keywords.trim() || '';

    if (!rawKeywords || rawKeywords === '') {
        return res.status(400).json({ error: 'Keywords are required' });
    }

    const keywords = rawKeywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword !== '');

    if (keywords.length === 0) {
        return res.status(400).json({ error: 'No valid keywords provided' });
    }

    try {

        const resolvedTags = await Promise.all(keywords.map(resolveKeyword));
        const uniqueTags = [...new Set(resolvedTags.flat())];

        if (tags.length === 0) {
            return res
                .status(404)
                .json({
                    albums: [],
                    error: 'No valid tags found for the provided keywords'
                });
        }

        const albums = await Promise.all(
            uniqueTags.map(async (tag) => ({
                tag,
                albums: await getAlbumForTag(tag)

            }))
        );

        const rankedList = scoreAlbum(albums);

        if (ranked.length === 0) {
            return res.json({ albums: [], searchId, message: 'No albums found for these keywords' });
        }

        const shortenedList = rankedList.slice(0, 20);

        const enriched = await Promise.all(
            shortenedList.map(async (album) => {

                if (album.spotify_url && album.image_url) { return album; }

                const spotifyData = await findAlbumOnSpotify(album.name, album.artist).catch(() => null);
                return spotifyData ? { ...album, ...spotifyData } : album;

            })
        );

        // --> return res.json({ albums: enriched, searchId: req.query.searchId || null });
    } catch (error) { }

});