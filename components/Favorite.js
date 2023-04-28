import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { IMAGES_URL } from '../API/Constants'
import { colors, fontWeights, sizes } from '../lib/styles'

let year = ''
export default function Favorite({
    Item,
    selected = () => { },
}) {

    const styles = StyleSheet.create({
        mainContainer: {
            width: '50%',
            backgroundColor: colors.white,
            paddingHorizontal: '4%',
        },
        poster: {
            height: 180,
            width: '100%',
            backgroundColor: colors.light,
            borderRadius: 13
        },
        title: {
            fontSize: sizes.xl,
            fontWeight: fontWeights.normal,
            marginTop: 10
        },
        detail: {
            fontSize: sizes.md,
            fontWeight: fontWeights.normal,
            color: colors.neutral,
            marginTop: 5
        }
    })

    return (
        <View style={styles.mainContainer}>

            <View style={styles.poster}>
                <ImageBackground
                    imageStyle={{ borderRadius: 13 }}
                    style={{
                        height: '100%',
                        width: '100%'
                    }}
                    source={{ uri: `${IMAGES_URL}${Item.backdrop_path}` }} >

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            selected(Item)
                        }}
                        style={{
                            height: 35,
                            width: 35,
                            borderRadius: 100,
                            backgroundColor: colors.white,
                            position: 'absolute',
                            top: '5%',
                            right: '5%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Icon name={Item.isFavorite ? 'heart' : 'heart-o'} size={22} color={colors.primary} />
                    </TouchableOpacity>

                </ImageBackground>
            </View>

            <Text
                numberOfLines={1}
                style={styles.title}>{Item.title}</Text>


        </View>
    )
}
