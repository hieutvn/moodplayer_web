import { useState } from 'react';

import styles from '../assets/styles/search.module.css';

import SearchIcon from '../assets/icons/search_btn.svg';

export default function Search() {

  const [count, setCount] = useState(0);
  const [tag, setTag] = useState("");
  const [tagArr, setTagArr] = useState([]);


  function addMoodTag(tag) {

    setTagArr()
  }

  return (
    <div className={styles.search}>

      <div className={styles.search_wrapper}>
        <div className={styles.search_bar}>
          <input
            className={styles.search_bar_input}
            placeholder="Search for category"
            type="text"

          />
          <div className={styles.search_btn}><SearchIcon style={{ width: '1rem' }} /></div>
          <div className={styles.tag_count}><span>{count}/4</span></div>
        </div>

        <div className={styles.tags}>
          <button className={styles.tag}>
            <p className={styles.tag_name}>soundtracks</p>
            <div className={styles.tag_close}>&#10006;</div>
          </button>
        </div>
      </div>
    </div>
  )
}