import UserInput from "./UserInput.jsx";

import styles from "../assets/styles/home.module.css";

export default function Home() { 

    return (

        <div className={styles.home_container}>
            <h1>moodply.</h1>
            <p>
                Welcome to moodply, the ultimate music discovery platform that helps you find the perfect tunes for your mood. 
                Explore new artists, genres, and tracks that match your current vibe and let the music take you on a journey. 
                Get ready to elevate your listening experience with moodply.
            </p>

            <UserInput />

        </div>
    )
}