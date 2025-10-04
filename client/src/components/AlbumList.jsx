import { useEffect, useContext, useState, useMemo } from 'react';
import styles from '../assets/styles/albumlist.module.css';

import { AlbumContext, TokenContext } from './App';

export default function AlbumList() {

    const [currentAlbum] = useContext(AlbumContext);
    const [accessTokenState] = useContext(TokenContext);


    const [songs, setSongs] = useState([]);
    const [albumList, setAlbumList] = useState([]);

    useEffect(() => {

        if (!currentAlbum) return;

        const albumID = currentAlbum.uri.slice(14); // EXCLUDES "spotify:album:"

        async function requestAlbum() {

            try {
                const fetchAlbum = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {

                    method: 'GET',
                    headers: new Headers({
                        Authorization: "Bearer " + accessTokenState,
                    })
                });

                const data = await fetchAlbum.json();
                //console.log(data);

            }
            catch (error) { console.error(error) }
            if (!accessTokenState) { throw new Error('No Token loaded.') }
        }
        requestAlbum();
    }, [currentAlbum]);

    useMemo(() => {

        if (!currentAlbum) return;

        const albumID = currentAlbum.uri.slice(14); // EXCLUDES "spotify:album:"

        async function requestAlbum() {

            try {
                const fetchAlbum = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {

                    method: 'GET',
                    headers: new Headers({
                        Authorization: "Bearer " + accessTokenState,
                    })
                });

                const data = await fetchAlbum.json();
                console.log("Token in AlbumList", data); // >>TBD.<<

            }
            catch (error) { console.error(error) }
            if (!accessTokenState) { throw new Error('No Token loaded.') }
        }
        requestAlbum();
    }, [currentAlbum]);


    if (!accessTokenState) { return <h1>Loading..</h1> }
    else if (accessTokenState) {
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
}