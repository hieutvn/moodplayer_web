import { createContext, useContext } from "react";
import useAuth from "../hooks/useAuth.jsx";

const AccessTokenContext = createContext(null);

export function AccessTokenProvider({ children }) {
  const accessTokenState = useAuth();
  return (
    <AccessTokenContext.Provider value={accessTokenState}>
      {children}
    </AccessTokenContext.Provider>
  );
}

export function useAccessTokenContext() {
  return useContext(AccessTokenContext);
}