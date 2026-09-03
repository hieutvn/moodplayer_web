import { useEffect, useState } from "react";


export default function useAuth() {
    const [accessToken, setAccessToken] = useState(null);
    const [expiry, setExpiry] = useState(0);

    useEffect(() => {
        console.log("fetching token");

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
                console.log("Access Token:", response);

                const token = response.access_token.access_token;
                const expiresInSeconds = response.access_token.expires_in;

                setAccessToken(token);
                setExpiry(Date.now() + expiresInSeconds * 1000);

                if (accessToken && expiry) {
                    console.log("Access Token:", accessToken);
                    console.log("Expiry Time:", new Date(expiry).toLocaleString());
                }


            } catch (error) {
                console.error("Error fetching access token", error);
            }
            return accessToken;
        };

        fetchAccessToken()
            .catch(console.error);
    }, []);

    useEffect(() => {

        const expiresAt = expiry - Date.now() - 60_000;
        const requestRefreshToken = async () => {

            console.log("Refreshing access token...");

            try {
                const request = await fetch("http://127.0.0.1:3000/api/auth/refreshtoken", {
                    method: "POST",
                    credentials: "include",
                });

                const response = await request.json();

                if (!request.ok) {
                    if (request.status === 401) {
                        window.location.href = "/";
                        return;
                    }
                    console.error("Failed to refresh token", request.status);
                    return;
                }

                const { access_token, expires_in } = response;
                setAccessToken(access_token);
                setExpiry(Date.now() + expires_in * 1000);

            } catch (error) {
                console.error("Error refreshing token", error);
            }

            if (!accessToken || !expiry) return;

            const timer = setTimeout(async () => {
                requestRefreshToken();
                return () => clearTimeout(timer);
            }, expiresAt);

        }
    }, [accessToken, expiry]);

    return accessToken;
}