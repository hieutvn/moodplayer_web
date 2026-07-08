import { useEffect, useState, useRef } from "react";
import styles from "../assets/styles/settings.module.css";
import { usePlayerContext } from "../contexts.js";

export default function Settings() {
  const { accessToken } = usePlayerContext();

  const [profileData, setProfileData] = useState({
    name: "Profile",
    img: "",
  });
  const [toggle, setToggle] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const menuRef = useRef(null);

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
    if (!accessToken) {
      setProfileData({ name: "Profile", img: "" });
      setIsLoaded(false);
      return;
    }

    let isMounted = true;

    const getProfile = async () => {
      try {
        const request = await fetch("http://127.0.0.1:3000/api/user/getuser", {
          method: "GET",
          headers: {
            token: accessToken,
          },
        });
        const data = await request.json();

        if (!isMounted) return;

        setProfileData({
          email: data.email || "",
          name: data.display_name || data.id || "Profile",
          img: data.images?.[1]?.url || data.images?.[0]?.url || "",
        });
        setIsLoaded(true);
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setProfileData({ name: "Profile", img: "" });
          setIsLoaded(true);
        }
      }
    };

    getProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  function toggleMenu() {
    setToggle((prev) => !prev);
  }

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
