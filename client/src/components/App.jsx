import axios from 'axios';
import styles from '../assets/styles/app.module.css';

import AlbumList from './AlbumList';
import Search from './Search';
import Settings from './Settings';
import Player from './Player';
import AlbumSwiper from './AlbumSwiper';

import { useEffect, useState, useRef } from 'react';

export default function App() {

    async function getToken() {

        try {

            const request = await fetch("http://127.0.0.1:3000/api/calls/", {

                method: "GET",
                credentials: "include"
            })

            const data = await request.json();

            return data.access_token;
        }
        catch (error) {

            console.log(error)

        }
    }

    //TOKEN HANDLING
    //setAccessToken(getToken());
    const [accessTokenState, setAccessToken] = useState(null);
    const tokenWorkerRef = useRef(null);
    const [webplayer, setWebPlayer] = useState(null);

    useEffect(() => {

        async function setToken() {

            const token = await getToken();
            setAccessToken(token);
            //if (accessTokenState !== null) console.log("token", accessTokenState)
        }
        setToken();
        //return undefined;

    }, []);

    useEffect(() => {

        tokenWorkerRef.current = new Worker('/scripts/token-worker.js', { type: "module" });

        function setToken() { tokenWorkerRef.current.postMessage({ action: 'setToken', payload: token }) }
        function getToken() {

            return new Promise((resolve, reject) => {

                tokenWorkerRef.current.onmessage = function (event) {

                    if (event.data.action === 'token') resolve(event.data.token);
                    else if (event.data.action === 'tokenExpired') reject("Token has expired.");
                }
                tokenWorkerRef.current.postMessage({ action: 'getToken' });
            });
        }
        function clearToken() { tokenWorkerRef.current.postMessage({ action: "clearToken" }) }

        //return () => { console.log("Worker terminated"); tokenWorkerRef.current.terminate() } --> UNMOUNT ALTERNATIVE
    }, []);

    useEffect(() => {

        if (accessTokenState === null) return;


        const script = document.createElement('script');
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const webplayer = new Spotify.Player({

                name: 'Moodplayer Web Playback SDK',
                getOAuthToken: cb => { cb(accessTokenState) },
                volume: 0.5
            });

            //ERRORS
            webplayer.on('initialization_error', ({ message }) => {
                console.error('Failed to initialize', message);
            });

            webplayer.on('authentication_error', ({ message }) => {
                console.error('Failed to authenticate', message);
            });

            webplayer.on('account_error', ({ message }) => {
                console.error('Failed to validate Spotify account', message);
            });

            webplayer.on('playback_error', ({ message }) => {
                console.error('Failed to perform playback', message);
            });

            webplayer.addListener('ready', ({ device_id }) => {

                console.log("Webplayer initialized. ID: ", device_id);
                setWebPlayer(webplayer);

                console.log("Changing to device");
                fetch("https://api.spotify.com/v1/me/player", {
                    method: "PUT",
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: false,
                    }),
                    headers: new Headers({
                        Authorization: "Bearer " + accessTokenState,
                    }),
                }).then((response) => {
                    console.log(response)
                });

            });

            webplayer.addListener('player_state_changed', ({ state }) => {

                if (!state) return;

            });

            webplayer.connect()
                .then(success => {

                    (success) ? console.log("The Web Playback SDK successfully connected to Spotify!") : console.error("Error");
                });
        }
    }, [accessTokenState]);



    if (webplayer) {
        return (

            <div className={styles.app}>

                <div className={styles.navbar_wrapper}>
                    <nav className={styles.navbar}>
                        <div className={styles.logo}>moodply.</div>
                        <Search />
                        <Settings />

                    </nav>
                </div>


                <main className={styles.main}>
                    <div className={styles.main_wrapper}>
                        <div className={styles.main_left}>

                            <div className={styles.album_swiper}>
                                <AlbumSwiper />
                            </div>

                            <div className={styles.player}>
                                <Player />
                            </div>
                        </div>

                        <div className={styles.main_right}>
                            <AlbumList />
                            <button onClick={() => { webplayer.togglePlay(() => { console.log("current playing") }) }}>play</button>

                        </div>
                    </div>
                </main>
            </div>
        )
    }
    else if (!webplayer) {
        return (
            <div>Loading Web Player...</div>
        )
    }
}