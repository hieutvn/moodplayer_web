import express from 'express';
const router = express.Router();

router.get("/getuser", async (req, res) => {

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

