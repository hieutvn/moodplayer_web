import styles from '../assets/styles/albumswiper.module.css';

import { useState, useEffect } from 'react';
import { usePlayer } from '../contexts.js';

export default function AlbumSwiper() {
    const { currentAlbum } = usePlayer();

    const [currentImg, setCurrentImg] = useState('');

    function handleScroll(e) {

        if (e.deltaY > 0) {
            console.log("TRUE")

        } else if (e.deltaY < 0) {
            console.log("FALSE")
        }
    }

    useEffect(() => {

        if (!currentAlbum) return;
        setCurrentImg(currentAlbum.images[0].url);
    }, [currentAlbum]);

    if (!currentAlbum) return (<p>Title loading...</p>)
    return (

        <div className={styles.album_swiper} onWheel={handleScroll}>
            <div className={styles.album_swiper_bg} style={{ '--bg-image': `url(${currentAlbum.images[0].url})` }}>
                <div className={styles.album_covers}>
                    <img src={currentAlbum.images[0].url} className={styles.album} />

                </div>

                <div className={styles.album_cover_blur}></div>
                <div className={styles.album_titles_wrapper}>
                    <div className={styles.album_titles}>
                        <p className={styles.title}>{currentAlbum.name}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}