/* 
const getTopAlbumsForTag = new Map();
    
    artist (z.B. weeknd) - 
    [
        {
            LINK 1
            
            artist: "weeknd",
            artist_tags: [...],
            artist_mbid: "...",
            album: "after hours", 
            album_tags: [high energy, party], 
            album_mbid: "...",
        }
        NEXT -->
        {
            LINK 2
            
            artist: "weeknd",
            artist_tags: [...],
            artist_mbid: "...",
            album: "after hours", 
            album_tags: [high energy, party], 
            album_mbid: "...",
        }
    ]

    1 -> input [pop, rap, ...]
    2 -> suche pro keywords top alben aus jedem keyword über lastfm
        2.1 -> es soll künstler mit tags und alben mit tags gespeichert werden
    3 -> suche weitere alben von ähnlichen künstlern oder alben, die häufig zusammen auftauchen
    4 -> packe alben in einer playlist
    5 -> playlist so aufbereiten (mixen, kürzen), sodass nicht: 
            - ein künstler 3 mal hintereinander/in der playlist auftaucht
            - ein album 2/mehrfach auftaucht
            - die länge von 50 überschreitet
    6 -> playlist zurückgeben


    1: POST request mit keywords zum server
    2:
        -> Durch array loopen
        -> Request an lastfm mit einem keyword
        -> Zurückgekommende Ergebnisse in einer DS (Array, Stack, Map, LL, Tree) speichern
            - unterteilt in jew. keywords vom user:
                - artist: name, (mbid), tags
                - album: name, (mbid), tags
    3: 
        -> unterteilt in jew. keywords vom user:
            -> mit aritst mbid ähnliche künstler raussuchen
            -> mit album mbid ähnliche alben raussuchen
        -> diese in einer DS speichern
    4: 
        -> vllt in LL packen (vllt wegen Historie-Funktion)
        -> durch liste gehen und alben von wiederholende künstler (2x max.) und wiederholende alben entfernen
        -> liste mixen
        -> gesamtlänge von 40-50 items
    5: Liste zurückgeben 
    


*/

import {
    lastFmRequest,
    getTopAlbumsForTag,
    getTopAlbumsFromArtist,
    getAlbumTags,
    getAlbumTopTags,
    searchTags,
    getSimilarTags,
    getSimilarArtists,
    getAlbumInfo,
} from "./lastfm.controller.js";

import { Node, LinkedList } from '../scripts/classes/LinkedList.js';

async function resolveKeywords(keyword) {

    const kw = keyword.trim().toLowerCase();

    const matches = await searchTags(kw, 5);
    const directMatches = matches.find(tag => tag.name.toLowerCase() === kw);

    if (directMatches) {
        return [directMatches.name];
    }

    if (matches.length > 0) {
        return matches.slice(0, 3).map(tag => tag.name);
    }

    return [kw];
}

async function searchAlbumFromTags(rawKeywords) {

    let albumList = new Map();


    const searchingAlbums = rawKeywords.map(async (keyword) => {

        const searchedKeyword = await getTopAlbumsForTag(keyword);

        searchedKeyword.map(async (album) => {

            const relatedTags = await getAlbumTopTags(album.artist.name, album.name);

            if (Array.isArray(relatedTags)) {

                relatedTags.map((tag) => {
                    console.log("ARTIST", album.artist.name)
                    console.log("TAG", tag.name)
                });
            }

            albumList.set(
                `${album.artist.name}`, {
                artist_mbid: album.artist.mbid,
                album: album.name,
                album_mbid: album.mbid,
                related_tags: relatedTags
            });
        });
    })
    await Promise.all(searchingAlbums);

    return albumList;
}

async function searchSimilarArtistFromMap(rawKeywordsMap) {

    let similarAlbum = new Map();
    for (const [key, _] of rawKeywordsMap) {

        const searchedArtist = await getSimilarArtists(key);

        const albumRequests = searchedArtist.map(async (item) => {

            if (!similarAlbum.has(item.name)) {

                const searchedAlbum = await getTopAlbumsFromArtist(item.name);

                similarAlbum.set(
                    `${searchedAlbum[0].artist.name}`, {
                    album: searchedAlbum[0].name,
                    external_ids: {

                        artist_mbid: searchedAlbum[0].artist.mbid,
                        album_mbid: searchedAlbum[0].mbid
                    }
                })
            }
        });

        await Promise.all(albumRequests);
    }
    return similarAlbum;
}


async function mixAndMatchPlaylist(rawKeywords) {

    const searchAlbumsByTags = await searchAlbumFromTags(rawKeywords);
    const searchSimilarAlbums = await searchSimilarArtistFromMap(searchAlbumsByTags);

    for (const [key, value] of searchSimilarAlbums) {
        if (!searchAlbumsByTags.has(key)) {
            searchAlbumsByTags.set(key, value);
        }

        /*         console.log("key", key)
                console.log("value", value.album)
        
                const relatedTags = await getAlbumTopTags(key, value.album);
        
                if (Array.isArray(relatedTags)) {
        
                    relatedTags.map((tag) => {
                        console.log("TAG", tag.name)
                    });
                }

        for (const [key, value] of searchAlbumsByTags) {
            console.log("key", key)
            console.log("value", value.album)
        }
            */

    }

    /*
                const relatedTags = await getAlbumTags(album.artist.mbid, album.mbid);
            console.log("ALBUM TAGS", getAlbumInfo);
                            //related_tags: relatedTags

    */


    return searchAlbumsByTags;
}



export {
    resolveKeywords,
    searchAlbumFromTags,
    searchSimilarArtistFromMap,
    mixAndMatchPlaylist
};