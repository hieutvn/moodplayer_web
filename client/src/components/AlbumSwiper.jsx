import styles from '../assets/styles/albumswiper.module.css';

import { useState, useContext, useEffect } from 'react';
import { AlbumContext } from './App';


let albums = [

    { cover: "../assets/img/acrossthespiderverse.jpg", title: "METRO BOOMIN PRESENTS SPIDER‐MAN: ACROSS THE SPIDER‐VERSE: SOUNDTRACK FROM AND INSPIRED BY THE MOTION PICTURE" },
    { cover: "../assets/img/topimpabutterfly.jpg", title: "To Pimp a Butterfly" },
    { cover: "../assets/img/kingsdisease3.jpg", title: "King's Disease III" }

]

export default function AlbumSwiper() {

    const { currentAlbum } = useContext(AlbumContext);

    const [index, setIndex] = useState(0);

    function handleScroll(e) {

        if (e.deltaY > 0) {
            console.log("TRUE")

        } else if (e.deltaY < 0) {
            console.log("FALSE")
        }
    }

    useEffect(() => {

        console.log("AAA", currentAlbum)
    }, [currentAlbum])

    if (!currentAlbum) return (<p>Title loading...</p>)
    return (

        <div className={styles.album_swiper} onWheel={handleScroll}>
            <div className={styles.album_covers}>
                <img src={currentAlbum.images[0].url} className={styles.album} />

            </div>

            <div className={styles.album_titles_wrapper}>
                <div className={styles.gradient}></div>
                <div className={styles.album_titles}>
                    <p className={styles.title}>{currentAlbum.name}</p>
                </div>
            </div>
        </div >
    )
}


// TBD.
function initAlbums(card, index) {
    var newAlbums = document.querySelectorAll('.album:not(.removed)');

    newAlbums.forEach(function (album, index) {
        album.style.zIndex = allCards.length - index;
        album.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
        album.style.opacity = (10 - index) / 10;
    });

    tinderContainer.classList.add('loaded');
}

