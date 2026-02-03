import { createContext, useContext } from 'react';

/**
 * Single source of truth for player and auth state.
 * Use usePlayer() in components instead of accessing the context directly.
 */
export const PlayerContext = createContext(null);

/**
 * Hook to access player/auth state. Use this in any component that needs
 * current song, album, token, device, or web player instance.
 * @throws {Error} if used outside PlayerContext.Provider
 */
export function usePlayer() {
  const value = useContext(PlayerContext);
  if (value == null) {
    throw new Error('usePlayer must be used within a PlayerContext.Provider');
  }
  return value;
}

export default PlayerContext;
