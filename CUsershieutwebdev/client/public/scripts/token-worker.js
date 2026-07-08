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


/*
    useEffect(() => {

        tokenWorkerRef.current = new Worker('/scripts/token-worker.js', { type: "module" });

        function setToken() { tokenWorkerRef.current.postMessage({ action: 'setToken', payload: token }) }
        function getToken() {

            return new Promise((resolve, reject) => {

                tokenWorkerRef.current.onmessage = function (event) {

                    if (event.data.action === 'token') resolve(event.data.token);
                    else if (event.data.action === 'tokenExpired') reject("Token has expired.");
                }
                tokenWorkerRef.current.postMessage({ action: 'getToken' });
            });
        }
        function clearToken() { tokenWorkerRef.current.postMessage({ action: "clearToken" }) }

        //return () => { console.log("Worker terminated"); tokenWorkerRef.current.terminate() } --> UNMOUNT ALTERNATIVE
    }, []);
*/