import axios from 'axios';

const apiService = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: "56b834fa12e2cc54095921beb5543483"
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  timeout: 1000 * 30,
});

export default apiService;