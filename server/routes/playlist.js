import express from 'express';

import { mixAndMatchPlaylist } from '../controllers/tagResolver.controller.js';
import { saveAlbums, getAlbums } from '../db/db.js';

const router = express.Router();

function getCurrentPlaylist(req) {
    if (!Array.isArray(req.session.currentPlaylist)) {
        req.session.currentPlaylist = [];
    }

    return req.session.currentPlaylist;
}



router.post('/createRecommendation', async (req, res) => {

    console.log("at recommend")

    let rawKeywords = JSON.parse(req.headers.keywords || '[]');

    if (rawKeywords.length === 0) { return res.status(400).json({ error: 'No keywords provided' }); }

    try {
        //req.session.currentPlaylist = await mixAndMatchPlaylist(rawKeywords);

        //.then((data) => console.log(data));
        const currentPlaylist = await mixAndMatchPlaylist(rawKeywords);

        //saveAlbums(currentPlaylist);

        // db.save(currentPlaylist)
        //const insertTags = 


    } catch (error) {
        console.error("Error creating playlist", error);
        return res.status(500).json({ error: "Failed to create playlist" });
    }

    res.status(200).json({
        playlist: req.session.currentPlaylist
    });
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
