import apiService from "./http.service";

export const getGenresMovie = async () => {
  try {
    const {data} = await apiService.get('/genre/movie/list');
    return data;
  }
  catch (e) {
    throw e?.message;
  }
}

export const getDiscoverMovie = async (params) => {
  try {
    const {data} = await apiService.get('/discover/movie', {params});
    return data;
  }
  catch (e) {
    throw e?.message;
  }
}