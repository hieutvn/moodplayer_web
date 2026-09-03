import { createContext, useContext } from "react";
import useWebPlayer from "../hooks/useWebPlayer.jsx";

const WebPlayerContext = createContext(null);

export function WebPlayerProvider({ accessToken, children }) {
  const playerState = useWebPlayer(accessToken);
  return (
    <WebPlayerContext.Provider value={playerState}>
      {children}
    </WebPlayerContext.Provider>
  );
}

export function useWebPlayerContext() {
  return useContext(WebPlayerContext);
}