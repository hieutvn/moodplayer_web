import express, { urlencoded } from 'express';
const router = express.Router();

import { APIService } from '../scripts/classes/APIService.js';
import { LinkedList } from '../scripts/classes/LinkedList.js';

let currentPlaylist = [];

router.get("/", (req, res) => {

    console.log("Getting array");
    res.json({ message: "ok" })
    //res.json({ moodsArray });
});

router.get("/url", async (req, res) => {

    console.log("on url")
    //console.log("PLAY ON URL", currentPlaylist)

    const accessToken = req.headers.token;
    if (!accessToken) return res.status(400).json({ error: 'Missing token header' });

    const moods = req.headers.moods.split(",");
    const moodsKeyWords = moods.map((m) => `${m}`).join(" ");
    //const input = req.query.input;
    const type = req.query.type;

    const searchService = new APIService(accessToken);
    let request = await searchService.request(`v1/search?q=genre=${encodeURIComponent(moodsKeyWords)}&type=${type}&limit=5`, "GET");


    if (!request.albums?.items) {

        return res.status(200).json({
            data: "no data"
        });
    }

    request.albums.items.forEach(element => {

        if (!currentPlaylist.includes(element)) {

            currentPlaylist.push(element)

        }
    });

    return res.status(200).json({
        data: "data received, playlist created"
    });
});


router.get("/getplaylist", (req, res) => {

    //console.log("PLAY ON GET", currentPlaylist)
    //const result = [...currentPlaylist];
    let result = [];

    currentPlaylist.forEach((element) => {

        if (!result.includes(element)) { result.push(element); }
        currentPlaylist.pop(element);
    });

    currentPlaylist = [];

    //console.log(result)
    if (result.length === 0) { return res.status(400).json({ error: "no albums set." }); }

    return res.status(200).json({ playlist: result });
});


export default router; 