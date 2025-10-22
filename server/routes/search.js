import express from 'express';
const router = express.Router();

import { APIService } from '../scripts/classes/APIService.js';


router.get("/", (req, res) => {

    console.log("Getting array");
    const moodsArray = [
        "hip-hop",
        "pop",
        "moody",
        "dance/electronic",
        "charts",
        "rock",
        "skate noise",
        "chillout",
        "daily drive",
        "fresh finds",
        "equal",
        "schlager",
        "mixed by",
        "fitness",
        "k-pop",
        "sleeping",
        "party",
        "at home",
        "ambient",
        "rnb",
        "love",
        "kids & family",
        "soccer",
        "metal",
        "classic",
        "jazz",
        "folk & acustic",
        "country",
        "disney",
        "nature & white noise",
        "soul",
        "gaming",
        "glow",
        "tv & films",
        "netflix",
        "instrumental",
        "wellness",
        "blues",
        "cooking",
        "alternative",
        "travel",
        "reggae",
        "caribics",
        "afro",
        "funk"
    ];

    res.json({ moodsArray });
});

router.get("/url", async (req, res) => {

    const accessToken = req.headers.token;
    if (!accessToken) return res.status(400).json({ error: 'Missing token header' });

    const moods = (req.headers.moods).split(" ");
    if (!moods) return res.status(400).json({ error: 'Missing moods header' });

    const searchService = new APIService(accessToken);
    const request = await searchService.request(`v1/search/q=${encodeURIComponent()}`, "GET");
});


export default router;