import { StyleSheet } from 'react-native'
import { sizes } from '../../constants/styles'

export const favoritesStyles = StyleSheet.create({
  image: {
    aspectRatio: 9 / 16,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'flex-end'
  },
  itemContainer: { width: '50%', alignItems: 'center' },
  saveContainer: {
    backgroundColor: 'white',
    width: sizes.xxl + sizes.xxs,
    height: sizes.xxl + sizes.xxs,
    borderRadius: (sizes.xxl + sizes.xxs) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: sizes.xxs
  },
  itemTitle: { paddingTop: sizes.xs, fontSize: sizes.lg },
  listStyle: { paddingHorizontal: 12 }
})
