import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import querystring from 'querystring';

dotenv.config();


const router = express.Router();


const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const CALLBACK_URI = process.env.CALLBACK_URI;

const corsOptions = {

    origin: "http://127.0.0.1:5173",
}

router.use(cors(corsOptions));

router.get("/", (req, res) => {

    console.log("Route at /");
});



////////////////////
/// LOGIN ROUTE ///
//////////////////


router.get('/login', (req, res) => {
    console.log("Route at /login");

    const scopes = [

        "streaming",
        "user-read-email",
        "user-read-private",
        "user-library-read",
        "user-library-modify",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing"
    ];

    const state = generateRandomString(16);

    const redirectURLParams = new URLSearchParams({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scopes.join("%20"),
        redirect_uri: CALLBACK_URI,
        state: state

    });

    let redirectURL = `https://accounts.spotify.com/authorize?${redirectURLParams.toString()}`;

    res.json({ redirectURL: redirectURL }).status(200);

});


///////////////////////
/// CALLBACK ROUTE ///
/////////////////////
router.get('/callback*', async (req, res, next) => {
    console.log("Route at /callback");

    const authCode = req.query.code || null;
    const state = req.query.state || null;

    if (authCode === null && state === null) {

        res.redirect('/#' + querystring.stringify({
            error: 'state_mismatch'
        }));
    }
    else {
        try {

            const accessURL = new URLSearchParams({

                code: authCode,
                redirect_uri: CALLBACK_URI,
                grant_type: "authorization_code"
            });

            const request = await fetch("https://accounts.spotify.com/api/token", {

                method: "POST",
                headers: {

                    "Authorization": 'Basic ' + (new Buffer.from(SPOTIFY_CLIENT_ID + `:` + SPOTIFY_CLIENT_SECRET).toString('base64')),
                    "Content-Type": 'application/x-www-form-urlencoded'
                },
                body: accessURL.toString(),
                json: true
            });

            const data = await request.json();
            const { access_token, refresh_token, expires_in } = data;

            //console.log(access_token, refresh_token, expires_in);
            req.tokens = { access_token, refresh_token, expires_in };

            next();
            // TOKENS RECEIVED
        }
        catch (error) { next(error) }
    }
}, (req, res) => {

    const { access_token, refresh_token, expires_in } = req.tokens;
    //res.cookie("AccessToken", access_token, { maxAge: 60000 })
    req.session.visited = true
    req.session.access_token = access_token


    res.redirect("http://127.0.0.1:5173/dashboard");
});


//////////////////
/// FUNCTIONS ///
////////////////
function generateRandomString(length) {

    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {

        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}






export default router;
