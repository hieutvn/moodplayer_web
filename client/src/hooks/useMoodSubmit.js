import { useConfirmation } from '../hooks/useConfirmation.js';



export async function submitMoods(selectedMoods, accessToken) {

  if (!accessToken || !selectedMoods.length) return;

  try {
    const request = await fetch(`http://127.0.0.1:3000/api/search/getplaylist`,
      {
        method: 'GET',
        headers: {
          access_token: accessToken,
          moods: JSON.stringify(selectedMoods),
        },
        credentials: 'include',
      }
    );
    if (!request.ok) { throw new Error('Failed to send moods', request.status) }

    const response = await request.json();

    return response;

  } catch (error) {
    console.error('Error sending moods', error);
  }
}

export async function requestRecommendations(selectedMoods, accessToken) {

  if (!accessToken || !selectedMoods.length) return;

  try {
    const request = await fetch(`http://127.0.0.1:3000/api/recommend/createRecommendation`,
      {
        method: 'GET',
        headers: {
          access_token: accessToken,
          keywords: JSON.stringify(selectedMoods),
        },
        credentials: 'include',
      }
    );
    if (!request.ok) { throw new Error('Failed to send moods', request.status) }

    const response = await request.json();

    console.log("req recommands", response)

  } catch (error) {
    console.error('Error sending moods', error);
  }
}

export async function test(selectedMood, accessToken) {

  console.log("sending")
  if (!accessToken || !selectedMoods.length) {
    console.log("failed")
    return;
  }

  try {
    const request = await fetch("http://127.0.0.1:3000/api/recommend/lastfm",
      {
        method: 'GET',
        headers: {
          access_token: accessToken,
          moods: JSON.stringify(selectedMoods),
        },
        credentials: 'include',

      }
    );

    if (!request.ok) { throw new Error('Failed to send moods', request.status) }

    const response = await request.json();

    return response;
  }
  catch (error) {
    console.error(error);
  }

}
