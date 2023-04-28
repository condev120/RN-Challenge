import { FC, PropsWithChildren } from 'react'
import { ImageBackground, ImageStyle, StyleProp, View } from 'react-native'

interface ITMDBImageProps {
  url: string | null
  style: StyleProp<ImageStyle>
}

const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'

export const TMDBImage: FC<PropsWithChildren<ITMDBImageProps>> = ({
  url,
  style,
  children
}) => {
  if (!url) return <View style={style} />
  return (
    <ImageBackground
      source={{ uri: imageBaseUrl + url }}
      style={style}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  )
}
