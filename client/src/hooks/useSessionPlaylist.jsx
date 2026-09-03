import { useMemo } from "react";

export default function useSessionPlaylist(keywords) {

    const getRecommanedPlaylist = async (keywords) => {

        if (!keywords || keywords.length === 0) return;

        try {
            const request = await fetch(`http://127.0.0.1:3000/api/recommend/createRecommendation`,
                {
                    method: 'GET',
                    headers: {
                        keywords: keywords,
                    },
                    credentials: 'include',
                }
            );
            if (!request.ok) { throw new Error('Failed to send moods', request.status) }

            const response = await request.json();
            console.log("sessionplaylist in hook", response)
            return response;

        }
        catch (error) {

            console.error('Error sending moods', error);
        }
    }

    const sessionPlaylist = useMemo(() => getRecommanedPlaylist(keywords), []);


    return { sessionPlaylist };
}