let token = null;
let token_refresh = null;
let tokenExpiry = null;

onmessage = function (event) {

    console.log(event);
    const { action, payload } = event.data;

    switch (action) {

        case 'setToken':
            token = payload.token;
            tokenExpiry = payload.expiryTime;
            this.postMessage({ action: "setToken", token, expiryTime: tokenExpiry });
            break;

        case 'getToken':
            if (token && tokenExpiry && (Date.now() < tokenExpiry)) this.postMessage({ action: 'token', token });

            this.postMessage("Token expired.")
            break;

        case 'clearToken':

            token = null;
            tokenExpiry = null;
            this.postMessage({ action: 'tokenCleared' });
            break;

        default:
            console.error("Unknown action:", action);
    }
}