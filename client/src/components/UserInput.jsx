import { useState, useEffect, useCallback } from 'react';
import styles from '../assets/styles/userinput.module.css';
import genres from '../assets/genres.json';
import SearchIcon from '../assets/icons/search_btn.svg';
import { usePlayerContext, usePlaylistContext } from '../contexts.js';
import { useMoodAutocomplete } from '../hooks/useMoodAutocomplete.js';
import { submitMoods } from '../hooks/useMoodSubmit.js';


export default function UserInput() {
  const { accessToken } = usePlayerContext();
  const { setPlaylist } = usePlaylistContext();

  const [moods, setMoods] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);

  useEffect(() => {
    if (genres?.moods && Array.isArray(genres.moods)) {
      setMoods(genres.moods);
    }
  }, []);

  const onSelectMood = useCallback((value) => {
    setSelectedMoods((prev) => {
      if (prev.length >= 4 || prev.includes(value)) return prev;
      return [...prev, value];
    });
  }, []);

  const autocomplete = useMoodAutocomplete(moods, accessToken);

  const deleteSelectedMood = (index) => {
    setSelectedMoods((prev) => prev.filter((_, i) => i !== index));
  };

  const {
    inputValue,
    onChange,
    onFocus,
    onKeyDown,
    wrapperRef,
    filteredSuggestions,
    showDropdown,
    activeIndex,
    onSuggestionClick,
  } = autocomplete;

  if (!moods.length) {
    return <h1>Loading moods.</h1>;
  }

  return (
    <div className={styles.search}>
      <div className={styles.search_wrapper} ref={wrapperRef}>
        <div className={styles.search_bar}>
          <div className={styles.search_bar_ref}>
            <input
              className={styles.search_bar_input}
              placeholder="Search for album or mood"
              type="text"
              value={inputValue}
              onChange={onChange}
              onFocus={onFocus}
              onKeyDown={onKeyDown}

            />
          </div>
          <div className={styles.search_btn}>
            <SearchIcon
              className={styles.search_btn_icon}
              style={{ width: '1rem' }}
            />
          </div>
          <button
            className={styles.play_btn}
            onClick={async () => {
              // clear any previously‑loaded albums before new search
              setPlaylist([]);
              await submitMoods(selectedMoods, accessToken);
              // optionally fetch the new playlist immediately so the UI updates
              // you could also let Player's "Add album" button handle this
              const res = await fetch('http://127.0.0.1:3000/api/search/getplaylist', {
                method: 'GET',
                credentials: 'include',
              });
              if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.playlist)) setPlaylist(data.playlist);
              }
            }}
          >
            Search
          </button>
          <div className={styles.tag_count}>
            <span>{selectedMoods.length}/4</span>
          </div>
        </div>

        {showDropdown && (
          <div className={styles.dropdown}>
            <div className={styles.dropdown_suggestions}>
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion}-${index}`}
                    className={
                      index !== activeIndex
                        ? styles.autocomplete_item
                        : styles.autocomplete_active
                    }
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    <strong>
                      {suggestion.substring(0, inputValue.length)}
                    </strong>
                    {suggestion.substring(inputValue.length)}
                  </div>
                ))
              ) : (
                <div className={styles.dropdown_empty}>
                  No matching moods
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.tags}>
        {selectedMoods.map((item, index) => (
          <button key={index} className={styles.tag}>
            <p className={styles.tag_name}>{item}</p>
            <div
              className={styles.tag_close}
              onClick={() => deleteSelectedMood(index)}
            >
              &#10006;
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
