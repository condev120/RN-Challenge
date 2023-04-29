import axios from 'axios';

const apiService = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: "API KEY"
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  timeout: 1000 * 30,
});

export default apiService;