import { Middleware, combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { appReducer } from './app'
import { theMovieDBApi } from '../api'
import { persistReducer, persistStore } from 'redux-persist'

const rootReducer = combineReducers({
  app: appReducer,
  [theMovieDBApi.reducerPath]: theMovieDBApi.reducer
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: [theMovieDBApi.reducerPath]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware: Middleware[] = []

middleware.push(theMovieDBApi.middleware)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(middleware)
})

export const persistor = persistStore(store);

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
