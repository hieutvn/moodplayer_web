import express from 'express';

const router = express.Router();

const API_KEY = process.env.LASTFM_API_KEY;
const BASEURL = process.env.LASTFM_BASEURL

router.get("/callback", (req, res) => {


});

async function lastFmRequest(method, params = {}) {

    try {

        const response = await fetch(BASEURL, {

            method: 'GET',
            api_key: API_KEY,
            format: 'json',
            ...params,
        });

        if (!response.ok) { throw new Error(`HTTP error ${response.status}: ${response.statusText}`); }

        const data = await response.json();

        if (data.error) { throw new Error(`Last.fm API error ${data.error}: ${data.message}`); }

        return data;
    } 
    
    catch (err) {
    
        console.error(`Last.fm request failed [${method}]:`, err.message);
    }
}

export default router;