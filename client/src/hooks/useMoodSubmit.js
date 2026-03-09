import { useConfirmation } from '../hooks/useConfirmation.js';



export async function submitMoods(selectedMoods, accessToken) {

  if (!accessToken || !selectedMoods.length) return;

  try {
    const request = await fetch(`http://127.0.0.1:3000/api/search/url?type=album`,
      {
        method: 'GET',
        headers: {
          token: accessToken,
          moods: selectedMoods.join(','),
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

const fetchCurrentPlaylist = async () => {

  try {

    const request = await fetch("http://127.0.0.1:3000/api/search/getplaylist", {
      method: "GET",
      credentials: "include",
    });

    const data = await request.json();
    console.log(data)

  }
  catch (error) { console.error(error) }
};