import { useEffect, useState, useRef } from "react";
import styles from "../assets/styles/settings.module.css";

export default function Settings(accessToken) {

  const [profileData, setProfileData] = useState({
    name: "Profile",
    img: "",
  });
  const [toggle, setToggle] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const menuRef = useRef(null);

  const getProfile = async () => {
    try {
      const request = await fetch("http://127.0.0.1:3000/api/user/getuser", {
        method: "GET",
        headers: {
          token: accessToken,
        },
      });
      const data = await request.json();

      setProfileData({
        name: data.display_name || data.id,
        img: data.images?.[1]?.url || data.images?.[0]?.url,
      });

      console.log("func triggered:", data);

    } catch (error) {
      console.error(error);
    }
  };

  function toggleMenu() {
    setToggle((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggle(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) { return; }
    console.log("accessToken testing", accessToken);
    if (accessToken) {
      getProfile(accessToken);
    }
  }, [accessToken]);



  return (
    <div className={styles.settings} ref={menuRef}>
      <div className={styles.profile_info}>
        <button
          type="button"
          className={
            toggle ? `${styles.profile} ${styles.active}` : styles.profile
          }
          onClick={toggleMenu}
          aria-expanded={toggle}
        >
          <span
            className={
              toggle
                ? `${styles.profile_name} ${styles.highlighted}`
                : styles.profile_name
            }
          >
            {isLoaded ? profileData.name : "Profile"}
          </span>
          {profileData.img ? (
            <img
              className={styles.profile_img}
              src={profileData.img}
              alt="Profile"
            />
          ) : (
            <div className={styles.profile_img} aria-hidden="true" />
          )}
        </button>
      </div>

      {toggle && (
        <div className={styles.profile_menu}>
          <button type="button">Added Songs</button>
          <button type="button">Settings</button>
          <button type="button">Logout</button>
        </div>
      )}
    </div>
  );
}
