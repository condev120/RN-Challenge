import { LogBox, StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

import Favorites from './screens/Favorites'
import Discover from './screens/Discover'
import Settings from './screens/Settings'

import { colors, sizes } from './lib/styles'

LogBox.ignoreAllLogs(['ViewPropTypes']);

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const tabOptions = ({ route, navigation }) => ({
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.neutral,
  tabBarIcon: ({ focused, color }) => {
    let iconName
    if (route.name === 'Home') {
      if (focused) {
        iconName = 'home'
      } else {
        iconName = 'home-outline'
      }
    }
    if (route.name === 'Discover') {
      if (focused) {
        iconName = 'compass'
      } else {
        iconName = 'compass-outline'
      }
    }
    if (route.name === 'Favorites') {
      if (focused) {
        iconName = 'heart'
      } else {
        iconName = 'heart-outline'
      }
    }
    return <Icon name={iconName} size={20} color={color} />
  },
  headerRight: ({ canGoBack }) => {
    if (!canGoBack && route.name == 'Discover') {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="ios-filter-outline" size={sizes.xxl} color={colors.black} />
        </TouchableOpacity>
      )
    }
    return null

  },
})

const stackOptions = ({ route, navigation }) => ({
  title: route.params?.name,
  headerBackVisible: false,
  headerLeft: ({ canGoBack }) => {
    if (!canGoBack) {
      return null
    }

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={sizes.xxl} color={colors.black} />
      </TouchableOpacity>
    )
  },
})

function Main() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{ headerTitle: 'Discover' }}
      />
      <Tab.Screen name="Favorites" component={Favorites} />
    </Tab.Navigator>
  )
}

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={stackOptions}>
          <Stack.Screen
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 5
  }
})

export default App
