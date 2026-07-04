import dotenv from 'dotenv';

dotenv.config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const CALLBACK_URI = process.env.CALLBACK_URI;


export function generateLoginURL() { 
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
        scope: scopes.join(" "),
        redirect_uri: CALLBACK_URI,
        state: state

    });

    return `https://accounts.spotify.com/authorize?${redirectURLParams.toString()}`;
}


export async function generateAccessToken(authCode) { 

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

    return { access_token, refresh_token, expires_in };
}




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