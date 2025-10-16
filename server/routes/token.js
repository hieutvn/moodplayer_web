import express from 'express';
const router = express.Router();

import cors from "cors";
const corsOptions = {

    origin: "http://127.0.0.1:5173",
    credentials: true // TO SEND COOKIE ID FOR CALLS
}

router.use(cors(corsOptions));

/// TOKEN ///
router.get("/gettoken", (req, res) => {

    try {
        if (!req.session.access_token) throw new Error("No access token");
        console.log(req.token)

        res.status(200).json({
            "access_token": req.session.access_token
        });
    }
    catch (error) {
        console.error(error);
    }
});



/* router.get("/getartist", async (req, res) => {

    //const data = await apiClient.request('/artists/${artistID}', 'GET', null);
    //return data ? res.status(200).json(data) : res.status(500).json({ error: error.message || 'Internal server error' });

}); */


export default router;