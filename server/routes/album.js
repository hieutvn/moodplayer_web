import express from 'express';
const router = express.Router();

import { Node, LinkedList } from "../scripts/classes/LinkedList.js"

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


async function recommand(token, moods) {

    /* 
        LINKEDLIST

        FETCH -> SEARCH ENDPOINT

        DATA.JSON

        LOOP DATA
        ADD TO NODE
        ADD TO LINKEDLIST
    
    */
    try {

        let playlist = new LinkedList();

        /* search?q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=album */
        const request = await fetch(`https://api.spotify.com/v1/`, {

            method: 'GET',
            headers: {

                Authorization: 'Bearer ' + token
            }
        })
        const data = await request.json();
        console.log("davis alb ", data);
    }
    catch (error) {

        console.error(error)
    }


}



export default router;
