import styles from "../assets/styles/player.module.css";

//SVG ICONS
import PlayIcon from "../assets/icons/play_btn.svg";
import StopIcon from "../assets/icons/stop_btn.svg";
import NextSongIcon from "../assets/icons/next_song_btn.svg";
import NextAlbumIcon from '../assets/icons/next_album_btn.svg';
import VolumeIcon from "../assets/icons/volume_btn.svg";
import AddSongIcon from "../assets/icons/add_song_btn.svg";
import AddAlbumIcon from "../assets/icons/add_album_btn.svg";

import { useContext, useEffect, useState } from "react";

//CONTEXTS
import { SongContext, WebPlayerContext, IsPlayingContext, TokenContext } from "./App";

export default function Player() {

  const { currentSong } = useContext(SongContext);
  const { webplayer } = useContext(WebPlayerContext);
  const { isPlaying } = useContext(IsPlayingContext);
  const { accessTokenState } = useContext(TokenContext);


  if (!webplayer) return (<p>Player loading...</p>);
  else if (webplayer) {
    return (
      <footer className={styles.player}>
        <div className={styles.track_info}>
          <p className={styles.track_artist}>
            {!currentSong ? "-" : currentSong.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p className={styles.track_title}>
            {!currentSong ? "-" : currentSong.name}
          </p>
        </div>
        <div className={styles.progress_bar_wrapper}>
          <div className={styles.progress_draggable_point}>
            <div className={styles.progress_draggable_handle}></div>
          </div>
          <div className={styles.progress_bar}></div>
        </div>

        <div className={styles.track_time_wrapper}>
          <p className={styles.track_time}>00:00</p>
          <p className={styles.track_time}>03:45</p>
        </div>

        <div className={styles.player_wrapper}>

          <div className={styles.player_controls_wrapper}>

            <div className={styles.volume}>
              <VolumeIcon className={styles.icon} />
              <input type="range" className={styles.volume_slider} max="100" />

            </div>


            <div className={styles.player_controls}>
              <button className={styles.next_album_btn}>
                <NextAlbumIcon className={styles.icon} />
              </button>
              <p className={styles.icon_hide}>Previous Album</p>

              <button className={styles.prev_song_btn} onClick={() => { webplayer.previousTrack() }}>
                <NextSongIcon className={styles.icon} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <p className={styles.icon_hide}>Previous Song</p>

              <button className={styles.play_stop_btn} onClick={() => {
                webplayer.togglePlay()
              }}>
                {isPlaying ? <PlayIcon className={styles.icon} style={{ width: '2.25rem', height: '2.25rem' }} /> : <StopIcon className={styles.icon} style={{ width: '2.25rem', height: '2.25rem' }} />}
              </button>
              <p className={styles.icon_hide}>Play Song</p>

              <button className={styles.next_song_btn} onClick={() => { webplayer.nextTrack() }}>
                <NextSongIcon className={styles.icon} />
              </button>
              <p className={styles.icon_hide}>Next Song</p>

              <button className={styles.next_album_btn}>
                <NextAlbumIcon className={styles.icon} />
              </button>
              <p className={styles.icon_hide}>Next Album</p>

            </div>

            <div className={styles.player_library}>
              <button className={styles.add_song_btn}>
                <AddSongIcon className={styles.icon} />
              </button>
              <button className={styles.add_album_btn}>
                <AddAlbumIcon className={styles.icon} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}