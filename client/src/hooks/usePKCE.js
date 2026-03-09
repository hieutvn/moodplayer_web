import { useEffect } from "react";

export function usePKCE() {

    const callbackUri = "http://127.0.0.1:3000/api/auth/callback";
    const spotifyClientId = "fdcfef66b1fd4e439fc6a2064e3541fb";
    const authEndpoint = "https://accounts.spotify.com/authorize";
    const tokenEndpoint = "https://accounts.spotify.com/api/token";

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

    useEffect(() => {

        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));

            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        }

        const sha256 = async (plain) => {
            const encoder = new TextEncoder()
            const data = encoder.encode(plain)
            return window.crypto.subtle.digest('SHA-256', data)
        }

        const base64 = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        }

        const codeVerifier = generateRandomString(16)
        const codeChallenge = base64(sha256(codeVerifier))

        const redirectURLParams = new URLSearchParams({
            response_type: "code",
            client_id: spotifyClientId,
            scope: scopes.join(" "),
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
            redirect_uri: callbackUri,
            state: state

        });

        authEndpoint.search = new URLSearchParams(redirectURLParams).toString();
        window.location.href = authEndpoint.toString();

    }, []);



}




