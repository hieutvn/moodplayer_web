import { useState, useRef, useEffect } from 'react';

import styles from '../assets/styles/search.module.css';

import SearchIcon from '../assets/icons/search_btn.svg';

export default function Search() {

  let moods = [];

  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {

    function handleClickOutside(event) {

      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
  }, []);


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