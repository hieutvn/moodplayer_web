import styles from '../assets/styles/app.module.css';

import AlbumList from './AlbumList';
import UserInput from './UserInput.jsx';
import Settings from './Settings';
import Player from './Player';
import AlbumSwiper from './AlbumSwiper';
import Navigation from './Navigation';

import { useEffect, useState, useMemo } from 'react';
import { PlayerContext } from '../contexts.js';

export default function App() {

    //TOKEN HANDLING//
    const [accessToken, setAccessToken] = useState(null);
    const [webplayer, setWebPlayer] = useState(null);
    const [expiry, setExpiry] = useState(null);

    //SONG, ALBUM RELATED//
    const [currentSong, setCurrentSong] = useState(null);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [prevNextSong, setPrevNextSong] = useState({ prev: null, next: null });
    const [deviceId, setDeviceId] = useState(null);


    async function fetchToken() {
        try {
            const request = await fetch("http://127.0.0.1:3000/api/auth/gettoken", {
                credentials: "include",
            });
            // Cookie expired or missing: try refresh so we don't log out
            if (request.status === 401) {
                await refreshToken();
                return;
            }
            if (!request.ok) throw new Error("No access token.");

            const response = await request.json();
            const token = response.access_token.access_token;
            const expiresInSeconds = response.access_token.expires_in;

            setAccessToken(token);
            setExpiry(Date.now() + expiresInSeconds * 1000);
        } catch (error) {
            console.error(error);
        }
    }

    async function refreshToken() {
        try {
            const request = await fetch("http://127.0.0.1:3000/api/auth/refreshtoken", {
                method: "POST",
                credentials: "include",
            });


            const response = await request.json();
            const { access_token, expires_in } = response;

            if (!request.ok) {
                if (request.status === 401) {
                    // Refresh token expired or missing: redirect to login
                    window.location.href = "/";
                    return;
                }
                console.error("Failed to refresh token", request.status);
                return;
            }
            setAccessToken(access_token);
            setExpiry(Date.now() + expires_in * 1000);
        } catch (error) {
            console.error("Error refreshing token", error);
        }
    }

    useEffect(() => {
        fetchToken()
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (accessToken == null || expiry == null) return;

        const timeNow = Date.now();
        const bufferMs = 30_000;
        const refreshIn = Math.max(0, (expiry - timeNow - bufferMs));

        const timer = setTimeout(() => {
            console.log("refreshing token")
            refreshToken()
        }, refreshIn);

        return () => clearTimeout(timer);
    }, [accessToken, expiry, webplayer]);


    useEffect(() => {

        if (!accessToken) { return; }

        const script = document.createElement('script');
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const webplayer = new Spotify.Player({

                name: 'Moodplayer Web Playback SDK',
                getOAuthToken: cb => { cb(accessToken) },
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
                if (device_id) setDeviceId(device_id);
                setWebPlayer(webplayer);

                console.log("Changing to device");
                fetch("https://api.spotify.com/v1/me/player", {
                    method: "PUT",
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: false,
                    }),
                    headers: new Headers({
                        Authorization: "Bearer " + accessToken,
                    }),
                }).then((response) => {
                    console.log(response)
                });

            });

            webplayer.addListener('player_state_changed', (state) => {

                if (!state) return;

                const data_currentSong = state.track_window.current_track;
                const data_currentAlbum = state.track_window.current_track.album;
                const data_isPlaying = state.paused;

                setIsPlaying(data_isPlaying);
                setCurrentSong(data_currentSong);

                const prevSong = state.track_window.previous_tracks[0] ? state.track_window.previous_tracks[0].id : null; // --> WHEN NEW PLAYLIST IS LOADED, NO PREV OR NEXT TRACK FOUND = ERROR
                const nextSong = state.track_window.next_tracks[0] ? state.track_window.next_tracks[0].id : null;

                if (prevSong && nextSong && prevNextSong.prev !== prevSong || prevNextSong.next !== nextSong) { // CHANGES WHEN USER SKIPS TRACK

                    setCurrentAlbum(data_currentAlbum);
                    prevNextSong.prev = prevSong;
                    prevNextSong.next = nextSong;

                    console.log("current prev", prevNextSong.prev)
                    console.log("current next", prevNextSong.next)
                }
            });

            webplayer.connect()
                .then(success => {

                    (success) ? console.log("The Web Playback SDK successfully connected to Spotify!") : console.error("Error");
                });
        }

    }, [accessToken]);


    const playerValue = useMemo(() => ({
        accessToken,
        currentSong,
        currentAlbum,
        isPlaying,
        deviceId,
        webplayer,
    }), [accessToken, currentSong, currentAlbum, isPlaying, deviceId, webplayer]);


    return (!accessToken || !webplayer) ?

        <h1>Player loading...</h1>
        :
        (
            <PlayerContext.Provider value={playerValue}>
                <div className={styles.app}>
                    <Navigation />
                    <main className={styles.main}>
                        <div className={styles.main_wrapper}>
                            <div className={styles.main_left}>
                                <AlbumSwiper />
                                <Player />
                            </div>
                            <div className={styles.main_right}>
                                <AlbumList />
                            </div>
                        </div>
                    </main>
                </div>
            </PlayerContext.Provider>
        );
}