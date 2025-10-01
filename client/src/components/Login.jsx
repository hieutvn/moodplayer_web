import { useEffect } from "react";


export default function Login() {3

    async function loginWithSpotify() {


        try {

            const request = await fetch("http://127.0.0.1:3000/api/auth/login")

            const data = await request.json();

            if (data)
                window.location.href = data.redirectURL;


        }
        catch (error) {

            console.log(error)

        }


    }


    return (

        <button id="connect_with_spotify_btn " onClick={loginWithSpotify}>Connect with Spotify</button>

    )
}