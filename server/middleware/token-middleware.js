export function attachToken(req, res, next) {
    const token = req.session.access_token;
    if (!token) {
        return res.status(401).json({ error: 'No access token' });
    }

    req.token = token;
    next();
}