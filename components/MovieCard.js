import { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {  AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, sizes, textStyles } from "../lib/styles";
import { localService } from "../services/local.service";

const screenWidth = Dimensions.get('window').width;

const MovieRating = ({defaultRating}) => (
  <AirbnbRating
    type='custom'
    showRating={false}
    defaultRating={defaultRating/2}
    count={10/2}
    isDisabled={true}
    size={18}
    selectedColor={colors.primary}
    reviewColor={colors.primary}
    ratingContainerStyle={styles.rating}
  />
)

const MoviePoster = ({full, poster_path, id, title, favoriteMovies, onFavoriteRefresh}) => {
  const [favorite, setFavorite] = useState(false);
  const {saveItem, getObjectItem} = localService;
  const iconName = useMemo(() => favorite ? 'heart' : 'heart-outline', [favorite]);

  const onSetFavorite = useCallback(async(favorite) => {
    setFavorite(favorite);
    const favoriteMovies = await getObjectItem('favoriteMovies') ?? [];
    if(favorite) {
      favoriteMovies.push({id, poster_path, title});
      saveItem('favoriteMovies', JSON.stringify(favoriteMovies))
    } else {
      if(favoriteMovies) {
        const newFavoriteMovies = favoriteMovies.filter(movie => movie.id !== id);
        await saveItem('favoriteMovies', JSON.stringify(newFavoriteMovies))
      }
    }
    onFavoriteRefresh?.();
  },[id, poster_path, title, getObjectItem, onFavoriteRefresh, saveItem]);

  const posterUrl = `https://image.tmdb.org/t/p/w440_and_h660_face${poster_path}`;

  const onSetSavedFavorite = useCallback((favoriteMovies, id) => {
    const hasFavorite = favoriteMovies?.some(movie => movie.id === id);
    setFavorite(hasFavorite);
  },[])

  useEffect(() => {
    onSetSavedFavorite(favoriteMovies, id);
  },[favoriteMovies, id, onSetSavedFavorite])
  return (
    <View style={!full && styles.posterContainer} testID="MoviePoster">
      <View style={[styles.imageContainer, !full && styles.imageFullContainer]}>
        <TouchableOpacity style={styles.favoriteIcon} onPress={() => onSetFavorite(!favorite)}>
          <Icon name={iconName} size={sizes.xl} color={colors.primary}/>
        </TouchableOpacity>
        <Image resizeMode='cover' source={{uri: posterUrl}} style={[styles.image, !full && styles.imageFull]} />
      </View>
      {!full && (<Text testID="MoviePosterSecondTitle" style={[textStyles.h4, styles.secondTitle]}>{title}</Text>)}
    </View>
  )
}

const MoviDetail = ({full, vote_average, genres, title, release_date}) => {
  if(!full) {
    return null;
  }
  return (
    <View style={styles.moviDetailContainer} testID="MoviDetail">
      <Text style={textStyles.h4}>{title}</Text>
      <MovieRating defaultRating={vote_average}/>
      <Text style={textStyles.paragraph}>{genres?.join(', ')}</Text>
      <Text style={textStyles.paragraph}>{release_date.slice(0, 4)}</Text>
    </View>
  )
}

export const MovieCard = ({full, ...props}) => {
  return (
    <View testID="MovieCard" style={[styles.container, full && styles.containerFull]}>
      <MoviePoster full={full} {...props}/>
      <MoviDetail full={full} {...props}/>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  containerFull: {
    flexDirection: 'row',
  },
  posterContainer: {
    width: (screenWidth * 0.5) - 32,
  },
  imageContainer: {
    position: 'relative',
    width: 110,
    height: 170,
  },
  imageFullContainer: {
    width: (screenWidth * 0.5) - 32,
    height: screenWidth * 0.7 - 32,
  },
  rating: {
    marginTop: 0,
    marginBottom: 6,
  },
  ratingIcon: {
    marginRight: 5,
  },
  favoriteIcon: {
    position: 'absolute',
    zIndex: 10,
    top: 6,
    right: 6,
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: 100,
  },
  image: {
    width: 110,
    height: 170,
    borderRadius: 8,
  },
  imageFull: {
    width: (screenWidth * 0.5) - 32,
    height: screenWidth * 0.7 - 32,
  },
  moviDetailContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    paddingRight: 0,
  },
  secondTitle: {
    marginTop: 8,
  }
})