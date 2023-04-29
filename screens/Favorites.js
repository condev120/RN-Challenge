import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View } from 'react-native'
import EmptyState from '../components/EmptyState'
import { MovieList } from '../components/MovieList';
import { containerStyles } from '../lib/styles'
import { localService } from '../services/local.service';

export default function Favorites({ navigation }) {
  const {getObjectItem} = localService;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasMovies = !!movies.length;
  const onGetFavoriteMovies = useCallback(async() => {
    setLoading(true);
    const favoriteMovies = await getObjectItem('favoriteMovies') ?? [];
    setMovies(favoriteMovies);
    setLoading(false);
  },[getObjectItem])

  useFocusEffect(useCallback(() => {onGetFavoriteMovies()},[onGetFavoriteMovies]))
  return (
    <View style={containerStyles}>
      {!hasMovies ? (
      <EmptyState
        image={require('../assets/empty-favorites.jpg')}
        title="You haven't liked any movie yet"
        message="Why not try to find a movie you like?"
        actionLabel="Go to Discover"
        onAction={() => navigation.navigate('Discover')}
      />
      ):(
        <MovieList movies={movies} favoriteMovies={movies} full={false} loading={loading} onRefresh={onGetFavoriteMovies} onFavoriteRefresh={onGetFavoriteMovies}/>
      )}
    </View>
  )
}
