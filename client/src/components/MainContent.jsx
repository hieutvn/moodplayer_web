import AlbumSwiper from "./AlbumSwiper.jsx";
import AlbumList from "./AlbumList.jsx";
import UserInput from "./UserInput.jsx";
import Player from "./Player.jsx";

import styles from "../assets/styles/maincontent.module.css";

import { useAccessTokenContext } from '../contexts/AccessTokenContext.jsx';
import { WebPlayerProvider } from '../contexts/WebplayerContext.jsx';
import { PlaylistProvider } from "../contexts/PlaylistContext.jsx";
import { LoadingProvider } from "../contexts/LoadingContext.jsx";


export default function MainContent() {

    const accessToken = useAccessTokenContext();

    return (
        <WebPlayerProvider accessToken={accessToken}>
            <PlaylistProvider>
                <LoadingProvider>
                    <main className={styles.main}>

                        <div className={styles.main_wrapper}>
                            <AlbumList />
                            <AlbumSwiper />
                            <UserInput />
                        </div>

                        <div className={styles.main_btm}>
                            <Player />
                        </div>
                    </main>
                </LoadingProvider>
            </PlaylistProvider>
        </WebPlayerProvider>
    )
}