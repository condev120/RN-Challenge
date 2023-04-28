import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IDiscoverItem, theMovieDBApi } from '../api'
import { IGenreItem } from '../../types/settings'
import { sortByOptions } from '../../constants/data'

interface ISettings {
  genres: IGenreItem[]
  selectedGenresIds: number[]
  selectedSortBy: string
  year?: number
  runtimeFrom?: number
  runtimeTo?: number
  currentPage: number
}

interface IDiscover {
  items: IDiscoverItem[]
}

interface IFavorites {
  savedItems: IDiscoverItem[]
}

export interface AppState {
  settings: ISettings
  discover: IDiscover
  favorites: IFavorites
}

const initialState: AppState = {
  settings: {
    genres: [],
    selectedGenresIds: [],
    selectedSortBy: sortByOptions[0].id,
    currentPage: 1
  },
  discover: {
    items: []
  },
  favorites: {
    savedItems: []
  }
}

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    updateSettings: (
      state,
      action: PayloadAction<Omit<ISettings, 'genres'>>
    ) => {
      state.settings = { ...action.payload, genres: state.settings.genres }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.settings.currentPage = action.payload
    },
    saveDiscover: (state, action: PayloadAction<IDiscoverItem>) => {
      state.favorites.savedItems.push(action.payload)
    },
    unsaveDiscover: (state, action: PayloadAction<IDiscoverItem>) => {
      state.favorites.savedItems = state.favorites.savedItems.filter(
        (item) => item.id !== action.payload.id
      )
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      theMovieDBApi.endpoints.getGenresList.matchFulfilled,
      (state, { payload }) => {
        state.settings.genres = payload.genres
      }
    )
    builder.addMatcher(
      theMovieDBApi.endpoints.getDiscover.matchFulfilled,
      (state, { payload }) => {
        if (state.settings.currentPage === 1) {
          state.discover.items = payload.results
          return
        }

        state.discover.items.push(...payload.results)
      }
    )
  }
})

export const { updateSettings, saveDiscover, unsaveDiscover, setCurrentPage } =
  appSlice.actions
export const appReducer = appSlice.reducer
