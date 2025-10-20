import express from 'express';
const router = express.Router();

import { APIService } from '../scripts/classes/APIService.js';


/* router.get("/getuser", async (req, res) => {

    try {

        const accessToken = req.headers.token;

        const request = await fetch(`https://api.spotify.com/v1/me/`, {
            method: 'GET',
            headers: new Headers({
                Authorization: "Bearer " + accessToken,
            })
        });

        if (!request.ok) { throw new Error("Requesting User Data failed.") }

        const data = await request.json();
        return res.status(200).json(data);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}); */

router.get("/getuser", async (req, res) => {

    const accessToken = req.headers.token;
    if (!accessToken) return res.status(401).json({ error: "No access token" });

    const getUserService = new APIService(accessToken);
    const request = await getUserService.request("v1/me/", "GET");

    if (!request) return res.status(500).json({ error: "Failed to fetch user" });

    return res.status(200).json(request);
});


router.get("/getuserplaylist", async (req, res) => {

    try {

        const accessToken = req.headers.token;
        const artistID = req.headers.artist_id;

        const request = await fetch(`https://api.spotify.com/v1/users/`, {
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

