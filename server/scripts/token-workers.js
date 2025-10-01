let token = null;
let token_refresh = null;
let tokenExpiry = null;

onmessage = function (event) {

    console.log(event);
    const { action, payload } = event.data;

    switch (action) {

        case 'setToken':
            token = payload;
            break;

        case 'getToken':
            this.postMessage({ action: 'token', token });
            break;

        case 'clearToken':
            this.postMessage({ action: 'tokenCleared' });
            break;

        default:
            console.error("Unknown action:", action);
    }
}