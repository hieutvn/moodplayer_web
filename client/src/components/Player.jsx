import styles from "../assets/styles/player.module.css";

import PlayIcon from "../assets/icons/play_btn.svg";
import NextSongIcon from "../assets/icons/next_song_btn.svg";
import NextAlbumIcon from '../assets/icons/next_album_btn.svg';
import VolumeIcon from "../assets/icons/volume_btn.svg";
import AddSongIcon from "../assets/icons/add_song_btn.svg";
import AddAlbumIcon from "../assets/icons/add_album_btn.svg";

export default function Player() {

  async function play() {

    try {

      const request = await fetch("http://127.0.0.1:3000/api/auth/", {

        method: "GET",
        credentials: "include"
      });

      const data = await request.json();
      console.log(data.access_token);


    }
    catch (error) {

      console.log(error)

    }
  }

  return (
    <footer className={styles.player}>

      <div className={styles.track_info}>
        <p className={styles.track_artist}>Metro Boomin, A$AP Rocky, Roisee</p>
        <p className={styles.track_title}>Am I Dreaming</p>
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
            <button className={styles.prev_song_btn}>
              <NextSongIcon className={styles.icon} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button className={styles.play_stop_btn} onClick={play}>
              <PlayIcon className={styles.icon} style={{ width: '2.25rem', height: '2.25rem' }} />
            </button>
            <button className={styles.next_song_btn}>
              <NextSongIcon className={styles.icon} />
            </button>
            <button className={styles.next_album_btn}>
              <NextAlbumIcon className={styles.icon} />
            </button>
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