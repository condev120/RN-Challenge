import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { colors, fontWeights, sizes } from '../lib/styles'


export default function Genre({ name, onSelect, isSelected }) {
  return (
    <TouchableOpacity
      style={[styles.genre, isSelected ? styles.selectedGenre : undefined]}
      activeOpacity={0.7}
      onPress={onSelect}
    >
      <Text style={[isSelected ? styles.selectedGenreText : undefined]}>
        {name}
      </Text>
      {isSelected && (
        <Icon name="close-outline" size={sizes.lg} color={colors.white} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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

})