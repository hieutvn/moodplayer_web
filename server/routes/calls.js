import express from 'express';
const router = express.Router();

import cors from "cors";
const corsOptions = {

    origin: "http://127.0.0.1:5173",
    credentials: true // TO SEND COOKIE ID FOR CALLS
}
router.use(cors(corsOptions));


router.get("/", (req, res) => {

    try {
        if (!req.session.tokens) throw new Error("No access token");

        res.status(200).json({
            "access_token": JSON.stringify(req.session.tokens)
        });
    }
    catch (error) {
        console.error(error);
    }
})

export default router;