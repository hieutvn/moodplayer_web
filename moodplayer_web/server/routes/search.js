import express from 'express';
const router = express.Router();

import { APIService } from '../scripts/classes/APIService.js';
import { LinkedList } from '../scripts/classes/LinkedList.js';

// load mood/genre list for autocomplete suggestions
import genres from '../../client/src/assets/genres.json' with { type: 'json' };

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

    const accessToken = req.headers.access_token;
    const moods = req.headers.moods?.split(",") || [];

    if (!accessToken) { return res.status(400).json({ error: 'Missing token header' }); }
    if (!moods) { return res.status(400).json({ error: "No moods provided" }); }
    console.log(moods)

    const searchService = new APIService(accessToken);

    const moodsKeyWords = moods.map((m) => `${m}`).join(" ");
    console.log(moodsKeyWords)

    const type = "album";

    try {

        if (moodsKeyWords) {
            const request = await searchService.request(
                `v1/search?q=${encodeURIComponent(moodsKeyWords)}&type=${type}&limit=10`, "GET");

            if (!request) {
                return res.status(400).json({
                    message: "no data"
                });
            }
            console.log("search req", request)
            return res.status(200).json({ albums: request.albums.items });
        }

        return res.status(200).json({ message: "emtpy input" });

    }
    catch (error) {
        console.error("Error building recommendations", error);
        return res.status(500).json({ error: "Failed to build recommendations" });
    }
});


router.get("/getplaylist", async (req, res) => {

    const accessToken = req.headers.access_token;
    const moodsHeader = req.headers.moods;

    console.log("header", moodsHeader)

    if (!accessToken) { return res.status(400).json({ error: 'Missing token header' }); }
    if (!moodsHeader) { return res.status(400).json({ error: "No moods provided" }); }

    let moods;
    try {
        moods = JSON.parse(moodsHeader);
    } catch (e) {
        return res.status(400).json({ error: "Invalid moods format" });
    }
    if (!moods.length) { return res.status(400).json({ error: "No moods provided" }); }

    const searchService = new APIService(accessToken);

    const moodsKeyWords = moods.map((m) => `${m}`).join(" ");
    console.log(moodsKeyWords)

    const type = "album";

    //let sessionPlaylist = getSessionPlaylist(req);
    let sessionPlaylist = [];

    try {
        const request = await searchService.request(
            `v1/search?q=${encodeURIComponent(moodsKeyWords)}&type=${type}&limit=20`, "GET");

        if (!request) {
            return res.status(404).json({
                message: "no data found"
            });
        }

        console.log("search req", request)

        request.albums.items.map((album) => {

            if (album.album_type === "album" &&
                !sessionPlaylist.includes(album.id)) {

                console.log(album.album_type)
                sessionPlaylist.push(album.id)
            }

        })

        const shuffled = [...sessionPlaylist].sort(() => Math.random() - 0.5);
        const toEnqueue = shuffled.slice(0, 10);

        toEnqueue.forEach(element => {
            if (!sessionPlaylist.find((p) => p.id === element.id)) {
                sessionPlaylist.push(element);
            }
        });

        console.log(sessionPlaylist)

        return res.status(200).json({
            data: sessionPlaylist
        });

    } catch (error) {
        console.error("Error building recommendations", error);
        return res.status(500).json({ error: "Failed to build recommendations" });
    }

});


export default router;