import { useState, useRef, useEffect, useCallback, useContext } from 'react';

import styles from '../assets/styles/search.module.css';
import genres from '../assets/genres.json';

import SearchIcon from '../assets/icons/search_btn.svg';

import { TokenContext } from "./App";


export default function Search() {

  const { accessTokenState } = useContext(TokenContext);

  const [count, setCount] = useState(0);
  const [moods, setMoods] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  ///

  function useDebounce(value, delay) {

    const [debounced, setDebounced] = useState(value);

    useEffect(() => {

      const handler = setTimeout(() => { setDebounced(value) }, delay);
      return () => clearTimeout(handler);
    }, [value]);

    return debounced;
  }

  ///


  useEffect(() => {

    for (const mood in genres) {

      setMoods(genres[mood])

    }
  }, []);

  const debounceQuery = useDebounce(inputValue, 1000);

  const sendMoodList = useCallback(async () => {

    if (selectedMoods.length > 0) {

      const request = await fetch(`http://127.0.0.1:3000/api/search/url?input=${debounceQuery}&type=album`, {

        method: 'GET',
        headers: {

          token: accessTokenState,
          moods: selectedMoods,
        }
      })
      const response = await request.json();

    }

  }, [selectedMoods, debounceQuery])

  useEffect(() => {

    console.log("send moods to server")
    sendMoodList()
  }, [sendMoodList])

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

    if (selectedMoods.length < 4 && !selectedMoods.includes(value)) { setSelectedMoods(prev => [...prev, value]); }
  }

  const deleteSelectedMood = (value) => { setSelectedMoods(prev => prev.filter((_, i) => i !== value)); };

  if (!moods) {
    return (<h1>Loading moods.</h1>)
  }
  else if (moods) {
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
            <div className={styles.tag_count}><span>{selectedMoods.length}/4</span></div>

          </div>
        </div>
        <div className={styles.tags}>
          {
            selectedMoods.map((item, index) => {

              return (
                <button key={index} className={styles.tag}>
                  <p className={styles.tag_name}>{item}</p>
                  <div className={styles.tag_close} onClick={() => deleteSelectedMood(index)}>&#10006;</div>
                </button>
              )
            })
          }
        </div>
      </div>
    )
  }
}