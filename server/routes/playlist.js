import express from 'express';

import {
    mergePlaylistMaps
} from '../controllers/tagResolver.controller.js';
import {
    saveUserSearch,
    saveAlbums,
    insertSearchResults,
    updateSpotifyData,
    getAlbumsFromSearchResults,
    getCurrentSessionId
} from '../db/db.js';

import { findAlbumOnSpotify } from '../controllers/spotify.controller.js';

const router = express.Router();

function getCurrentPlaylist(req) {
    if (!Array.isArray(req.session.currentPlaylist)) {
        req.session.currentPlaylist = [];
    }

    return req.session.currentPlaylist;
}



router.post('/createRecommendation', async (req, res) => {

    console.log("at recommend")
    const accessToken = req.cookies.access_token.access_token || null;
    let rawKeywords = JSON.parse(req.headers.keywords).sort() || '[]';
    let currentPlaylist = [];

    if (rawKeywords.length === 0) { return res.status(400).json({ error: 'No keywords provided' }); }

    try {
        const saveSearchId = saveUserSearch(rawKeywords);
        let position = 0;
        const mergingMaps = await mergePlaylistMaps(rawKeywords);

        for (const [key, value] of mergingMaps) {

            const saved = saveAlbums(key, value.album, value.external_ids);

            insertSearchResults(saveSearchId, saved.id, position++);


        };

        const savedAlbums = getAlbumsFromSearchResults(saveSearchId);

        for (const album of savedAlbums) {

            const spotifyData = await findAlbumOnSpotify(accessToken, album.artist, album.album_name);

            if (spotifyData) {

                updateSpotifyData(spotifyData.spotify_id, spotifyData.spotify_data, album.id);
            }
        }

        currentPlaylist = getCurrentSessionId(rawKeywords);


        res.status(200).json({
            playlist: currentPlaylist
        });
    } catch (error) {
        console.error("Error creating playlist", error);
        return res.status(500).json({ error: "Failed to create playlist" });
    }
});

router.post("/register-player/", (req, res) => {

    const { deviceId } = req.body;

    console.log("logging ID", deviceId)

    res.status(200);
});

router.post("/play-next", (req, res) => {

    const currentPlaylist = getCurrentPlaylist(req);
    console.log("Playing next song!", currentPlaylist)
    res.status(200).json({ playlist: currentPlaylist });
});


router.get("/play-prev", (req, res) => {

    console.log("get playlist", getCurrentPlaylist(req));
    res.status(200).json({ playlist: "ok" });
});





export default router;
