import styles from '../assets/styles/albumlist.module.css';

export default function AlbumList() {

    return (
        <div className={styles.albumlist}>
            <div className={styles.artist_container}>
                <img className={styles.artist_img} src="#" alt="Artist image" />
            </div>
            <div className={styles.list_container}>
                <div className={styles.song_container}>
                    <div className={styles.song_info}>
                        <div className={styles.song_title}>Annihilate</div>
                        <div className={styles.song_artist}>Swae Lee, Lil Wayne and Offset</div>
                    </div>

                    <div className={styles.song_duration}>03:51</div>
                </div>
            </div>
        </div>
    )
}