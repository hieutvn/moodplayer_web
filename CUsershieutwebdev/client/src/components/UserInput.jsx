import { useState, useEffect, useCallback } from "react";
import styles from "../assets/styles/userinput.module.css";
import genres from "../assets/genres.json";
import SearchIcon from "../assets/icons/search_btn.svg";
import HistoryIcon from "../assets/icons/history.svg";
import { usePlayerContext, usePlaylistContext } from "../contexts.js";
import { useMoodAutocomplete } from "../hooks/useMoodAutocomplete.js";
import { submitMoods } from "../hooks/useMoodSubmit.js";

export default function UserInput() {
  const { accessToken } = usePlayerContext();
  const { playlistRef } = usePlaylistContext();

  const [moods, setMoods] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [fetchedAlbumSuggestions, setFetchedAlbumSuggestions] = useState([]);
  const [overlay, setOverlay] = useState({
    show: false,
    message: "",
    color: "",
  });
  const [activeButton, setActiveButton] = useState(null);

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

  const showOverlayMessage = (message, color) => {
    setOverlay({ show: true, message, color });
    setTimeout(() => setOverlay({ show: false, message: "", color: "" }), 3000);
  };

  const handleSearch = async () => {
    setActiveButton("search");
    try {
      const submitRequest = await submitMoods(selectedMoods, accessToken);
      if (!submitRequest) {
        showOverlayMessage("sending moods failed", "red");
        return;
      }
      showOverlayMessage("sending moods successfully", "green");

      const playlist = submitRequest?.playlist ?? [];

      playlistRef.current = playlist;
      let desc_tags = "";
      selectedMoods.map((tag) => {
        desc_tags.concat(tag);
      });
      if (typeof window !== "undefined") {
        /* window.sessionStorage.setItem(
          `moodplayer_playlist ${desc_tags}`,
          JSON.stringify(playlist),
        ); */
      }
    } catch (error) {
      showOverlayMessage("sending moods failed", "red");
    }
  };

  const handleRefresh = () => {
    setActiveButton("refresh");
    setSelectedMoods([]);
    showOverlayMessage("session cleared", "green");
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
    suggestAlbums,
  } = autocomplete;

  useEffect(() => {
    if (inputValue.trim() && suggestAlbums.albums) {
      const newAlbums = suggestAlbums.albums.map((album) => ({
        name: album.name,
        artist: album.artists.map((a) => a.name),
        img: album.images?.[2].url || "#",
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
        <div className={styles.search_wrapper_top}>
          <p>Current Session</p>
          <button
            type="button"
            className={
              selectedMoods.length <= 0
                ? `${styles.search_btn}`
                : `${styles.search_btn} ${styles.searchable}`
            }
            onClick={handleSearch}
          >
            Search
          </button>
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

        <div className={styles.search_bar}>
          <div
            className={
              activeButton === "search"
                ? `${styles.search_bar_ref} ${styles.on}`
                : `${styles.search_bar_ref}`
            }
          >
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
          <div className={styles.action_buttons}>
            <button
              className={
                activeButton === "search"
                  ? `${styles.icon_button} ${styles.active}`
                  : `${styles.icon_button}`
              }
              type="button"
              onClick={() => setActiveButton("search")}
            >
              <SearchIcon
                className={
                  activeButton === "search"
                    ? `${styles.icon_active}`
                    : `${styles.icon}`
                }
              />
            </button>
            <button
              className={
                activeButton === "history"
                  ? `${styles.icon_button} ${styles.active}`
                  : `${styles.icon_button}`
              }
              type="button"
              onClick={() => setActiveButton("history")}
            >
              <HistoryIcon
                className={
                  activeButton === "history"
                    ? `${styles.icon_active}`
                    : `${styles.icon}`
                }
              />
            </button>
          </div>
        </div>

        <div style={{ position: "relative", width: "100%" }}>
          <hr
            style={{
              width: "100%",
              border: "1px solid #ccc",
              margin: "10px 0",
            }}
          />
          {overlay.show && (
            <div className={styles.overlay} style={{ color: overlay.color }}>
              {overlay.message}
            </div>
          )}
        </div>
      </div>

      <p style={{ color: "white" }}>Search</p>

      {showDropdown && activeButton === "search" && (
        <div className={styles.dropdown}>
          <div className={styles.dropdown_suggestions}>
            {filteredSuggestions.length > 0 ||
            fetchedAlbumSuggestions.length > 0 ? (
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
                  <div
                    key={`album-${index}`}
                    className={styles.autocomplete_item}
                    onClick={() => onSuggestionClick(album.name)}
                  >
                    <img
                      className={styles.autocomplete_item_img}
                      src={album.img}
                    />
                    <p>
                      {album.name} by {album.artist.join(", ")}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <div className={styles.dropdown_empty}>No matching moods</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
