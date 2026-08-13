import express from 'express';

import { resolveKeywords } from '../controllers/tagResolver.controller.js';
import { scoreAlbum } from '../controllers/scorer.controller.js';
import findAlbumOnSpotify from '../controllers/spotify.controller.js';

import {

    lastFmRequest,
    getTopAlbumsForTag,
    searchTags,
    getSimilarTags,
    getAlbumInfo,
} from '../controllers/lastfm.controller.js';

const router = express.Router();

router.get('/createRecommendation', async (req, res) => {

    console.log("at recommend")
    const rawKeywords = req.query.keywords || '';

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
            return res.json({ albums: [], message: 'No albums found for these keywords' });
        }

        const shortenedList = rankedList.slice(0, 20);

        /*         const enriched = await Promise.all(
                    shortenedList.map(async (album) => {
        
                        if (album.spotify_url && album.image_url) { return album; }
        
                        const spotifyData = await findAlbumOnSpotify(album.name, album.artist).catch(() => null);
                        return spotifyData ? { ...album, ...spotifyData } : album;
        
                    })
                ); */

        res.status(200).json({
            keywords,
            list: shortenedList,
        });

    } catch (error) {
        console.error('Recommend route failed:', err.message);
        res.status(502).json({ error: 'Failed to fetch recommendations', details: err.message });
    }

});

router.get('/lastfm', async (req, res) => {

    console.log("at lastfm", req.headers.message)

    try {

        const lastFmReq = await getTopAlbumsForTag("rap")

        console.log("req data", lastFmReq)

        res.status(200).json({
            message: "ok"
        })

    } catch (error) {

        console.log("LAST FM ERROR", error)
    }

});




export default router;