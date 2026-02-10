import { useState, useEffect, useCallback } from 'react';
import styles from '../assets/styles/userinput.module.css';
import genres from '../assets/genres.json';
import SearchIcon from '../assets/icons/search_btn.svg';
import { usePlayer } from '../contexts.js';
import { useMoodAutocomplete } from '../hooks/useMoodAutocomplete.js';
import { submitMoods } from '../hooks/useMoodSubmit.js';

export default function UserInput() {
  const { accessToken } = usePlayer();

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

  const autocomplete = useMoodAutocomplete(moods, onSelectMood);

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
              placeholder="Search for category"
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
          <button className={styles.play_btn} onClick={
            () => submitMoods(selectedMoods, accessToken)}
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
