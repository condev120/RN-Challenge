import { StyleSheet } from 'react-native'
import { colors, sizes } from '../../constants/styles'

export const discoverStyles = StyleSheet.create({
  itemContainer: { flexDirection: 'row', paddingHorizontal: 20 },
  image: {
    height: 170,
    width: 100,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'flex-end'
  },
  saveContainer: {
    backgroundColor: 'white',
    width: sizes.xxl + sizes.xxs,
    height: sizes.xxl + sizes.xxs,
    borderRadius: (sizes.xxl + sizes.xxs) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: sizes.xxs
  },
  contentContainer: { flex: 1, paddingVertical: 8, paddingHorizontal: 12 },
  starsContainer: { flexDirection: 'row', paddingBottom: 6 },
  year: { color: colors.neutral, paddingTop: 4 }
})
