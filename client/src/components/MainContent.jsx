import AlbumSwiper from "./AlbumSwiper.jsx";
import AlbumList from "./AlbumList.jsx";
import UserInput from "./UserInput.jsx";
import Player from "./Player.jsx";

import styles from "../assets/styles/maincontent.module.css";

import { useAccessTokenContext } from '../contexts/AccessTokenContext.jsx';
import { WebPlayerProvider } from '../contexts/WebplayerContext.jsx';


export default function MainContent() {

    const accessToken = useAccessTokenContext();

    return (

        <WebPlayerProvider accessToken={accessToken}>
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
        </WebPlayerProvider>
    )
}