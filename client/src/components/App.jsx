import styles from '../assets/styles/app.module.css';

import AlbumList from './AlbumList';
import UserInput from './UserInput.jsx';
import Settings from './Settings';
import Player from './Player';
import AlbumSwiper from './AlbumSwiper';
import Navigation from './Navigation';

import { useEffect, useState, useMemo } from 'react';
import { PlayerContext, PlaylistContext } from '../contexts.js';
import { useAuth } from '../hooks/useAuth.js';

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
    const [playlist, setPlaylist] = useState([]);
    const [sessionPlaylist, setSessionPlaylist] = useState([]);

    const { accessTokenVal } = useAuth();

    const playerValue = useMemo(() => ({
        accessToken,
        currentSong,
        currentAlbum,
        isPlaying,
        deviceId,
        webplayer,
        sessionPlaylist,
        setSessionPlaylist,
    }), [accessToken, currentSong, currentAlbum, isPlaying, deviceId, webplayer, sessionPlaylist]);

    const playlistValue = useMemo(() => ({ playlist, setPlaylist, sessionPlaylist, setSessionPlaylist }), [playlist, sessionPlaylist]);

    useEffect(() => {
        if (!accessTokenVal) return;

        setAccessToken(accessTokenVal)
    }, [accessTokenVal]);

    useEffect(() => {

        if (sessionPlaylist) {
            sessionPlaylist.map((album) => {

                console.log(album);
            })

            console.log(sessionPlaylist)
        }
    }, [sessionPlaylist]);

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

                if (prevSong && nextSong && prevNextSong.prev !== prevSong ||
                    prevNextSong.next !== nextSong) {

                    setCurrentAlbum(data_currentAlbum);
                    prevNextSong.prev = prevSong;
                    prevNextSong.next = nextSong;
                }
            });

            webplayer.connect()
                .then(success => {

                    (success) ? console.log("The Web Playback SDK successfully connected to Spotify!") : console.error("Error");
                });
        }

    }, [accessToken]);


    return (!accessToken || !webplayer) ?

        <h1>Player loading...</h1>
        :
        (
            <PlayerContext.Provider value={playerValue}>
                <PlaylistContext.Provider value={playlistValue}>
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
                </PlaylistContext.Provider>
            </PlayerContext.Provider>
        );
}