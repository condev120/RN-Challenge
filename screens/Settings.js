import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import Genre from '../components/Genre'

import {
  colors,
  containerStyles,
  fontWeights,
  sizes,
  textStyles
} from '../lib/styles'

export default function Settings({ navigation }) {

  const [isSelected, setIsSelected] = useState('')
  const [selectedGenres, setSelectedGenres] = useState('');
  const [year, setYear] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()

  const [genreList, setGenreList] = useState([])

  function SortOption({ name }) {
    return (
      <TouchableOpacity
        style={styles.sortOption}
        activeOpacity={0.7}
        onPress={async () => {
          if (name == isSelected) {
            setIsSelected('')
          } else {
            setIsSelected(name)
          }
        }}
      >
        <Text>{name}</Text>
        <Icon
          name={isSelected == name ? 'checkmark-circle' : 'ellipse-outline'}
          size={sizes.xxl}
          color={isSelected == name ? colors.primary : colors.black}
        />
      </TouchableOpacity>
    )
  }

  const handleGenreClick = async (id) => {
    setGenreList((prevGenres) =>
      prevGenres.map((genre) =>
        genre.id === id ? { ...genre, isSelected: !genre.isSelected } : genre
      )
    );
  };


  const getGenres = async () => {
    let genres = await AsyncStorage.getItem('Genres')
    let _genre = await AsyncStorage.getItem('genresIds')
    if (genres) {
      genres = JSON.parse(genres)
    }

    if (_genre) {
      // console.log({_genre});
      const idsArray = _genre.split(",").map(Number);
      for (const item of genres) {
        if (idsArray.includes(item.id)) {
          item.isSelected = true;
        }
      }
      // console.log({ genreList });
    }
    // console.log({ genres });
    setGenreList(genres)
  }


  const saveFilter = async () => {
    setIsLoading(true)
    if (selectedGenres) {
      await AsyncStorage.setItem('genresIds', selectedGenres)
    } else {
      await AsyncStorage.removeItem('genresIds')
    }
    if (isSelected) {
      await AsyncStorage.setItem('sort', isSelected == 'Popularity' ? 'popularity.desc' : isSelected == 'Rating' ? 'vote_average.desc' : isSelected == 'Newest First' ? 'release_date.desc' : isSelected == 'Oldest First' ? 'primary_release_date.lte' : '')
    } else {
      await AsyncStorage.removeItem('sort')
    }
    if (year) {
      await AsyncStorage.setItem('year', year)
    } else {
      await AsyncStorage.removeItem('year')
    }
    if (from) {
      await AsyncStorage.setItem('from', from)
    } else {
      await AsyncStorage.removeItem('from')
    }
    if (to) {
      await AsyncStorage.setItem('to', to)
    } else {
      await AsyncStorage.removeItem('to')
    }
    await AsyncStorage.setItem('isFiltered', 'true')

    setTimeout(() => {
      setIsLoading(false)
      navigation.pop()
    }, 1500);
  }

  const getFilters = async () => {

    let _sort = await AsyncStorage.getItem('sort')
    let _year = await AsyncStorage.getItem('year')
    let _from = await AsyncStorage.getItem('from')
    let _to = await AsyncStorage.getItem('to')

    setIsSelected(_sort == 'popularity.desc' ? 'Popularity' : _sort == 'vote_average.desc' ? 'Rating' : _sort == 'release_date.desc' ? 'Newest First' : _sort == 'primary_release_date.lte' ? 'Oldest First' : '')
    setYear(_year)
    setFrom(_from)
    setTo(_to)
  }

  useEffect(() => {
    if (isFocused) {
      getGenres()
    }
  }, [])

  useEffect(() => {
    getFilters()
    const selectedIds = genreList
      .filter((genre) => genre.isSelected)
      .map((genre) => genre.id)
      .join(',');
    setSelectedGenres(selectedIds);
  }, [genreList]);

  return (
    <View
      style={[
        containerStyles,
        {
          paddingBottom: insets.bottom
        }
      ]}
    >

      <KeyboardAwareScrollView
        extraScrollHeight={50}
        // enableOnAndroid={true}
        // keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          justifyContent: 'center',
          paddingVertical: 30,
          paddingHorizontal: 30
        }}
        showsVerticalScrollIndicator={false}>
        {/* <ScrollView contentContainerStyle={styles.wrapper}> */}
        <View>
          <Text style={textStyles.h2}>Sort by</Text>
          <View>
            <SortOption name="Popularity" selected={isSelected} />
            <SortOption name="Rating" selected={isSelected} />
            <SortOption name="Newest First" selected={isSelected} />
            <SortOption name="Oldest First" selected={isSelected} />
          </View>
        </View>

        <View style={[{ marginTop: 15 }]}>
          <Text style={textStyles.h2}>Genres</Text>
          <View style={styles.genreList}>
            {
              genreList.map((item) => {
                return (
                  <Genre
                    key={item.id}
                    name={item.name}
                    onSelect={() => handleGenreClick(item.id)}
                    isSelected={item.isSelected}
                  />
                )
              })
            }
          </View>
        </View>
        <View style={[{ marginTop: 15 }]}>
          <Text style={[textStyles.h2]}>Year</Text>
          <TextInput
            onChangeText={(val) => {
              setYear(val)
            }}
            value={year}
            keyboardType="number-pad"
            style={styles.input}
            placeholder={'2023'}
            maxLength={4}
          />
        </View>

        <View style={[{ marginTop: 15 }]}>
          <Text style={textStyles.h2}>Runtime</Text>
          <View style={styles.runtime}>
            <TextInput
              onChangeText={(val) => {
                setFrom(val)
              }}
              value={from}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="From"
              placeholderTextColor={colors.neutral}
              maxLength={3}

            />
            <Text style={textStyles.small}>-</Text>
            <TextInput
              onChangeText={(val) => {
                setTo(val)
              }}
              value={to}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="To"
              placeholderTextColor={colors.neutral}
              maxLength={3}
            />
            <Text style={textStyles.small}>minutes</Text>
          </View>
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          // disabled={(isSelected == '' && selectedGenres == '' && year == '' && from == '' && to == '') || (from == '' && to != '') || (from != '' && to == '')}
          activeOpacity={0.7}
          underlayColor={colors.neutral}
          style={[styles.button, { backgroundColor: colors.black }
            // {
            //   backgroundColor: (isSelected == '' && selectedGenres == '' && year == '' && from == '' && to == '')
            //     ?
            //     colors.neutral :
            //     ((from == '' && to != '') || (from != '' && to == ''))
            //       ?
            //       colors.neutral :
            //       colors.black,
            // }
          ]}
          onPress={() => {
            saveFilter()
          }}
        >
          {
            isLoading ?
              <ActivityIndicator size={'small'} color={colors.white} />
              :
              <Text style={styles.buttonText}>Save</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
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
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: colors.white,
    fontWeight: fontWeights.bold,
    fontSize: sizes.md
  }
})
