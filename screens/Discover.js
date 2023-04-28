import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { handleGetFilteredMovies, handleGetGenres, handleGetMovieDetails, handleGetMovies } from '../API/Config'

import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import LoadMore from '../components/LoadMore'
import Movie from '../components/Movie'
import { containerStyles } from '../lib/styles'

let onEndReachedCalledDuringMomentum = true

export default function Discover({ navigation }) {

  const [isLoading, setIsLoading] = useState(true)
  const [loadMore, setLoadMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [moviesList, setMoviesList] = useState([])

  const isFocused = useIsFocused()

  const getMoviesList = async (newPage) => {
    let genresIds = await AsyncStorage.getItem('genresIds')
    let sortBy = await AsyncStorage.getItem('sort')
    let year = await AsyncStorage.getItem('year')
    let from = await AsyncStorage.getItem('from')
    let to = await AsyncStorage.getItem('to')
    let _filtered = await AsyncStorage.getItem('isFiltered')

    console.log(
      genresIds,
      sortBy,
      year,
      from,
      to
    );
    if (sortBy || genresIds || year || from || to) {
      handleGetFilteredMovies(newPage).then((data) => {
        // console.log('getMoviesList..::', data.movies);
        if (data.current === 1) {
          setTotalPages(data.totalPages)
          setMoviesList(data.movies)
        } else {
          let previous = moviesList
          previous.push(...data.movies)
          setMoviesList(previous)
        }

      }).finally(() => {
        setIsLoading(false)
        setLoadMore(false)

      })
    } else {
      handleGetMovies(newPage).then((data) => {
        // console.log('getMoviesList..::', data.movies);
        if (data.current === 1) {
          setTotalPages(data.totalPages)
          setMoviesList(data.movies)
        } else {
          let previous = moviesList
          previous.push(...data.movies)
          setMoviesList(previous)
        }

      }).finally(() => {
        setIsLoading(false)
        setLoadMore(false)
      })
    }


  }

  const getGenres = async () => {
    handleGetGenres().then((data) => {
      console.log('getGenres-', data);
    }).catch((err) => {
      console.log('getGenres-err', err);
    })
  }

  const saveGenres = async (data) => {
    // console.log(data.length);
    if (data.length != 0) {
      const uniqueGenres = {};
      const genreSet = new Set();
      data.forEach(obj => {
        if (obj.genre_ids && obj.genre_ids.length && obj.genres && obj.genres.trim().length) {
          obj.genres.split(',').forEach(genreName => {
            const trimmedName = genreName.trim();
            if (!genreSet.has(trimmedName)) {
              const genreId = obj.genre_ids.find(id => uniqueGenres[id] === undefined);
              if (genreId) {
                uniqueGenres[genreId] = trimmedName;
                genreSet.add(trimmedName);
              }
            }
          });
        }
      });
      const result = Object.entries(uniqueGenres).map(([id, genres]) => ({ id: parseInt(id), genres, isSelected: false }));
      // console.log(result);
      await AsyncStorage.setItem('Genres', JSON.stringify(result))
    }

  }

  const addFavorite = async (item) => {
    try {
      const movies = await AsyncStorage.getItem('movies');
      // console.log({ movies });
      if (movies) {
        const parsedItems = JSON.parse(movies);
        parsedItems.push({ ...item, isFavorite: true });
        const updatedData = moviesList.map((_item) => {
          if (_item.id == item.id) {
            return { ..._item, isFavorite: true }
          }
          return _item;
        })
        setMoviesList(updatedData)
        await AsyncStorage.setItem('movies', JSON.stringify(parsedItems));
      } else {
        const newItems = [{
          ...item, isFavorite: true
        }];
        await AsyncStorage.setItem('movies', JSON.stringify(newItems));
        const updatedData = moviesList.map((_item) => {
          if (_item.id == item.id) {
            return { ..._item, isFavorite: true }
          }
          return _item;
        })
        setMoviesList(updatedData)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddItem = (newItem) => {
    addFavorite(newItem);
  };

  const removeFavorite = async (item) => {
    try {

      const updatedData = moviesList.map((_item) => {
        if (_item.id == item.id) {
          return { ..._item, isFavorite: false }
        }
        return _item;
      })

      const filteredData = updatedData.filter((_item) => {
        return _item.isFavorite == true
      })

      await AsyncStorage.setItem('movies', JSON.stringify(filteredData));
      setMoviesList(updatedData)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true)
      getGenres()
      getMoviesList(currentPage)
    }
  }, [isFocused])

  return (
    <View
      // pointerEvents={loadMore ? 'none' : 'auto'}
      style={[containerStyles]}>

      {
        isLoading ?
          <Loader />
          :
          <FlatList
            showsVerticalScrollIndicator={false}
            data={moviesList}
            renderItem={({ item, index }) => {
              return (
                <Movie
                  Item={item}
                  selected={(Item) => {
                    Item.isFavorite ?
                      removeFavorite(Item)
                      :
                      handleAddItem(Item)
                  }}
                />
              )
            }}
            keyExtractor={(item, index) => 'movie' + index}
            ItemSeparatorComponent={() => {
              return <View style={{ height: 14 }} />
            }}
            ListFooterComponent={() => {
              if (loadMore) {
                return (
                  <LoadMore />
                )
              }
              return null
            }}
            ListEmptyComponent={() => {
              if (!isLoading) {
                return (
                  <View style={{ marginTop: '45%' }}>
                    <EmptyState
                      image={require('../assets/empty-discover.jpg')}
                      title="No results found"
                      message="Try adjusting the settings"
                      actionLabel="Go to Settings"
                      onAction={() => navigation.navigate('Settings')}
                    />
                  </View>
                )
              }
              return null

            }}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: '10%', }}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
            onEndReached={val => {
              if (!onEndReachedCalledDuringMomentum && !loadMore) {
                console.log('onEndReached', currentPage, totalPages, onEndReachedCalledDuringMomentum);
                setLoadMore(true)
                let newPage = currentPage + 1
                if (currentPage <= totalPages) {
                  setCurrentPage(newPage)
                  getMoviesList(newPage)
                  onEndReachedCalledDuringMomentum = true;
                }
              }
            }}

          />
      }

    </View>
  )
}
