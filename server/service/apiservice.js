const baseURL = 'https://api.spotify.com/v1';

export async function callAPI(endpoint, method, options = {}) {

    try {
        const fetchReq = await fetch(`${this.baseURL}${endpoint}`, {

            method: method,
            headers: { Authorization: 'Bearer ' + `${token}`, ...options.headers },
            ...options
        });

        if (!fetchReq.ok) throw new Error(`FETCH REQUEST ERROR: ${fetchReq.status}`);

        return fetchReq.json;

    }
    catch (error) {

        console.error("FETCH REQUEST FAILED: ", error)
        return fetchReq.status(500);
    }
}