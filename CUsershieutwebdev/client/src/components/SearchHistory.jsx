import styles from "../assets/styles/searchhistory.module.css";

import { useState } from "react";

import UserInput from "./UserInput.jsx";

export default function SearchHistory() {
  return (
    <div className={styles.search_history}>
      <div className={styles.search_wrapper}>
        <div className={styles.moods_wrapper}>
          <p>Current Session</p>
          <div className={styles.moods_container}>
            <UserInput />
          </div>
        </div>
      </div>

      <div className={styles.search_history_items}></div>
    </div>
  );
}
