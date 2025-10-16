import express from 'express';
const router = express.Router();

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

export default router;
