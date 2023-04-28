import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

import { EmptyState } from '../../components/EmptyState'
import {
  colors,
  containerStyles,
  sizes,
  textStyles
} from '../../constants/styles'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { FC, useMemo } from 'react'
import { Images } from '../../constants/images'
import {
  IDiscoverItem,
  useGetDiscoverQuery,
  useGetGenresListQuery
} from '../../services/api'
import { useAppDispatch, useAppSelector } from '../../services/store'
import { TMDBImage } from '../../components/TMDBImage'
import {
  saveDiscover,
  setCurrentPage,
  unsaveDiscover
} from '../../services/store/app'
import { IGenreItem } from '../../types/settings'
import { discoverStyles } from './Discover.styles'

interface IDiscoverItemProps {
  genres: IGenreItem[]
  item: IDiscoverItem
  savedItems: IDiscoverItem[]
}

const DiscoverItem: FC<IDiscoverItemProps> = ({ item, genres, savedItems }) => {
  const dispatch = useAppDispatch()

  const isSaved = useMemo(
    () => savedItems.some((savedItem) => savedItem.id === item.id),
    [savedItems, item.id]
  )

  return (
    <View style={discoverStyles.itemContainer}>
      <TMDBImage url={item.poster_path} style={discoverStyles.image}>
        <TouchableOpacity
          style={discoverStyles.saveContainer}
          onPress={() =>
            dispatch(isSaved ? unsaveDiscover(item) : saveDiscover(item))
          }
        >
          <Icon
            name={isSaved ? 'heart' : 'heart-outline'}
            size={sizes.xxl}
            color={isSaved ? colors.primary : colors.black}
          />
        </TouchableOpacity>
      </TMDBImage>

      <View style={discoverStyles.contentContainer}>
        <Text style={textStyles.h3}>{item.original_title}</Text>
        <View style={discoverStyles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name={
                (item.vote_average / 10) * 5 > index + 1
                  ? 'star'
                  : 'star-outline'
              }
              size={sizes.xxl}
              color={colors.primary}
            />
          ))}
        </View>

        {item.genre_ids.length > 0 && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.neutral }}>
              {item.genre_ids
                .map(
                  (id) => genres.find((genre) => genre.id === id)?.name || ''
                )
                .join(', ')}
            </Text>
          </View>
        )}

        <Text style={discoverStyles.year}>
          {new Date(item.release_date).getFullYear()}
        </Text>
      </View>
    </View>
  )
}

export const Discover: FC = () => {
  const { navigate } = useNavigation()
  const {
    genres,
    selectedGenresIds,
    selectedSortBy,
    runtimeFrom,
    runtimeTo,
    year,
    savedItems,
    currentPage,
    items: discoverItems
  } = useAppSelector((state) => ({
    ...state.app.settings,
    ...state.app.favorites,
    ...state.app.discover
  }))
  const dispatch = useAppDispatch()

  const { isLoading: areGenresLoading } = useGetGenresListQuery()

  const { isLoading: isDiscoverLoading } = useGetDiscoverQuery({
    genresIds: selectedGenresIds,
    sortBy: selectedSortBy,
    runtimeFrom,
    runtimeTo,
    year,
    page: currentPage
  })

  if (isDiscoverLoading || areGenresLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const hasItems = discoverItems && discoverItems.length > 0

  return (
    <View style={containerStyles}>
      <FlatList
        data={discoverItems || []}
        renderItem={({ item }) => (
          <DiscoverItem item={item} genres={genres} savedItems={savedItems} />
        )}
        scrollEnabled={hasItems}
        contentContainerStyle={{
          flex: hasItems ? 0 : 1
        }}
        ListEmptyComponent={
          <EmptyState
            image={Images.EmptyDiscover}
            title="No results found"
            message="Try adjusting the settings"
            actionLabel="Go to Settings"
            onAction={() => navigate('Settings')}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: sizes.sm }} />}
        ListHeaderComponent={() => <View style={{ height: sizes.lg }} />}
        ListFooterComponent={() => <View style={{ height: sizes.lg }} />}
        onEndReached={() => dispatch(setCurrentPage(currentPage + 1))}
      />
    </View>
  )
}
