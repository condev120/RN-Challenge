import { StyleSheet, TouchableOpacity } from 'react-native'
import {
  NavigationContainer,
  ParamListBase,
  RouteProp
} from '@react-navigation/native'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs'
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator
} from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

import { Favorites } from './screens/Favorites'
import { Discover } from './screens/Discover'
import { Settings } from './screens/Settings'

import { colors, sizes } from './constants/styles'
import { persistor, store } from './services/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const tabOptions: (props: {
  route: RouteProp<ParamListBase>
}) => BottomTabNavigationOptions = ({ route }) => ({
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.neutral,
  tabBarIcon: ({ focused, color }) => {
    const icons = {
      Home: 'home',
      Discover: 'compass',
      Favorites: 'heart'
    }
    const suffix = focused ? '' : '-outline'
    const iconName = icons[route.name as keyof typeof icons] + suffix

    return <Icon name={iconName} size={20} color={color} />
  }
})

const stackOptions: (props: {
  route: RouteProp<ParamListBase>
  navigation: any
}) => NativeStackNavigationOptions = ({ navigation }) => ({
  headerBackVisible: false,
  headerLeft: ({ canGoBack }) => {
    if (!canGoBack) {
      return null
    }

    return (
      <TouchableOpacity style={styles.button} onPress={navigation.goBack}>
        <Icon name="chevron-back" size={sizes.xxl} color={colors.black} />
      </TouchableOpacity>
    )
  }
})

function Main() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={({ navigation }) => ({
          headerRight: () => (
            <Icon
              name="options-outline"
              size={sizes.xxl}
              color={colors.black}
              onPress={() => navigation.navigate('Settings')}
            />
          ),
          headerRightContainerStyle: {
            paddingRight: sizes.lg
          },
          headerLeftContainerStyle: {
            paddingLeft: sizes.lg
          }
        })}
      />
      <Tab.Screen name="Favorites" component={Favorites} />
    </Tab.Navigator>
  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 5
  }
})

export default App
