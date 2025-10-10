import { useEffect, useContext, useState, useMemo, useCallback } from 'react';
import styles from '../assets/styles/albumlist.module.css';

import { AlbumContext, TokenContext, SongContext } from './App';

export default function AlbumList() {

    const { currentAlbum } = useContext(AlbumContext);
    const { accessTokenState } = useContext(TokenContext);
    const { currentSong } = useContext(SongContext);

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

    const requestAlbum = useCallback(async (currentAlbum) => {

        if (!currentAlbum) return;

        const albumID = currentAlbum.uri.slice(14); // EXCLUDES "spotify:album:"

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

            sessionStorage.setItem(album.name, JSON.stringify({
                album_name: album.name,
                album_id: albumID,
                album_img: album.images[0].url
            }));

            //return album.tracks.items; // RETURNS ARRAY

            album.tracks.items.map((item) => {

                // CHANGE IN ORDER TO AVOID DUPLICATES!!
                setAlbumList(prev => [...prev, {
                    artist: item.artists.map((artist) => artist.name).join(", "),
                    name: item.name,
                    //duration: (((item.duration_ms / 1000) / 60).toFixed(2))
                    duration: formatDuration(item.duration_ms)
                }]);
            })

        }
        catch (error) { console.error(error) }
    }, [accessTokenState]);

    useEffect(() => {

        if (!currentAlbum) return;

        else if (requestAlbum) setAlbumList([]);
        requestAlbum(currentAlbum);

    }, [currentAlbum, requestAlbum]);


    useEffect(() => {

        if (!currentArtistID) return;
        console.log("artist id in effect", currentAlbum)

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

    // <li key={index} className={`styles${ (item.name === currentSong.name) ? song_container.active : song_container}`}> 

    if (!accessTokenState) { return <h1>Loading..</h1> }
    else if (albumList) {
        return (
            <div className={styles.albumlist}>
                <div className={styles.artist_container}>
                    <div className={styles.artist_infos}>
                        <p className={styles.artist_name}>{currentArtistInfos.name}</p>
                        <p>{currentArtistInfos.followers ? (currentArtistInfos.followers).toLocaleString('de-DE') : 0} Followers</p>
                        <hr></hr>
                        <p>{!currentArtistInfos.genres ? "no genres" : currentArtistInfos.genres}</p>
                    </div>
                    <div className={styles.artist_img}>
                        <img src={currentArtistInfos.img} alt="Artist image" />
                        <div className={styles.gradient}></div>
                    </div>
                </div >
                <ul className={styles.list_container}>
                    <span className={styles.list_upper}>
                        <p style={{ width: "80%" }}>Title</p>
                        <p style={{ width: "20%" }}>Duration</p>
                    </span>
                    <div className={styles.list_container_wrapper}>
                        <div className={styles.list_container_scrollable}>
                            {
                                albumList.map((item, index) => {
                                    const isActive = currentSong && item.name === currentSong.name;

                                    return (
                                        <li key={index} className={isActive ? `${styles.song_container} ${styles.active}` : styles.song_container}>
                                            <div className={styles.song_info}>
                                                <div className={styles.song_title}>{item.name}</div>
                                                <div className={styles.song_artist}>{item.artist}</div>
                                            </div>

                                            <div className={isActive ? `${styles.song_duration} ${styles.active}` : styles.song_duration}>{item.duration}</div>
                                        </li>
                                    )
                                })
                            }
                        </div>
                    </div>
                </ul>
            </div >
        )
    }
}