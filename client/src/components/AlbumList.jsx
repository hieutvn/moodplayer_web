import { useEffect, useContext, useState, useMemo, useCallback } from 'react';
import styles from '../assets/styles/albumlist.module.css';

import { AlbumContext, TokenContext } from './App';

export default function AlbumList() {

    const [currentAlbum] = useContext(AlbumContext);
    const [accessTokenState] = useContext(TokenContext);

    const [songs, setSongs] = useState([]);
    const [albumList, setAlbumList] = useState([]);
    const [currentArtistID, setCurrentArtistID] = useState(null);
    const [currentArtistInfos, setCurrentArtistInfos] = useState({ name: null, img: null, followers: null, genres: null });


    const formatDuration = (duration) => {

        // DURATION IN MS
        const totalSec = Number.parseInt(duration / 1000);
        const seconds = totalSec % 60;
        const minutes = Math.floor((seconds % 3600) / 60);
        const hours = Math.floor(totalSec / 3600);


        if (hours > 0)
            return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        else if (hours <= 0)
            return `${minutes}:${String(seconds).padStart(2, "0")}`
    }
    useEffect(() => {

        if (!currentAlbum) return;

        console.log(currentAlbum)

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


                /// SET ARTIST ID ///
                const artistID = album.artists[0].id;
                if (artistID !== currentArtistID) setCurrentArtistID(artistID)
                ///


                console.log("ALBUM", album)
                sessionStorage.setItem(album.name, JSON.stringify({
                    album_name: album.name,
                    album_id: albumID,
                    album_img: album.images[0].url
                }));

                //return album.tracks.items; // RETURNS ARRAY

                album.tracks.items.map((item) => {

                    setAlbumList(prev => [...prev, {
                        artist: item.artists.map((artist) => artist.name).join(", "),
                        name: item.name,
                        //duration: (((item.duration_ms / 1000) / 60).toFixed(2))
                        duration: formatDuration(item.duration_ms)
                    }]);
                })
            }
            catch (error) { console.error(error) }
            if (!accessTokenState) { throw new Error('No Token loaded.') }
        }
        requestAlbum()
            .catch(console.error);

    }, [currentAlbum]);

    useEffect(() => {

        if (!currentArtistID) return;
        console.log("artist id in effect", currentArtistID)

        const requestArtist = async () => {

            try {

                const fetchArtist = await fetch(`https://api.spotify.com/v1/artists/${currentArtistID}`, {
                    method: 'GET',
                    headers: new Headers({
                        Authorization: "Bearer " + accessTokenState,
                    })
                });

                const data = await fetchArtist.json();
                console.log(data)
                setCurrentArtistInfos({
                    name: data.name,
                    img: data.images[0].url, // 640x640 
                    followers: data.followers.total,
                    genres: data.genres.map((genre) => genre).join(", ")
                });
            }
            catch (error) { console.error(error) }

        }
        requestArtist()
            .catch(console.error);

    }, [currentArtistID]);

    /// ---> TBD. SESSIONSTORAGE UM KÜNSTLER KURZZEITIG ZU SPEICHERN UND ABZURUFEN Z.B. ID



    if (!accessTokenState) { return <h1>Loading..</h1> }
    else if (albumList) {
        return (
            <div className={styles.albumlist}>
                <div className={styles.artist_container}>
                    <div className={styles.artist_infos}>
                        <p className={styles.artist_name}>{currentArtistInfos.name}</p>
                        <p>{currentArtistInfos.genres} &#9; {currentArtistInfos.followers} Followers</p>
                    </div>
                    <div className={styles.artist_img}>
                        <img src={currentArtistInfos.img} alt="Artist image" />
                        <div className={styles.gradient}></div>
                    </div>
                </div >
                <ul className={styles.list_container}>
                    <span className={styles.list_upper}><p>Title</p> <p>Duration</p></span>
                    {
                        albumList.map((item, index) => (
                            <li key={index} className={styles.song_container}>
                                <div className={styles.song_info}>
                                    <div className={styles.song_title}>{item.name}</div>
                                    <div className={styles.song_artist}>{item.artist}</div>
                                </div>

                                <div className={styles.song_duration}>{item.duration}</div>
                            </li>
                        ))
                    }
                </ul>
            </div >
        )
    }
}