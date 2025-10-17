import AddedIcon from "../assets/icons/add_album_btn.svg";
import LogOutIcon from "../assets/icons/log_out_btn.svg";

import { useContext, useEffect, useState, useRef } from 'react';

import styles from '../assets/styles/settings.module.css';

import { TokenContext } from '../components/App';

export default function Settings() {

    const { accessTokenState } = useContext(TokenContext);

    const [loggedIn, setLoggedIn] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [toggle, setToggle] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(event) {

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setToggle(false);
            }
        }
        document.addEventListener("click", handleClickOutside);

        // UNMOUNT
        return () => { document.removeEventListener("click", handleClickOutside); }
    }, []);

    function clickProfile() {

        setToggle(!toggle)
        
        if (toggle) {
            
            console.log("toggling", toggle)
        }
    }

    useEffect(() => {

        if (!accessTokenState) { setLoggedIn(false); }
        setLoggedIn(true);

    }, [accessTokenState]);

    useEffect(() => {

        const getProfile = async () => {

            if (!accessTokenState) return;

            const request = await fetch("http://127.0.0.1:3000/api/user/getuser", {
                method: 'GET',
                headers: new Headers({
                    token: accessTokenState,
                })
            });
            const data = await request.json();
            console.log("settings", data)
            setProfileData({
                email: data.email,
                name: data.display_name,
                img: data.images[1].url,


            });
        }

        getProfile()
            .catch(console.error)

    }, [loggedIn]);

    if (!loggedIn) { return (<h3>Loading...</h3>) }
    else if (loggedIn) {
        return (

            <div className={styles.settings}>
                <div className={toggle ? `${styles.profile} ${styles.active}` : styles.profile} onClick={clickProfile}>
                    <p className={styles.profile_name}>{!profileData.name ? "no name" : profileData.name}</p>
                    <img className={styles.profile_img} src={loggedIn ? profileData.img : "#"} alt="Profile" />

                    { toggle && (
                        <div className={styles.profile_menu}>
                            <p>Settings</p>
                            <p>Logout</p>
                        </div>


                    )}
                </div>
                <div className={styles.added_songs}>
                    <AddedIcon className={styles.icon} />
                </div>
                <div className={styles.log_out}>
                    <LogOutIcon className={styles.icon} />
                    <p>Log out</p>
                </div>
            </div>
        )
    }
}