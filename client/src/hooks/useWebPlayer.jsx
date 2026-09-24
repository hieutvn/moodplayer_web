import { useState, useEffect, useRef } from "react";


export default function useWebPlayer(accessToken) {

  const [webplayer, setWebPlayer] = useState(null);
  const webPlayerRef = useRef(null);
  const [expiry, setExpiry] = useState(null);

  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [prevNextSong, setPrevNextSong] = useState({ prev: null, next: null });

  const loadedScriptRef = useRef(false);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    if (!loadedScriptRef.current) {

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const webplayer = new Spotify.Player({
        name: "Moodplayer Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      webplayer.on("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      webplayer.on("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message);
      });

      webplayer.on("account_error", ({ message }) => {
        console.error("Failed to validate Spotify account", message);
      });

      webplayer.on("playback_error", ({ message }) => {
        console.error("Failed to perform playback", message);
      });

      webplayer.addListener("ready", async ({ device_id }) => {
        console.log("Webplayer initialized. ID: ", device_id);

        //setWebPlayer(webplayer);
        webPlayerRef.current = webplayer;

        await fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
          headers: new Headers({
            Authorization: "Bearer " + accessToken,
          }),
        }).then((response) => {
          console.log(response);
        });

        if (device_id) {

          setDeviceId(device_id);

          await fetch(`http://127.0.0.1:3000/api/playlist/register-player`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body:
              JSON.stringify({ deviceId: device_id }),

          });
        }

      });

      webplayer.addListener("player_state_changed", (state) => {
        if (!state) return;

        const data_currentSong = state.track_window.current_track;
        const data_currentAlbum = state.track_window.current_track.album;
        const data_isPlaying = state.paused;

        setIsPlaying(data_isPlaying);
        setCurrentSong(data_currentSong);
        setIsReady(true);

        const prevSong = state.track_window.previous_tracks[0]
          ? state.track_window.previous_tracks[0].id
          : null;
        const nextSong = state.track_window.next_tracks[0]
          ? state.track_window.next_tracks[0].id
          : null;

        if (
          (prevSong && nextSong && prevNextSong.prev !== prevSong) ||
          prevNextSong.next !== nextSong
        ) {
          setCurrentAlbum(data_currentAlbum);
          prevNextSong.prev = prevSong;
          prevNextSong.next = nextSong;
        }
      });

      webplayer.connect().then((success) => {
        success
          ? console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          )
          : console.error("Error");
      });

    };

    return () => {
      webplayer?.disconnect();
    };
  }, [accessToken]);



  const resume = () => webPlayerRef.current.resume();
  const pause = () => webPlayerRef.current.pause();
  const togglePlay = () => webPlayerRef.current.togglePlay();
  const seek = (ms) => webPlayerRef.current.seek(ms);
  const nextTrack = () => webPlayerRef.current.nextTrack();
  const prevTrack = () => webPlayerRef.current.previousTrack();
  const setVolume = (vol) => webPlayerRef.current.setVolume(vol);
  const getCurrentPlaybackState = async () => webPlayerRef.current.getCurrentState();
  const playAlbum = async (albumId) => {

    if (!albumId || !deviceId) return;
    console.log("playling on sdk")

    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context_uri: `spotify:album:${albumId}`,
            offset: { position: 0 },

          }),
        },
      );
    } catch (error) {
      console.error(error);
    }
  };


  return {

    deviceId,
    currentSong,
    currentAlbum,
    isPlaying,
    isReady,
    resume,
    pause,
    togglePlay,
    seek,
    nextTrack,
    prevTrack,
    setVolume,
    getCurrentPlaybackState,
    playAlbum

  };
}
