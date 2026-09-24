import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext(null);

export function PlaylistProvider({ children }) {
  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  return (
    <PlaylistContext.Provider value={{ currentPlaylist, setCurrentPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylistContext() {
  return useContext(PlaylistContext);
}