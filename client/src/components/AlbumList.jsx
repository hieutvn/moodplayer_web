import { useEffect, useContext, useState, useMemo, useCallback } from 'react';
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

        const requestAlbum = async () => {

            try {
                const fetchAlbum = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {

                    method: 'GET',
                    headers: new Headers({
                        Authorization: "Bearer " + accessTokenState,
                    })
                });

                const album = await fetchAlbum.json();

                //return album.tracks.items; // RETURNS ARRAY

                album.tracks.items.map((item) => {

                    setAlbumList(prev => [...prev, {
                        artist: item.artists.map((artist) => artist.name).join(", "),
                        name: item.name,
                        duration: (((item.duration_ms / 1000) / 60).toFixed(2))
                    }]);
                })
            }
            catch (error) { console.error(error) }
            if (!accessTokenState) { throw new Error('No Token loaded.') }
        }
        requestAlbum()
            .catch(console.error);

    }, [currentAlbum]);


    if (albumList) console.log(albumList[0])

    if (!accessTokenState) { return <h1>Loading..</h1> }
    else if (albumList) {
        return (
            <div className={styles.albumlist}>
                <div className={styles.artist_container}>
                    <img className={styles.artist_img} src="#" alt="Artist image" />
                </div >
                <ul className={styles.list_container}>
                    {
                        albumList.map((item, index) => (
                            <li key={index} className={styles.song_container}>
                                <div className={styles.song_info}>
                                    <div className={styles.song_title}>{item.name}</div>
                                    <div className={styles.song_artist}>{item.artist}</div>
                                </div>

                                <div className={styles.song_duration}>{item.duration.replace(".", ":")}</div>
                            </li>
                        ))
                    }
                </ul>
            </div >
        )
    }
}