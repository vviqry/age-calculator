import axios from 'axios';

const wikiApi = axios.create({
  baseURL: 'https://en.wikipedia.org/api/rest_v1/feed/onthisday',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
}); 

// Interceptor untuk handle response error secara global
wikiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Ambil fakta sejarah berdasarkan bulan & hari
// Endpoint: /events/{MM}/{DD}
export const getHistoricalEvents = async (month: number, day: number) => {
  const response = await wikiApi.get(`/events/${month}/${day}`);
  return response.data;
};

export default wikiApi;