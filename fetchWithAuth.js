import { getCookie } from "cookies-next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchWithAuth(url, options) {
  const authToken = getCookie('authToken');
  const headers = {
    Authorization: `Bearer ${authToken}`,
	"Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${apiBaseUrl}/api/${url}`, { ...options, headers });
	if( response.status === 200 ){
		return response.json();
	}
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export default fetchWithAuth;