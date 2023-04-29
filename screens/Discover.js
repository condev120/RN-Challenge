import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import EmptyState from '../components/EmptyState'
import { MovieList } from '../components/MovieList';
import { GenreContext } from '../contexts/genres';
import { colors, containerStyles, sizes } from '../lib/styles'
import { localService } from '../services/local.service';
import { getDiscoverMovie } from '../services/movies.service';

export default function Discover({ navigation }) {
  
  const {genreState} = useContext(GenreContext);
  const genres= genreState.genres;
  const {getObjectItem} = localService;
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const hasMovies = !!movies.length;
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [filterState, setFilterState] = useState({
    sort_by: 'popularity.desc',
    with_genres: [],
    year: null,
    "with_runtime.gte": null,
    "with_runtime.lte": null,
  })
  const onGetDiscoverMovie = useCallback(async (params) => {
    setLoading(true);
    try {
      const favoriteMovies = await getObjectItem('favoriteMovies') ?? [];
      setFavoriteMovies(favoriteMovies);
      const data = await getDiscoverMovie({...params, with_genres: params?.with_genres?.toString()});
      const movies = data?.results.map( movie => ({
        ...movie,
        genres: movie.genre_ids?.map( id => {
          const genre = genres.find( g => g.id  === id)
          return genre.name;
        }) 
      }));
      
      setMovies(movies);
      setLoading(false);
    } catch(e) {
      setMovies([]);
      setLoading(false);
    }
  },[genres, getObjectItem]);

  useFocusEffect(useCallback(() => {
    onGetDiscoverMovie(filterState);
  },[filterState, onGetDiscoverMovie]));

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          testID='SettingButton'
          style={styles.button}
          onPress={() => navigation.navigate('Settings', {
            filterState,
            setState: setFilterState
          })}
        >
          <Icon name="options-outline" size={sizes.xxl} color={colors.black} />
        </TouchableOpacity>
      ),
    })
  },[navigation, filterState]);

  return (
    <View style={containerStyles}>
      {!hasMovies ? (
      <EmptyState
        image={require('../assets/empty-discover.jpg')}
        title="No results found"
        message="Try adjusting the settings"
        actionLabel="Go to Settings"
        onAction={() => navigation.navigate('Settings')}
      />
      ):(
        <MovieList movies={movies} favoriteMovies={favoriteMovies} full={true} loading={loading} onRefresh={() => onGetDiscoverMovie()}/>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 5
  }
})