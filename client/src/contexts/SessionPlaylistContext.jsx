import { createContext, useContext } from "react";
import useWebPlayer from "../hooks/useWebPlayer.jsx";

const SessionPlaylistContext = createContext(null);

export function SessionPlaylistProvider({ accessToken, children }) {
    const playlistState = useWebPlayer(accessToken);
    return (
        <SessionPlaylistContext.Provider value={playlistState}>
            {children}
        </SessionPlaylistContext.Provider>
    );
}

export function useSessionPlaylistContext() {
    return useContext(SessionPlaylistContext);
}