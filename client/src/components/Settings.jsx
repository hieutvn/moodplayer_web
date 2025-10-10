import { useContext, useEffect, useState } from 'react';

import styles from '../assets/styles/settings.module.css';

import { TokenContext } from '../components/App';

export default function Settings() {

    const { accessTokenState } = useContext(TokenContext);

    const [loggedIn, setLoggedIn] = useState(false);
    const [profile, setProfile] = useState(null);

    async function getProfile() {

        if (!accessTokenState) return;

        try {
            const request = await fetch("https://api.spotify.com/v1/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenState}`
                }
            });
            const data = await request.json();
            console.log(data)
            setProfile(data.images[0].url);

        }
        catch (error) {

            console.error(error);
        }
    }

    useEffect(() => {

        if (accessTokenState) setLoggedIn(true);
        setLoggedIn(false);

    }, [accessTokenState]);

    useEffect(() => {

        //getProfile() TBD.
        console.log(profile)

    }, [loggedIn]);

    return (

        <div className={styles.settings}>
            <div className={styles.profile}>
                <img src={loggedIn ? profile : "#"} alt="Profile" />
            </div>
            <div className={styles.added_songs}></div>
            <div className={styles.log_out}>
                <span>Log out</span>
            </div>
        </div>
    )
}