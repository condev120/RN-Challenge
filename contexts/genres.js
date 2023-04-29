import { createContext, useCallback, useEffect, useReducer } from "react"
import { getGenresMovie } from "../services/movies.service";

export const GenreContext = createContext({});

const INITIAL_STATE = {
  genres: [],
};

const reducer = (state, action) => {
  switch(action.type) {
    case "GENRES": {
      return {
        ...state,
        genres: action.payload,
      }
    }
    default: {
      return {
        ...INITIAL_STATE,
      }
    }
  }
}
export const GenreProvider = ({children}) => {
  const [genreState, genreDispatch] = useReducer(reducer, INITIAL_STATE);
  const onGetGenres = useCallback(async () => {
    try {
      const {genres} = await getGenresMovie();
      genreDispatch({
        type: 'GENRES',
        payload: genres,
      })
    } catch(e) {
      console.log(e);
    }
  },[])
  useEffect(()=> {
    onGetGenres();
  },[onGetGenres]);
return(
  <GenreContext.Provider value={{ genreState, genreDispatch }}>
    {children}
  </GenreContext.Provider>
)
}