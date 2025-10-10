import axios from 'axios';
import styles from '../assets/styles/app.module.css';

import AlbumList from './AlbumList';
import Search from './Search';
import Settings from './Settings';
import Player from './Player';
import AlbumSwiper from './AlbumSwiper';

import { useEffect, useState, useRef, useContext, createContext, useMemo } from 'react';

// CONTEXTS
export const SongContext = createContext(null);
export const AlbumContext = createContext(null);
export const PlayingContext = createContext(null);
export const TokenContext = createContext(null);
export const WebPlayerContext = createContext(null);
export const IsPlayingContext = createContext(null);

export default function App() {

    //TOKEN HANDLING
    //setAccessToken(getToken());
    const [accessTokenState, setAccessToken] = useState(null); // USEMEMO?
    const tokenWorkerRef = useRef(null);
    const [webplayer, setWebPlayer] = useState(null);

    //SONG, ALBUM RELATED
    const [currentSong, setCurrentSong] = useState(null);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [prevNextSong, setPrevNextSong] = useState({ prev: null, next: null });


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

    useEffect(() => {

        async function setToken() {

            const token = await getToken();
            setAccessToken(token);
        }

        setToken()
            .catch(console.error);

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
                console.log("webplayer", webplayer)

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

            webplayer.addListener('player_state_changed', (state) => {

                if (!state) return;

                const data_currentSong = state.track_window.current_track;
                const data_currentAlbum = state.track_window.current_track.album;
                const data_isPlaying = state.paused;
                setIsPlaying(data_isPlaying);


                const prevSong = state.track_window.previous_tracks[0] ? state.track_window.previous_tracks[0].id : null; // --> WHEN NEW PLAYLIST IS LOADED, NO PREV OR NEXT TRACK FOUND = ERROR
                const nextSong = state.track_window.next_tracks[0] ? state.track_window.next_tracks[0].id : null;

                if (prevSong && nextSong && prevNextSong.prev !== prevSong || prevNextSong.next !== nextSong) { // CHANGES WHEN USER SKIPS TRACK

                    setCurrentSong(data_currentSong);
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
    }, [accessTokenState]);


    if (!webplayer) { return (<div>Loading Web Player...</div>) }
    else if (webplayer && accessTokenState) {
        return (
            <TokenContext.Provider value={{ accessTokenState }}>
                <SongContext.Provider value={{ currentSong }}>
                    <AlbumContext.Provider value={{ currentAlbum }}>
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
                                            <IsPlayingContext.Provider value={{ isPlaying }}>
                                                <WebPlayerContext.Provider value={{ webplayer }}>
                                                    <Player />
                                                </WebPlayerContext.Provider>
                                            </IsPlayingContext.Provider>
                                        </div>
                                    </div>

                                    <div className={styles.main_right}>

                                        <AlbumList />
                                    </div>

                                </div>
                            </main>
                        </div>
                    </AlbumContext.Provider>
                </SongContext.Provider >
            </TokenContext.Provider >
        )
    }
}