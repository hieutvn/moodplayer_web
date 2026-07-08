import express from 'express';
import cors from "cors";
import querystring from 'querystring';
import cookieParser from "cookie-parser";

import { generateLoginURL, generateAccessToken } from '../controllers/auth.controller.js';



const router = express.Router();


const corsOptions = {

    origin: "http://127.0.0.1:5173",
    credentials: true
}

router.use(cors(corsOptions));
//router.use(cookieParser);

router.get("/", (req, res) => {

    console.log("Route at /");
});




////////////////////
/// LOGIN ROUTE ///
//////////////////

router.get('/login', (req, res) => {
    console.log("Route at /login");

    const redirectURL = generateLoginURL();
    res.status(200).json({ redirectURL: redirectURL });
});






///////////////////////
/// CALLBACK ROUTE ///
/////////////////////

router.get('/callback', async (req, res, next) => {
    console.log("Route at /callback");

    const authCode = req.query.code;
    const state = req.query.state;

    if (!authCode || !state) {

        res.redirect('/#' + querystring.stringify({
            error: 'state_mismatch'
        }));
    }

    try {

        const { access_token, refresh_token, expires_in } = await generateAccessToken(authCode);


        res.
            cookie("access_token", {
                access_token: access_token,
                expires_in: expires_in
            }, {

                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: expires_in * 1000
            })
            .cookie("refresh_token", refresh_token, {
                httpOnly: true,
                secure: false, 
                sameSite: "strict",
                path: "/api/auth/refreshtoken", // must match route so browser sends cookie
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

        res.status(200).redirect("http://127.0.0.1:5173/dashboard");
    }
    catch (error) { next(error) }
});



router.get("/gettoken", (req, res, next) => {

    console.log("at gettoken");

    if (!req.cookies.access_token) {
        return res.status(401).json({ message: "No token found." });
    }

    res.status(200).json({
        access_token: req.cookies.access_token
    });
});

router.post("/refreshtoken", async (req, res, next) => {
    try {

        const request = await fetch("https://accounts.spotify.com/api/token", {

            method: "POST",
            headers: {

                "Content-Type": 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({

                grant_type: "refresh_token",
                refresh_token: req.cookies.refresh_token,
                client_id: process.env.SPOTIFY_CLIENT_ID
            })
        });

        const response = await request.json();

        const { access_token, expires_in } = response;

        res.cookie("access_token", {
            access_token,
            expires_in
        }, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: expires_in * 1000
        });

        if (!response.ok || !response.access_token) {
            return res.status(500).json({ error: "Failed to refresh access token" });
        }

        res.status(200).json({
            access_token,
            expires_in
        });
    }
    catch (error) {
        next(error);
    }
});


export default router;
