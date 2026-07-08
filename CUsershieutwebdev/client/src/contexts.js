import { createContext, useContext } from 'react';

export const PlayerContext = createContext(null);
export const PlaylistContext = createContext(null);


export function usePlayerContext() {
  const value = useContext(PlayerContext);
  if (value == null) {
    throw new Error('usePlayer must be used within a PlayerContext.Provider');
  }
  return value;
}

export function usePlaylistContext() {
  const value = useContext(PlaylistContext);
  if (value == null) {
    throw new Error('usePlaylist must be used within a PlaylistContext.Provider');
  }
  return value;
}