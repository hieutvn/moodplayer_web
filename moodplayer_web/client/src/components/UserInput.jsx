import { useState, useEffect, useCallback } from 'react';
import styles from '../assets/styles/userinput.module.css';
import genres from '../assets/genres.json';
import SearchIcon from '../assets/icons/search_btn.svg';
import { usePlayerContext, usePlaylistContext } from '../contexts.js';
import { useMoodAutocomplete } from '../hooks/useMoodAutocomplete.js';
import { submitMoods } from '../hooks/useMoodSubmit.js';


export default function UserInput() {
  const { accessToken } = usePlayerContext();
  const { sessionPlaylist, setSessionPlaylist } = usePlayerContext();

  const [moods, setMoods] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [fetchedAlbumSuggestions, setFetchedAlbumSuggestions] = useState([]);
  const [overlay, setOverlay] = useState({ show: false, message: '', color: '' });

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

  const handleSearch = async () => {
    try {
      const submitRequest = await submitMoods(selectedMoods, accessToken);
      if (!submitRequest) {
        setOverlay({ show: true, message: 'sending moods failed', color: 'red' });
      }
      setOverlay({ show: true, message: 'sending moods successfully', color: 'green' });
      setSessionPlaylist(submitRequest.data)
    } catch (error) {
      setOverlay({ show: true, message: 'sending moods failed', color: 'red' });
    }
    setTimeout(() => setOverlay({ show: false, message: '', color: '' }), 3000);
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
    suggestAlbums
  } = autocomplete;


  useEffect(() => {
    if (inputValue.trim() && suggestAlbums.albums) {
      const newAlbums = suggestAlbums.albums.map((album) => ({
        name: album.name,
        artist: album.artists.map((a) => a.name),
        img: album.images?.[2].url || "#"
      }));
      setFetchedAlbumSuggestions([...newAlbums]);
    }
  }, [suggestAlbums, inputValue]);


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
            onClick={handleSearch}
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
              {
                (filteredSuggestions.length > 0 || fetchedAlbumSuggestions.length > 0) ? (
                  <>
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={`${suggestion}-${index}`}
                        className={
                          index !== activeIndex
                            ? styles.autocomplete_item
                            : styles.autocomplete_active
                        }
                        onClick={() => onSuggestionClick(suggestion)}
                      >
                        <p>
                          <strong>
                            {suggestion.substring(0, inputValue.length)}
                          </strong>
                          {suggestion.substring(inputValue.length)}
                        </p>
                      </div>
                    ))}
                    {fetchedAlbumSuggestions.map((album, index) => (
                      <div key={`album-${index}`} className={styles.autocomplete_item}
                        onClick={() => onSuggestionClick(album.name)}>
                        <img className={styles.autocomplete_item_img} src={album.img} />
                        <p>{album.name} by {album.artist.join(', ')}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className={styles.dropdown_empty}>
                    No matching moods
                  </div>
                )
              }
            </div>
          </div>
        )}

        {overlay.show && (
          <div className={styles.overlay} style={{ color: overlay.color }}>
            {overlay.message}
          </div>
        )}

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
    </div>
  );
}
