import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

import {
  colors,
  containerStyles,
  sizes,
  textStyles
} from '../../constants/styles'
import { useNavigation } from '@react-navigation/native'
import { FC, useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../services/store'
import { sortByOptions } from '../../constants/data'
import { settingsStyles } from './Settings.styles'
import { updateSettings } from '../../services/store/app'

export const Settings: FC = () => {
  const insets = useSafeAreaInsets()
  const { goBack } = useNavigation()
  const dispatch = useAppDispatch()

  const {
    genres,
    selectedGenresIds,
    selectedSortBy,
    year,
    runtimeFrom,
    runtimeTo
  } = useAppSelector((state) => state.app.settings)
  const [localeSelectedGenresIds, setLocalSelectedGenresIds] =
    useState(selectedGenresIds)
  const [localeSelectedSortBy, setLocalSelectedSortBy] =
    useState(selectedSortBy)
  const [localeYear, setLocaleYear] = useState<string>(year?.toString() || '')
  const [localeRuntimeFrom, setLocaleRuntimeFrom] = useState<string>(
    runtimeFrom?.toString() || ''
  )
  const [localeRuntimeTo, setLocaleRuntimeTo] = useState<string>(
    runtimeTo?.toString() || ''
  )

  const updateLocaleGenreIds = useCallback(
    (id: number) => {
      setLocalSelectedGenresIds((prevState) => {
        if (prevState.includes(id)) {
          return prevState.filter((value) => value !== id)
        }

        return [...prevState, id]
      })
    },
    [setLocalSelectedGenresIds]
  )

  const onSavePress = useCallback(() => {
    dispatch(
      updateSettings({
        selectedGenresIds: localeSelectedGenresIds,
        selectedSortBy: localeSelectedSortBy,
        year: Number.isInteger(Number(localeYear)) ? Number(localeYear) : year,
        runtimeFrom: Number.isNaN(Number(localeRuntimeFrom))
          ? runtimeFrom
          : Number(localeRuntimeFrom),
        runtimeTo: Number.isNaN(Number(localeRuntimeTo))
          ? runtimeTo
          : Number(localeRuntimeTo),
        currentPage: 1
      })
    )
    goBack()
  }, [
    dispatch,
    localeSelectedGenresIds,
    localeSelectedSortBy,
    localeYear,
    year,
    localeRuntimeFrom,
    runtimeFrom,
    localeRuntimeTo,
    runtimeTo,
    goBack
  ])

  return (
    <View
      style={[
        containerStyles,
        {
          paddingBottom: insets.bottom
        }
      ]}
    >
      <ScrollView contentContainerStyle={settingsStyles.wrapper}>
        <View>
          <Text style={textStyles.h2}>Sort by</Text>
          <View>
            {sortByOptions.map((value) => (
              <SortOption
                key={value.id}
                id={value.id}
                name={value.name}
                selected={localeSelectedSortBy === value.id}
                onSelect={setLocalSelectedSortBy}
              />
            ))}
          </View>
        </View>
        <View>
          <Text style={textStyles.h2}>Genres</Text>
          <View style={settingsStyles.genreList}>
            {genres.map((genre) => (
              <Genre
                key={genre.id}
                id={genre.id}
                name={genre.name}
                selected={localeSelectedGenresIds.some((id) => id === genre.id)}
                onSelect={updateLocaleGenreIds}
              />
            ))}
          </View>
        </View>
        <View>
          <Text style={textStyles.h2}>Year</Text>
          <TextInput
            keyboardType="number-pad"
            style={settingsStyles.input}
            maxLength={4}
            value={localeYear}
            onChangeText={setLocaleYear}
          />
        </View>
        <View>
          <Text style={textStyles.h2}>Runtime</Text>
          <View style={settingsStyles.runtime}>
            <TextInput
              keyboardType="number-pad"
              style={settingsStyles.input}
              placeholder="From"
              placeholderTextColor={colors.neutral}
              maxLength={3}
              value={localeRuntimeFrom}
              onChangeText={setLocaleRuntimeFrom}
            />
            <Text style={textStyles.small}>-</Text>
            <TextInput
              keyboardType="number-pad"
              style={settingsStyles.input}
              placeholder="To"
              placeholderTextColor={colors.neutral}
              maxLength={3}
              value={localeRuntimeTo}
              onChangeText={setLocaleRuntimeTo}
            />
            <Text style={textStyles.small}>minutes</Text>
          </View>
        </View>
      </ScrollView>
      <View style={settingsStyles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={settingsStyles.button}
          onPress={onSavePress}
        >
          <Text style={settingsStyles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

interface ISelectProps<ID extends number | string> {
  id: ID
  name: string
  selected: boolean
  onSelect?: (id: ID) => void
}

const Genre: FC<ISelectProps<number>> = ({ id, name, selected, onSelect }) => {
  const onPress = useCallback(() => {
    onSelect?.(id)
  }, [id, onSelect])

  return (
    <TouchableOpacity
      style={[
        settingsStyles.genre,
        selected ? settingsStyles.selectedGenre : undefined
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={[selected ? settingsStyles.selectedGenreText : undefined]}>
        {name}
      </Text>
      {selected && (
        <Icon name="close-outline" size={sizes.lg} color={colors.white} />
      )}
    </TouchableOpacity>
  )
}

const SortOption: FC<ISelectProps<string>> = ({
  id,
  name,
  selected,
  onSelect
}) => {
  const onPress = useCallback(() => {
    onSelect?.(id)
  }, [id, onSelect])

  return (
    <TouchableOpacity
      style={settingsStyles.sortOption}
      activeOpacity={0.7}
      onPress={onPress}
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
