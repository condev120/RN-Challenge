import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { MovieCard } from "./MovieCard";

export const MovieList = ({movies, full, loading, favoriteMovies, onRefresh, onFavoriteRefresh}) => (
  <FlatList
    testID="MovieList"
    refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
    numColumns={full ? 1 : 2}
    data={movies}
    keyExtractor={(item) => item?.id}
    renderItem={({item}) => <MovieCard full={full} favoriteMovies={favoriteMovies} onRefresh={onRefresh} onFavoriteRefresh={onFavoriteRefresh} {...item}/>}
    contentContainerStyle={styles.contentContainer}
    columnWrapperStyle={!full && styles.contentContainerFull}
  />
);
const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },
  contentContainerFull: {
    flex: 1,
    justifyContent: 'space-between',
  },
})