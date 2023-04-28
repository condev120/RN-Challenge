import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { EmptyState } from '../../components/EmptyState'
import { colors, containerStyles, sizes } from '../../constants/styles'
import { useNavigation } from '@react-navigation/native'
import { FC } from 'react'
import { Images } from '../../constants/images'
import { useAppDispatch, useAppSelector } from '../../services/store'
import { TMDBImage } from '../../components/TMDBImage'
import { unsaveDiscover } from '../../services/store/app'
import { IDiscoverItem } from '../../services/api'
import { favoritesStyles } from './Favorites.styles'

const FavoritesItem: FC<{ item: IDiscoverItem }> = ({ item }) => {
  const { width } = useWindowDimensions()
  const dispatch = useAppDispatch()
  return (
    <View style={favoritesStyles.itemContainer}>
      <TMDBImage
        url={item.poster_path}
        style={[favoritesStyles.image, { width: (width - 60) / 2 }]}
      >
        <TouchableOpacity
          style={favoritesStyles.saveContainer}
          onPress={() => dispatch(unsaveDiscover(item))}
        >
          <Icon name={'heart'} size={sizes.xxl} color={colors.primary} />
        </TouchableOpacity>
      </TMDBImage>

      <Text style={favoritesStyles.itemTitle}>{item.original_title}</Text>
    </View>
  )
}

export const Favorites: FC = () => {
  const { navigate } = useNavigation()

  const savedItems = useAppSelector((state) => state.app.favorites.savedItems)

  const hasItems = savedItems.length > 0
  return (
    <View style={containerStyles}>
      <FlatList
        data={savedItems}
        numColumns={2}
        style={favoritesStyles.listStyle}
        showsVerticalScrollIndicator
        renderItem={({ item }) => <FavoritesItem item={item} />}
        contentContainerStyle={{ flex: hasItems ? 0 : 1 }}
        ListEmptyComponent={
          <EmptyState
            image={Images.EmptyFavorites}
            title="You haven't liked any movie yet"
            message="Why not try to find a movie you like?"
            actionLabel="Go to Discover"
            onAction={() =>
              navigate('Main', {
                screen: 'Discover'
              })
            }
          />
        }
        scrollEnabled={hasItems}
        ItemSeparatorComponent={() => <View style={{ height: sizes.sm }} />}
        ListHeaderComponent={() => <View style={{ height: sizes.lg }} />}
        ListFooterComponent={() => <View style={{ height: sizes.lg }} />}
      />
    </View>
  )
}
