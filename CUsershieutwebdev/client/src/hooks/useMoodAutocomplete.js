
import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import { usePlayerContext } from '../contexts.js';

/**
 * @param {string[]} moods - List of mood strings to filter against
 * @param {function(value: string): void} onSelect - Called when user picks a suggestion (click or Enter)
 * @returns Props and handlers for the search input and dropdown
 */
export function useMoodAutocomplete(moods, onSelect) {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestAlbums, setSuggestAlbums] = useState([]);

  const wrapperRef = useRef(null);
  const inputValueRef = useRef('');
  const suggestionTimerRef = useRef(null);

  const { accessToken } = usePlayerContext();


  inputValueRef.current = inputValue;

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowDropdown(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const apiReq = useCallback((userInput) => {
    apiSuggestion(userInput, accessToken, suggestionTimerRef, setSuggestAlbums);
  }, [accessToken, suggestionTimerRef, setSuggestAlbums])

  const getSuggestionsForInput = useCallback((userInput) => {
    if (!userInput.trim()) {

      return moods.slice(0, 50);
    }

    return moods.filter((letter) =>
      letter.toLowerCase().startsWith(userInput.toLowerCase())
    );
  }, [moods, accessToken]);

  const onFocus = useCallback(() => {

    const val = inputValueRef.current;

    setFilteredSuggestions(getSuggestionsForInput(val));
    setActiveIndex(-1);
    setShowDropdown(true);
    setShowSuggestions(true);
  }, [getSuggestionsForInput]);

  const onChange = useCallback((event) => {

    const userInput = event.target.value;
    setInputValue(userInput);

    const matches = getSuggestionsForInput(userInput);
    setFilteredSuggestions(matches);
    setActiveIndex(-1);
    setShowDropdown(true);
    setShowSuggestions(true);

    apiReq(userInput);
  },
    [getSuggestionsForInput, apiReq]
  );

  const applySelection = useCallback((value) => {
    setInputValue('');
    setShowSuggestions(false);
    setShowDropdown(false);
    onSelect(value);

  }, [onSelect]);

  const onKeyDown = useCallback((event) => {
    if (!showDropdown) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
        applySelection(filteredSuggestions[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      setShowDropdown(false);
      setShowSuggestions(false);
    }

  }, [showDropdown, filteredSuggestions, activeIndex, applySelection]);

  const onSuggestionClick = useCallback((value) => {
    applySelection(value);

  }, [applySelection]);

  return {
    inputValue,
    onChange,
    onFocus,
    onKeyDown,
    wrapperRef,
    filteredSuggestions,
    showSuggestions,
    showDropdown,
    activeIndex,
    onSuggestionClick,
    suggestAlbums
  };
}



async function apiSuggestion(userInput, accessToken, timerRef, setSuggestAlbums) {

  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }

  timerRef.current = setTimeout(async () => {
    try {
      const request = await fetch(`http://127.0.0.1:3000/api/search/url`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'access_token': `${accessToken}`,
          'moods': `${userInput}`
        }
      });

      const response = await request.json();
      console.log("search resp", response);
      setSuggestAlbums(response);
    } catch (error) {
      console.error(error);
    }
  }, 1000);
}