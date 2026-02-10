import express, { urlencoded } from 'express';
const router = express.Router();

import { APIService } from '../scripts/classes/APIService.js';
import { LinkedList } from '../scripts/classes/LinkedList.js';

// Store playlist per-session instead of a single global array
function getSessionPlaylist(req) {
    if (!req.session.currentPlaylist || req.session.currentPlaylist.length < 1) {
        req.session.currentPlaylist = [];
    }

    return req.session.currentPlaylist;
}

router.get("/", (req, res) => {

    console.log("Getting array");
    res.json({ message: "ok" })
    //res.json({ moodsArray });
});

router.get("/url", async (req, res) => {

    console.log("on url")

    const accessToken = req.headers.token;
    if (!accessToken) return res.status(400).json({ error: 'Missing token header' });

    const moods = req.headers.moods?.split(",") || [];

    if (!moods.length) {
        return res.status(400).json({ error: "No moods provided" });
    }

    const moodsKeyWords = moods.map((m) => `${m}`).join();
    const type = req.query.type || "album";

    const searchService = new APIService(accessToken);

    try {
        const request = await searchService.request(
            `v1/search?q=genre=${encodeURIComponent(moodsKeyWords)}&type=${type}&limit=20`, "GET");

        const albums = request.albums?.items || [];

        if (!albums.length) {

            return res.status(200).json({
                data: "no data"
            });
        }

        let sessionPlaylist = getSessionPlaylist(req);
        let queuedPlaylist = [];

        // Shuffle albums and take a subset to enqueue
        const shuffled = [...albums].sort(() => Math.random() - 0.5);
        const toEnqueue = shuffled.slice(0, 10);

        toEnqueue.forEach(element => {
            if (!sessionPlaylist.find((p) => p.id === element.id)) {
                sessionPlaylist.push(element);
            }
        });

        // Safely attach playlist to the session if session support is enabled
        /*         if (req.session) {
                    req.session.currentPlaylist = sessionPlaylist;
                } */
        if (sessionPlaylist.length > 1)
            console.log("current Session playlist", sessionPlaylist.length)

        return res.status(200).json({
            message: "playlist created"
        });
    }
    catch (error) {
        console.error("Error building recommendations", error);
        return res.status(500).json({ error: "Failed to build recommendations" });
    }
});


router.get("/getplaylist", (req, res) => {

    const sessionPlaylist = getSessionPlaylist(req);

    return res.status(200).json({
        playlist: sessionPlaylist
    })

});


export default router;


/*
    DB - Besitzt genren ---> Server sucht in DB nach Genren von User 
    Server sucht nach  
    
*/