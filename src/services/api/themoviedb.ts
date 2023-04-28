import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL, TMDB_API_KEY } from '../../constants/config'
import { IGetGenresListResponse } from '../../types/settings'

interface IGetDiscoverPayload {
  sortBy: string
  genresIds: number[]
  year?: number
  runtimeFrom?: number
  runtimeTo?: number
  page: number
}

export interface IDiscoverItem {
  id: number
  original_title: string
  genre_ids: number[]
  vote_average: number
  release_date: string
  poster_path: string | null
}

interface IGetDiscoverResponse {
  page: number
  total_pages: number
  total_results: number
  results: IDiscoverItem[]
}

export const theMovieDBApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (build) => ({
    getGenresList: build.query<IGetGenresListResponse, void>({
      query: () => ({
        url: '/genre/movie/list',
        method: 'GET',
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US'
        }
      })
    }),
    getDiscover: build.query<IGetDiscoverResponse, IGetDiscoverPayload>({
      query: (payload) => ({
        url: '/discover/movie',
        method: 'GET',
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          with_watch_monetization_types: 'flatrate',
          sort_by: payload.sortBy,
          with_genres:
            payload.genresIds.length === 0
              ? undefined
              : payload.genresIds.join(),
          year: payload.year,
          'with_runtime.gte': payload.runtimeFrom,
          'with_runtime.lte': payload.runtimeTo,
          page: payload.page
        }
      })
    })
  })
})

export const { useGetGenresListQuery, useGetDiscoverQuery } = theMovieDBApi
