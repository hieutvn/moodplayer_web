import axios from 'axios';
import styles from '../assets/styles/app.module.css';

import AlbumList from './AlbumList';
import Search from './Search';
import Settings from './Settings';
import Player from './Player';
import AlbumSwiper from './AlbumSwiper';
import { useEffect, useState } from 'react';

export default function App() {

    async function getToken() {

        try {

            const request = await fetch("http://127.0.0.1:3000/api/calls/", {

                method: "GET",
                credentials: "include"
            })

            const data = await request.json();
            console.log(data)


        }
        catch (error) {

            console.log(error)

        }
    }

    const [accessTokenState, setAccessToken] = useState(null);

    useEffect(() => {

        setAccessToken(getToken());

        const script = document.createElement('script');
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const webplayer = new Spotify.Player({

                name: 'Moodplayer Web Playback SDK',
                getOAuthToken: cb => { !accessTokenState ? null : cb(accessTokenState) },
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
        }

    });


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
                    </div>
                </div>
            </main>
        </div>
    )
}