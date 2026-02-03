import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Encapsulates search-bar + autocomplete state and behavior.
 * Does not know about selected moods or API; reports selection via onSelect(value).
 *
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
  const wrapperRef = useRef(null);

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

  const onChange = useCallback(
    (event) => {
      const userInput = event.target.value;
      setInputValue(userInput);

      if (!userInput) {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const searchMatches = moods.filter((letter) =>
        letter.toLowerCase().startsWith(userInput.toLowerCase())
      );
      setFilteredSuggestions(searchMatches);
      setActiveIndex(-1);
      setShowDropdown(true);
      setShowSuggestions(true);
    },
    [moods]
  );

  const applySelection = useCallback(
    (value) => {
      setInputValue(value);
      setShowSuggestions(false);
      onSelect?.(value);
    },
    [onSelect]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (!showSuggestions) return;

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
      }
    },
    [showSuggestions, filteredSuggestions, activeIndex, applySelection]
  );

  const onSuggestionClick = useCallback(
    (value) => {
      applySelection(value);
    },
    [applySelection]
  );

  return {
    inputValue,
    onChange,
    onKeyDown,
    wrapperRef,
    filteredSuggestions,
    showSuggestions,
    showDropdown,
    activeIndex,
    onSuggestionClick,
  };
}
