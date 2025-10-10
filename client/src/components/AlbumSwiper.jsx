import styles from '../assets/styles/albumswiper.module.css';

import { useState, useContext, useEffect } from 'react';
import { AlbumContext } from './App';


let albums = [

    { cover: "../assets/img/acrossthespiderverse.jpg", title: "METRO BOOMIN PRESENTS SPIDER‐MAN: ACROSS THE SPIDER‐VERSE: SOUNDTRACK FROM AND INSPIRED BY THE MOTION PICTURE" },
    { cover: "../assets/img/topimpabutterfly.jpg", title: "To Pimp a Butterfly" },
    { cover: "../assets/img/kingsdisease3.jpg", title: "King's Disease III" }

]

/* 
NAAAHHHHHH 1/2
function getAverageRGB(element) {

    // https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript

    let blockSize = 5,
        defaulRGB = { r: 0, g: 0, b: 0 },
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data,
        width,
        height,
        i = -4,
        length,
        rgb = { r: 0, g: 0, b: 0 },
        count = 0

    if (!context) return defaulRGB;

    width = canvas.width = element.naturalWidth || element.offsetWidth || element.width;
    height = canvas.height = element.naturalHeight || element.offsetHeight || element.height;

    context.drawImage(element, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    }
    catch (error) {
        return defaulRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {

        ++count;
        rgb.r = data.data[i];
        rgb.g = data.data[i + 1];
        rgb.b = data.data[i + 2]

    }

    rgb.r = ~~(rgb.r / count); //  ~~ -> Rounding
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
} */

export default function AlbumSwiper() {

    const { currentAlbum } = useContext(AlbumContext);

    const [avgColor, setAvgColor] = useState({ r: 0, g: 0, b: 0 });
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

    /* 
    -> NAAHHHHHH 2/2
    useEffect(() => {

        if (!currentImg) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = currentImg;
        console.log("url", currentImg);

        img.onload = () => {

            try {
                const color = getAverageRGB(img);
                console.log("COLOR", color)

                setAvgColor(color);

            }
            catch (error) { console.warn("Error while getting average color", error) }
        }

        img.onerror = (error) => { console.warn("Error while getting average color", error) }

    }, [currentImg])
 */

    if (!currentAlbum) return (<p>Title loading...</p>)
    return (

        <div className={styles.album_swiper} style={{ background: `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})` }} onWheel={handleScroll}>
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

