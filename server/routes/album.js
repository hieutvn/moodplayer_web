import express from 'express';
const router = express.Router();

import { Node, LinkedList } from "../scripts/classes/LinkedList.js"
import { APIService } from '../scripts/classes/APIService.js';


router.get("/getalbum", async (req, res) => {
    try {

        const accessToken = req.headers.token;
        const albumID = req.headers.album_id;

        if (!accessToken) return res.status(400).json({ error: 'Missing token header' });
        if (!albumID) return res.status(400).json({ error: 'Missing album_id header' });

        const albumService = new APIService(accessToken);
        const request = await albumService.request(`v1/albums/${albumID}`, "GET");

        if (!request) return res.status(500).json({ error: "Failed to fetch album data" });
        return res.status(200).json(request);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

router.get("/test", async (req, res) => {

})

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
