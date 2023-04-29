import { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { GenreContext } from '../contexts/genres';

import {
  colors,
  containerStyles,
  fontWeights,
  sizes,
  textStyles
} from '../lib/styles'

export default function Settings({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const {genreState} = useContext(GenreContext);
  const genres= genreState.genres;
  const [state, setState] = useState(route?.params?.filterState ?? {
    sort_by: 'popularity.desc',
    with_genres: [],
    year: null,
    "with_runtime.gte": null,
    "with_runtime.lte": null,
  })

  return (
    <KeyboardAvoidingView style={containerStyles} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View>
          <Text style={textStyles.h2}>Sort by</Text>
          <View>
            <SortOption name="Popularity" selected={state.sort_by === 'popularity.desc'} onSelect={() => setState(state => ({...state, sort_by: 'popularity.desc'}))} />
            <SortOption name="Rating" selected={state.sort_by === 'vote_average.desc'} onSelect={() => setState(state => ({...state, sort_by: 'vote_average.desc'}))} />
            <SortOption name="Newest First" selected={state.sort_by === 'release_date.desc'} onSelect={() => setState(state => ({...state, sort_by: 'release_date.desc'}))} />
            <SortOption name="Oldest First" selected={state.sort_by === 'release_date.asc'} onSelect={() => setState(state => ({...state, sort_by: 'release_date.asc'}))} />
          </View>
        </View>
        <View>
          <Text style={textStyles.h2}>Genres</Text>
          <View style={styles.genreList}>
            {genres?.map(genre => (<Genre name={genre.name} onSelect={() => {
              setState(state => {
                const hasId = state.with_genres.some(genId => genId === genre.id);
                if(hasId){
                  const newGenres = state.with_genres.filter(genId => genId !== genre.id);
                  return ({...state, with_genres: [...newGenres]});
                }
                return ({...state, with_genres: [...state.with_genres, genre.id]})
              })
            }} selected={state.with_genres.includes(genre.id)} />))}
            {/* {setState(state => ({...state, with_genres: state?.with_genres?.push(genre.id)}))} */}
          </View>
        </View>
        <View>
          <Text style={textStyles.h2}>Year</Text>
          <TextInput
            value={state.year}
            keyboardType="number-pad"
            style={styles.input}
            maxLength={4}
            onChangeText={value => setState(state => ({...state, year: value}))}
          />
        </View>
        <View>
          <Text style={textStyles.h2}>Runtime</Text>
          <View style={styles.runtime}>
            <TextInput
              value={state['with_runtime.gte']}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="From"
              placeholderTextColor={colors.neutral}
              maxLength={3}
              onChangeText={value => setState(state => ({...state, "with_runtime.gte": value}))}
            />
            <Text style={textStyles.small}>-</Text>
            <TextInput
              value={state['with_runtime.lte']}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="To"
              placeholderTextColor={colors.neutral}
              maxLength={3}
              onChangeText={value => setState(state => ({...state, "with_runtime.lte": value}))}
            />
            <Text style={textStyles.small}>minutes</Text>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom}]}>
        <TouchableOpacity
          activeOpacity={0.7}
          underlayColor={colors.neutral}
          style={styles.button}
          onPress={() => {
            if(Number(state['with_runtime.gte']) > Number(state['with_runtime.lte'])) {
              Alert.alert('Runtime FROM must less than TO');
              return;
            }
            route?.params?.setState(state);
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

function Genre({ name, selected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.genre, selected ? styles.selectedGenre : undefined]}
      activeOpacity={0.7}
      onPress={onSelect}
    >
      <Text style={[selected ? styles.selectedGenreText : undefined]}>
        {name}
      </Text>
      {selected && (
        <Icon name="close-outline" size={sizes.lg} color={colors.white} />
      )}
    </TouchableOpacity>
  )
}

function SortOption({ name, selected, onSelect }) {
  return (
    <TouchableOpacity
      style={styles.sortOption}
      activeOpacity={0.7}
      onPress={onSelect}
    >
      <Text>{name}</Text>
      <Icon
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={sizes.xxl}
        color={selected ? colors.primary : colors.black}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
    paddingVertical: 30,
    gap: 30
  },
  input: {
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
    width: 80
  },
  genreList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  genre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  selectedGenre: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  selectedGenreText: {
    color: colors.white
  },
  runtime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: colors.light,
    borderBottomWidth: 1
  },
  buttonContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    paddingVertical: 16,
    paddingHorizontal: 30
  },
  button: {
    backgroundColor: colors.black,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: colors.white,
    fontWeight: fontWeights.bold,
    fontSize: sizes.md
  }
})
