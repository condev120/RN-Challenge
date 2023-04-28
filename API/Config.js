import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_KEY, API_URL, EndPoints } from "./Constants"
import Fetch from "./Fetch"


export const handleGetMovies = async (page) => {

    try {
        const response = await Fetch.get(
            `${API_URL}${EndPoints.AllMovies}?api_key=${API_KEY}&page=${page}`,
            'GetMovies',
        )
        // console.log({ response });
        // return
        const movies = response.results
        let favorites = await AsyncStorage.getItem('movies')
        for (let i = 0; i < movies.length; i++) {
            const movieId = movies[i].id;
            let genreNames = await handleGetMovieDetails(movieId);
            movies[i].genres = genreNames;
            movies[i].isFavorite = false;
        }
        movies.forEach((item, index) => {
            if (favorites) {
                const localItemIndex = favorites.indexOf(item.id);
                if (localItemIndex !== -1) {
                    // If the item is present in the local storage array, modify its data in the main array
                    movies[index].isFavorite = true;
                }
            }
        });
        return {
            movies: movies,
            current: response.page,
            totalPages: response.total_pages
        }
    } catch (e) {
        console.log(e);
        throw e
    }

}

export const handleGetMovieDetails = async (id) => {

    try {
        const response = await Fetch.get(
            `${API_URL}${EndPoints.MovieDetails}${id}?api_key=${API_KEY}`,
            'GetMovieDetails',
        )
        const genreNames = response.genres.map(genre => genre.name).join(', ');
        return genreNames
    } catch (e) {
        console.log(e);
        throw e
    }

}

export const handleGetFilteredMovies = async (page) => {

    let genres = await AsyncStorage.getItem('genresIds')
    let sortBy = await AsyncStorage.getItem('sort')
    let year = await AsyncStorage.getItem('year')
    let from = await AsyncStorage.getItem('from')
    let to = await AsyncStorage.getItem('to')
    let finalUrl = ''

    if (sortBy == 'primary_release_date.lte') {
        if (from && to) {
            finalUrl = `${API_URL}${EndPoints.AllMovies}?api_key=${API_KEY}&page=${page}&with_genres=${genres}&year=${year}&primary_release_date.lte=2023-04-08&with_runtime.gte=${from}&with_runtime.lte=${to}`
        } else {
            finalUrl = `${API_URL}${EndPoints.AllMovies}?api_key=${API_KEY}&page=${page}&with_genres=${genres}&year=${year}&primary_release_date.lte=2023-04-08`
        }
    } else {
        if (from && to) {
            finalUrl = `${API_URL}${EndPoints.AllMovies}?api_key=${API_KEY}&page=${page}&with_genres=${genres}&year=${year}&sort_by=${sortBy}& with_runtime.gte=${from}& with_runtime.lte=${to}`
        } else {
            finalUrl = `${API_URL}${EndPoints.AllMovies}?api_key=${API_KEY}&page=${page}&with_genres=${genres}&year=${year}&sort_by=${sortBy}`
        }
    }
    console.log({ finalUrl });
    // return
    try {
        const response = await Fetch.get(
            finalUrl,
            'GetFilteredMovies',
        )
        const movies = response.results
        let favorites = await AsyncStorage.getItem('movies')
        for (let i = 0; i < movies.length; i++) {
            const movieId = movies[i].id;
            let genreNames = await handleGetMovieDetails(movieId);
            if (genreNames != '') {
                movies[i].genres = genreNames;
            }

            movies[i].isFavorite = false;
        }
        movies.forEach((item, index) => {
            if (favorites) {
                const localItemIndex = favorites.indexOf(item.id);
                if (localItemIndex !== -1) {
                    // If the item is present in the local storage array, modify its data in the main array
                    movies[index].isFavorite = true;
                }
            }
        });
        // await AsyncStorage.setItem('isFiltered', 'false')
        return {
            movies: movies,
            current: response.page,
            totalPages: response.total_pages
        }
    } catch (e) {
        console.log(e);
        throw e
    }

}

export const handleGetGenres = async () => {

    try {
        const response = await Fetch.get(
            `${API_URL}${EndPoints.Genres}?api_key=${API_KEY}&language=en-US`,
            'GetGenres',
        )
        await AsyncStorage.setItem('Genres', JSON.stringify(response.genres))
        return response.genres
    } catch (e) {
        console.log(e);
        throw e
    }

}