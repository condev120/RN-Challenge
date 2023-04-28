import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import StarRating from 'react-native-star-rating'
import { IMAGES_URL } from '../API/Constants'
import { colors, fontWeights, sizes } from '../lib/styles'
import { Icons } from '../assets/Index'
import AsyncStorage from '@react-native-async-storage/async-storage'

let year = ''
export default function Movie({
    Item,
    selected = () => { },
}) {

    // console.log('././././././.',Item);

    const rating = Item.vote_average / 2
    if (Item.release_date) {
        const dateString = Item.release_date;
        year = dateString.split("-")[0];
    }

    const styles = StyleSheet.create({
        mainContainer: {
            width: '100%',
            backgroundColor: colors.white,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: '4%',
        },
        poster: {
            height: 160,
            width: '40%',
            backgroundColor: colors.light,
            borderRadius: 13
        },
        title: {
            fontSize: sizes.xl,
            fontWeight: fontWeights.normal,
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

            <View style={{
                width: '55%',
                marginTop: 15
            }}>
                <Text style={styles.title}>{Item.title}</Text>

                <View style={{
                    width: '65%',
                    marginTop: 10
                }}>
                    <StarRating
                        disabled={false}
                        fullStar={'star'}
                        fullStarColor={colors.primary}
                        emptyStar={'star-o'}
                        emptyStarColor={colors.primary}
                        halfStar={'star-half-empty'}
                        halfStarColor={colors.primary}
                        maxStars={5}
                        starSize={20}
                        rating={rating}

                    />

                </View>
                <Text style={styles.detail}>{Item.genres}</Text>
                <Text style={styles.detail}>{year}</Text>
            </View>

        </View>
    )
}
