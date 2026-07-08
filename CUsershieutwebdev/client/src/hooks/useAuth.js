import { useEffect, useState } from "react";

/**
 * Custom hook that handles acquiring and refreshing the auth access token.
 *
 * - On mount: fetches the current access token from the backend.
 * - While mounted: schedules a refresh shortly before the token expires.
 * - On hard auth failure (401 on refresh): redirects to the login/root page.
 */
export function useAuth() {
    const [accessTokenVal, setAccessToken] = useState(null);
    const [expiry, setExpiry] = useState(null);

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const request = await fetch("http://127.0.0.1:3000/api/auth/gettoken", {
                    credentials: "include",
                });

                if (request.status === 401) {
                    window.location.href = "/";
                    return;
                }

                if (!request.ok) throw new Error("No access token.");

                const response = await request.json();
                const token = response.access_token.access_token;
                const expiresInSeconds = response.access_token.expires_in;

                setAccessToken(token);
                setExpiry(Date.now() + expiresInSeconds * 1000);
            } catch (error) {
                console.error("Error fetching access token", error);
            }
        };

        fetchAccessToken()
            .catch(console.error);
    }, []);

    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                const request = await fetch("http://127.0.0.1:3000/api/auth/refreshtoken", {
                    method: "POST",
                    credentials: "include",
                });

                const response = await request.json();
                const { access_token, expires_in } = response;

                if (!request.ok) {
                    if (request.status === 401) {
                        window.location.href = "/";
                        return;
                    }
                    console.error("Failed to refresh token", request.status);
                    return;
                }

                setAccessToken(access_token);
                setExpiry(Date.now() + expires_in * 1000);
            } catch (error) {
                console.error("Error refreshing token", error);
            }
        };

        if (accessTokenVal === null || expiry === null) return;

        const timeNow = Date.now();
        const bufferMs = 30_000;
        const refreshIn = expiry - timeNow - bufferMs;
        const delay = Math.max(0, refreshIn);

        const timer = setTimeout(() => {
            refreshAccessToken();
        }, delay);

        return () => clearTimeout(timer);
    }, [accessTokenVal, expiry]);

    return { accessTokenVal };
}