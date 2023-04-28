import React, { Component } from "react"
import {
    View, Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Platform,
    useColorScheme,
    ActivityIndicator
} from "react-native"
import { colors } from "../lib/styles"

const Loader = ({ }) => {
    return (
        // <Modal
        //   transparent={true}
        //   animationType='fade'
        //   visible={isLoading}>

        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}>

            <ActivityIndicator size={'large'} color={colors.primary} />
        </TouchableOpacity>

        // </Modal>
    )

}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        justifyContent: 'center',
        backgroundColor: '#0000001',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 99999

    },
})


export default Loader;


