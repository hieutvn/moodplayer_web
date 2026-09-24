import { useState, useCallback, useEffect, useRef } from 'react';

export default function usePlaylistControls(playlist = [], playAlbum) {
    const [currentIndex, setCurrentIndex] = useState(0);
    let playlistRef = useRef(playlist);

    useEffect(() => {
        playlistRef.current = playlist;
    }, [playlist]);

    const playCurrentAlbum = useCallback(() => {
        const albumId = playlistRef.current[currentIndex];
        console.log("play current alb", Array.isArray(playlistRef.current))

        if (albumId) { playAlbum(albumId); }
    }, [playlist, currentIndex, playAlbum]);

    const playPrevAlbum = useCallback(() => {
        console.log("play prev alb")
        setCurrentIndex((prev) => {
            const next = Math.max(prev - 1, 0);
            playAlbum(playlistRef.current[next]);
            return next;
        });
    }, [playAlbum]);

    const playNextAlbum = useCallback(() => {
        console.log("play next alb")
        setCurrentIndex((prev) => {
            const next = Math.min(prev + 1, playlistRef.current.length - 1);
            playAlbum(playlistRef.current[next]);
            return next;
        });
    }, [playAlbum]);

    return {
        currentIndex,
        currentPlayingAlbum: playlistRef.current[currentIndex],
        playCurrentAlbum,
        playPrevAlbum,
        playNextAlbum,
    };
}