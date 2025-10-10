import express from 'express';
const router = express.Router();

import cors from "cors";
const corsOptions = {

    origin: "http://127.0.0.1:5173",
    credentials: true // TO SEND COOKIE ID FOR CALLS
}
router.use(cors(corsOptions));


router.get("/token", (req, res) => {

    try {
        if (!req.session.access_token) throw new Error("No access token");

        res.status(200).json({
            "access_token": req.session.access_token
        });
    }
    catch (error) {
        console.error(error);
    }
});

router.get("/getalbum", async (req, res) => {
    try {
        const accessToken = req.headers.token;
        const albumID = req.headers.album_id;

        if (!accessToken) return res.status(400).json({ error: 'Missing token header' });
        if (!albumID) return res.status(400).json({ error: 'Missing album_id header' });

        const request = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + accessToken,
            }
        });

        if (!request.ok) {
            const text = await request.text();
            console.error('Spotify API error:', request.status, text);
            return res.status(request.status).send(text);
        }

        const album = await request.json();
        return res.status(200).json(album);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

router.get("/getartist", async (req, res) => {
    try {
        const accessToken = req.headers.token;
        const artistID = req.headers.artist_id; 

        const request = await fetch(`https://api.spotify.com/v1/artists/${artistID}`, {
            method: 'GET',
            headers: new Headers({
                Authorization: "Bearer " + accessToken,
            })
        });

        if (!request.ok) {
            const text = await request.text();
            console.error('Spotify API error:', request.status, text);
            return res.status(request.status).send(text);
        }

        const data = await request.json();
        return res.status(200).json(data);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});



export default router;