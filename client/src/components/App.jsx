import styles from "../assets/styles/app.module.css";

import Player from "./Player.jsx";
import Navigation from "./Navigation.jsx";
import SearchHistory from "./SearchHistory.jsx";
import MainContent from "./MainContent.jsx";

import { useEffect, useState, useMemo, useRef } from "react";
import useAuth from "../hooks/useAuth.jsx";
import useWebPlayer from "../hooks/useWebPlayer.jsx";


import { PlayerContext, PlaylistContext } from "../contexts.js";
import { WebPlayerProvider } from "../contexts/WebplayerContext.jsx";
import { AccessTokenProvider } from "../contexts/AccessTokenContext.jsx";

export default function App() {

  const [accessToken, setAccessToken] = useState(null);

  const [playlist, setPlaylist] = useState([]);
  const [sessionPlaylist, setSessionPlaylist] = useState([]);
  const playlistRef = useRef([]);

  const accessTokenVal = useAuth();
  const { webplayer, deviceId, isReady, currentSong, currentAlbum, isPlaying } = useWebPlayer();


  useEffect(() => {
    if (!accessTokenVal) return;

    console.log("Access Token from useAuth:", accessTokenVal);
    setAccessToken(accessTokenVal);
  }, [accessTokenVal]);


  return !accessToken ? (
    <h1>Player loading...</h1>
  ) : (
    <AccessTokenProvider>
      <Navigation />
      <MainContent />
    </AccessTokenProvider>
  );
}
