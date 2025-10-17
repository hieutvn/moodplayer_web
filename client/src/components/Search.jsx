import { useState, useRef, useEffect } from 'react';

import styles from '../assets/styles/search.module.css';

import SearchIcon from '../assets/icons/search_btn.svg';

export default function Search() {

  const moods = ["Germany",
    "Greece",
    "Greenland",
    "Georgia",
    "Ghana",
    "Guatemala",
  ];

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
    document.addEventListener("click", handleClickOutside);

    // UNMOUNT
    return () => { document.removeEventListener("click", handleClickOutside); }
  }, []);



  // WHEN INPUT CHANGES
  const onChange = (event) => {
    const userInput = event.target.value;
    setInputValue(userInput);

    // WHEN NO INPUT = NO SUGGESTIONS
    if (!userInput) {

      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // FILTER SUGGESTIONS THAT MATCH INPUT
    const searchMatches = moods.filter((letter) => {
      // use the current userInput value and return the predicate
      return letter.toLowerCase().startsWith(userInput.toLowerCase())
    });

    setFilteredSuggestions(searchMatches);
    setActiveIndex(-1);
    setShowSuggestions(true);
  };


  const onKeyDown = (event) => {

    if (!showSuggestions) return; // IF SUGGESTIONS ARE NOT SHOWN, DO NOTHING

    if (event.key === "ArrowDown") {

      event.preventDefault();
      // WHEN PRESSING DOWN, INCREASE INDEX, WHEN REACHING END, GO TO START
      setActiveIndex((prevIndex) => (prevIndex < filteredSuggestions.length - 1) ? prevIndex + 1 : 0);
    }
    else if (event.key === "ArrowUp") {
      setActiveIndex((prevIndex) => (prevIndex > 0) ? prevIndex - 1 : filteredSuggestions.length - 1);

    }
    else if (event.key === "Enter") {

      event.preventDefault();

      // CHOOSING SUGGESTION
      if (activeIndex >= 0) {
        setInputValue(filteredSuggestions[activeIndex]);
        setShowSuggestions(false);
      }
    };
  }

  const onSelectionClick = (value) => {

    // WHEN CLICKING ON SUGGESTION
    setInputValue(value);
    setShowSuggestions(false);
  };



  return (
    <div className={styles.search}>

      <div className={styles.search_wrapper}>
        <div className={styles.search_bar}>
          <div className={styles.search_bar_ref} ref={wrapperRef}>

            <input
              className={styles.search_bar_input}
              placeholder="Search for category"
              type="text"
              value={inputValue}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />

            {showSuggestions && filteredSuggestions.length > 0 && (

              <div className={styles.autocomplete_items}>

                {filteredSuggestions.map((suggestion, index) => (

                  <div key={`${suggestion}-${index}`} className={(index !== activeIndex) ? styles.autocomplete_item : styles.autocomplete_active} onClick={() => onSelectionClick(suggestion)}>
                    <strong>{suggestion.substring(0, inputValue.length)}</strong>{suggestion.substring(inputValue.length)}
                  </div>

                ))}

              </div>

            )}
          </div>
          <div className={styles.search_btn}><SearchIcon className={styles.search_btn_icon} style={{ width: '1rem' }} /></div>
          <div className={styles.tag_count}><span>{count}/4</span></div>

        </div>
      </div>

      <div className={styles.tags}>
        <button className={styles.tag}>
          <p className={styles.tag_name}>soundtracks</p>
          <div className={styles.tag_close}>&#10006;</div>
        </button>
      </div>
    </div>
  )
}