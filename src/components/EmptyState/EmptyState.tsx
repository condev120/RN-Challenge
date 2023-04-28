import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { FC } from 'react'
import { emptyStateStyles } from './EmptyState.styles'

export interface IEmptyStateProps {
  image: ImageSourcePropType
  title: string
  message: string
  actionLabel: string
  onAction: () => void
}

export const EmptyState: FC<IEmptyStateProps> = ({
  image,
  title,
  message,
  actionLabel,
  onAction
}) => {
  return (
    <View style={emptyStateStyles.container}>
      <Image source={image} style={emptyStateStyles.image} />
      <Text style={emptyStateStyles.title}>{title}</Text>
      <Text style={emptyStateStyles.message}>{message}</Text>
      <TouchableOpacity
        style={emptyStateStyles.button}
        activeOpacity={0.7}
        onPress={() => onAction()}
      >
        <Text style={emptyStateStyles.buttonText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}
