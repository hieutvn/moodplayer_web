/**
 * Validates the Spotify access token from the cookie by calling Spotify's API.
 * If the token is missing or invalid/expired, responds with 401 so the client can refresh or re-login.
 */
export async function authenticateAccess(req, res, next) {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ error: "No access token" });
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            if (response.status === 401) {
                return res.status(401).json({
                    error: "Access token expired or invalid",
                    code: "TOKEN_EXPIRED",
                });
            }
            return res.status(response.status).json({
                error: "Token validation failed",
            });
        }

        const user = await response.json();
        req.user = user;
        req.accessToken = token;
        next();
    } catch (error) {
        console.error("Token validation error:", error);
        return res.status(503).json({
            error: "Unable to validate token",
        });
    }
}