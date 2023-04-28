import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import EmptyState from '../components/EmptyState'
import Favorite from '../components/Favorite'
import Loader from '../components/Loader'
import { containerStyles } from '../lib/styles'

export default function Favorites({ navigation }) {

  const [isLoading, setIsLoading] = useState(true)
  const [moviesList, setMoviesList] = useState([])
  const isFocused = useIsFocused()

  const getFavorites = async () => {

    let movies = await AsyncStorage.getItem('movies')
    movies = JSON.parse(movies)
    console.log({ movies });
    setMoviesList(movies)
  }


  const removeFavorite = async (item) => {
    try {

      const updatedData = moviesList.map((_item) => {
        if (_item.id == item.id) {
          return { ..._item, isFavorite: false }
        }
        return _item;
      })

      const filteredData = updatedData.filter((_item) => {
        return _item.id != item.id
      })

      await AsyncStorage.setItem('movies', JSON.stringify(filteredData));

      setMoviesList(filteredData)
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isFocused) {
      setIsLoading(true)
      getFavorites()
      setTimeout(() => {
        setIsLoading(false)
      }, 750);
    }
  }, [isFocused])


  return (
    <View style={containerStyles}>


      {
        isLoading ?
          <Loader />
          :
          <FlatList
            showsVerticalScrollIndicator={false}
            data={moviesList}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <Favorite
                  Item={item}
                  selected={(Item) => {
                    removeFavorite(Item)
                  }}
                />
              )
            }}
            keyExtractor={(item, index) => 'movie' + index}
            ItemSeparatorComponent={() => {
              return <View style={{ height: 20 }} />
            }}
            ListEmptyComponent={() => {
              if (!isLoading) {
                return (
                  <View style={{ marginTop: '45%' }}>
                    <EmptyState
                      image={require('../assets/empty-favorites.jpg')}
                      title="You haven't liked any movie yet"
                      message="Why not try to find a movie you like?"
                      actionLabel="Go to Discover"
                      onAction={() => navigation.navigate('Discover')}
                    />
                  </View>
                )
              }
              return null

            }}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: '10%', }}
          />
      }
    </View>
  )
}
