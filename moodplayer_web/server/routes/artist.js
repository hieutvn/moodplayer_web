import express from 'express';
const router = express.Router();

import { APIService } from '../scripts/classes/APIService.js';


router.get("/getartist", async (req, res) => {
    try {

        const accessToken = req.headers.token;
        const artistID = req.headers.artist_id;

        if (!accessToken) return res.status(400).json({ error: 'Missing token header' });
        if (!artistID) return res.status(400).json({ error: 'Missing artist_id header' });

        const artistService = new APIService(accessToken);
        const request = await artistService.request(`v1/artists/${artistID}`, "GET");

        if (!request) return res.status(500).json({ error: "Failed to fetch artist data" });

        return res.status(200).json(request);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});


export default router;
