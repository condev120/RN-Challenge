import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import StarRating from 'react-native-star-rating'
import { IMAGES_URL } from '../API/Constants'
import { colors, fontWeights, sizes } from '../lib/styles'
import { Icons } from '../assets/Index'


export default function LoadMore({
    isLoading
}) {


    const styles = StyleSheet.create({
        mainContainer: {
            width: '100%',
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            // paddingVertical: '10%',
            marginTop: 10
        },

    })

    return (
        <View style={styles.mainContainer}>

            <ActivityIndicator size={'small'} color={colors.primary} />


        </View>
    )
}
