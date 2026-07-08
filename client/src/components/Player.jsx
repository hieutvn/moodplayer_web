import styles from "../assets/styles/player.module.css";

//SVG ICONS
import PlayIcon from "../assets/icons/play_btn.svg";
import StopIcon from "../assets/icons/stop_btn.svg";
import NextSongIcon from "../assets/icons/next_song_btn.svg";
import NextAlbumIcon from "../assets/icons/next_album_btn.svg";
import VolumeIcon from "../assets/icons/volume_btn.svg";
import AddSongIcon from "../assets/icons/add_song_btn.svg";
import AddAlbumIcon from "../assets/icons/add_album_btn.svg";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { usePlayerContext, usePlaylistContext } from "../contexts.js";
import Settings from "./Settings.jsx";

export default function Player() {
  const {
    currentSong,
    webplayer,
    isPlaying,
    accessToken,
    deviceId,
    sessionPlaylist,
  } = usePlayerContext();
  const { playlistRef } = usePlaylistContext();

  const [volume, setVolume] = useState(50);
  const [playlist, setPlaylist] = useState([]);
  const [playNextAlbum, setPlayNextAlbum] = useState(false);
  const [playPrevAlbum, setPlayPrevAlbum] = useState(false);
  const [currentAlbumIdx, setCurrentAlbumIdx] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const lastSeekRef = useRef(0);
  const [playlistIndex, setPlaylistIndex] = useState(0);

  const playAlbum = async (albumId) => {
    if (!albumId || !deviceId) return;

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
          }),
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const playSong = useMemo(() => {
    playAlbum(playlistRef.current[playlistIndex]);
  }, [playlistIndex]);

  const prevAlbum = () => {
    if (currentAlbumIdx > 0) {
      const newIdx = currentAlbumIdx - 1;
      setCurrentAlbumIdx(newIdx);
      playAlbum(sessionPlaylist[newIdx]);
    }
  };

  const nextAlbum = () => {
    if (currentAlbumIdx < sessionPlaylist.length - 1) {
      const newIdx = currentAlbumIdx + 1;
      setCurrentAlbumIdx(newIdx);
      playAlbum(sessionPlaylist[newIdx]);
    }
  };

  useEffect(() => {
    if (sessionPlaylist && sessionPlaylist.length > 0) {
      setCurrentAlbumIdx(0);
      playAlbum(sessionPlaylist[0]);
    }
  }, [sessionPlaylist]);

  const onChangeVolume = (event) => {
    const volumePercentage = Number(event.target.value);
    setVolume(volumePercentage);
    webplayer.setVolume(volumePercentage / 100);
  };

  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return "0:00";

    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const hrs = min > 60 ? Math.floor(min / 60) : 0;

    return hrs >= 1
      ? `0${hrs}:${min % 60}:${sec.toString().padStart(2, "0")}`
      : `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  const onSeek = (event) => {
    const ms = Number(event.target.value);
    setPosition(ms);
    lastSeekRef.current = Date.now();
    webplayer.seek(ms);
  };

  useEffect(() => {
    if (!webplayer) return;

    const updateProgress = () => {
      if (Date.now() - lastSeekRef.current < 1500) return;

      webplayer.getCurrentState().then((state) => {
        if (!state) return;
        setPosition(state.position);
        setDuration(state.duration);
      });
    };

    const interval = setInterval(() => {
      updateProgress();
    }, 150);

    return () => clearInterval(interval);
  }, [webplayer, isPlaying]);

  return !webplayer ? (
    <p>Player loading...</p>
  ) : (
    <div className={styles.player}>
      <div className={styles.player_wrapper}>
        <div className={styles.track_info}>
          <p className={styles.track_artist}>
            {!currentSong
              ? "-"
              : currentSong.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p className={styles.track_title}>
            {!currentSong ? "-" : currentSong.name}
          </p>
        </div>
        <div className={styles.player_controls_container}>
          <div className={styles.progress_bar_wrapper}>
            <input
              type="range"
              className={styles.progress_slider}
              min={0}
              max={duration || 1}
              value={position}
              onChange={onSeek}
              style={{ "--value": `${progressPercent}%` }}
            />
          </div>

          <div className={styles.track_time_wrapper}>
            <p className={styles.track_time}>{formatTime(position)}</p>
            <p className={styles.track_time}>{formatTime(duration)}</p>
          </div>

          <div className={styles.player_controls_panel}>
            <div className={styles.player_controls_wrapper}>
              <div className={styles.player_controls}>
                <div className={styles.tooltip}>
                  <span className={styles.tooltip_text}>Previous Album</span>
                  <button className={styles.next_album_btn} onClick={prevAlbum}>
                    <NextAlbumIcon
                      className={styles.icon}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  </button>
                </div>

                <div className={styles.tooltip}>
                  <span className={styles.tooltip_text}>Previous Song</span>
                  <button
                    className={styles.prev_song_btn}
                    onClick={() => {
                      webplayer.previousTrack();
                    }}
                  >
                    <NextSongIcon
                      className={styles.icon}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  </button>
                </div>

                <div className={styles.tooltip}>
                  <span className={styles.tooltip_text}>
                    {isPlaying ? "Play" : "Stop"}
                  </span>
                  <button
                    className={styles.play_stop_btn}
                    onClick={() => {
                      webplayer.togglePlay();
                    }}
                  >
                    {isPlaying ? (
                      <PlayIcon
                        className={styles.icon}
                        style={{ width: "2.25rem", height: "2.25rem" }}
                      />
                    ) : (
                      <StopIcon
                        className={styles.icon}
                        style={{ width: "2.25rem", height: "2.25rem" }}
                      />
                    )}
                  </button>
                </div>

                <div className={styles.tooltip}>
                  <span className={styles.tooltip_text}>Next Song</span>
                  <button
                    className={styles.next_song_btn}
                    onClick={() => {
                      setPlaylistIndex((prev) => prev++);
                      webplayer.nextTrack();
                    }}
                  >
                    <NextSongIcon className={styles.icon} />
                  </button>
                </div>

                <div className={styles.tooltip}>
                  <span className={styles.tooltip_text}>Next Album</span>
                  <button className={styles.next_album_btn} onClick={nextAlbum}>
                    <NextAlbumIcon className={styles.icon} />
                  </button>
                </div>
              </div>
              <div className={styles.player_library}>
                <div className={styles.volume}>
                  <VolumeIcon className={styles.icon} />

                  <input
                    type="range"
                    className={styles.volume_slider}
                    min="0"
                    max="100"
                    onChange={onChangeVolume}
                    value={volume}
                    style={{ "--value": `${volume}%` }}
                  />
                </div>
                <div className={styles.tooltip}>
                  <span className={styles.tooltip_text}>Add Song</span>
                  <button className={styles.add_song_btn}>
                    <AddSongIcon className={styles.icon} />
                  </button>
                </div>

                <div className={styles.tooltip}>
                  <span className={styles.tooltip_text}>Add Album</span>
                  <button
                    className={styles.add_album_btn}
                    onClick={() => fetchCurrentPlaylist()}
                  >
                    <AddAlbumIcon className={styles.icon} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
