import { createContext, useEffect, useState, useContext } from "react";
import { PlaylistProvider } from "./PlaylistContext";

const LoadingContext = createContext(null);

function LoadingProvider({ children }) {

    const stages = ['Analyzing tags…', 'Finding matching tracks…', 'Curating your playlist…'];

    const [status, setStatus] = useState('idle');
    const [stageIndex, setStageIndex] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (status !== "loading") return;
        setStageIndex(0);

        const interval = setInterval(() => {

            setStageIndex((prev) => Math.min(prev + 1), stages.length - 1);

        }, 1800);
        return () => clearInterval(interval);
    }, [status]);

    const checkSuccess = (toCheck) => {
        setStatus('loading');
        setError(null);

        if (toCheck === 'success') {

            setStatus('success');
            setError(null);
        }
        else if (toCheck === 'error') {

            setStatus('error');
            setError('Cannot create playlist.');
        }
    }

    return (
        <LoadingContext.Provider value={{ status, stageMessage: stages[stageIndex], result, error, checkSuccess }}>

            {children}
        </LoadingContext.Provider>
    )
}

function useLoadingContext() {

    return useContext(LoadingContext);
}

export { LoadingProvider, useLoadingContext }