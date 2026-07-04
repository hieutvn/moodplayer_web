import styles from "../assets/styles/searchhistory.module.css";

import { useState } from "react";

import UserInput from "./UserInput.jsx";

export default function SearchHistory() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={styles.search_history}>
      <div className={styles.search_wrapper}>
        <div className={styles.moods_wrapper}>
          <p>Current Session</p>
          <div className={styles.moods_container}>
            <UserInput />
          </div>
        </div>
        <div className={styles.search_options}></div>
      </div>

      <div className={styles.search_history_items}></div>
    </div>
  );
}
