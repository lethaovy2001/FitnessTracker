import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from './screens/ProfileScreen';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import CurrentDayScreen from './screens/CurrentDayScreen';
import CurrentActivityScreen from './screens/CurrentActivityScreen';
import NewMealScreen from './screens/NewMealScreen';
import NewActivityScreen from './screens/NewActivityScreen';
import FoodScreen from './screens/FoodScreen';
import NewFoodScreen from './screens/NewFoodScreen';
import MealDetailScreen from './screens/MealDetailScreen';
import TrendScreen from './screens/TrendScreen';

const RootStack = createStackNavigator(
  {
    Signup: SignupScreen,
    Login: LoginScreen,
    Food: FoodScreen,
    MealDetail: MealDetailScreen,
    NewFood: NewFoodScreen,
    // Trend: TrendScreen,
    Landing: createBottomTabNavigator({
      Profile: {
        screen: ProfileScreen,
        navigationOptions: {
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'ios-person'} size={26} style={{ color: focused ? '#33A3F4' : '#949494' }} />
          )
        }
      },
      CurrentDay: {
        screen: CurrentDayScreen,
        navigationOptions: {
          title: 'Meal',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'ios-list'} size={26} style={{ color: focused ? '#33A3F4' : '#949494' }} />
          )
        }
      },
      NewMeal: {
        screen: NewMealScreen,
        navigationOptions: {
          title: 'New Meal',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'ios-add-circle-outline'} size={26} style={{ color: focused ? '#33A3F4' : '#949494' }} />
          )
        }
      },
      NewActivity: {
        screen: NewActivityScreen,
        navigationOptions: {
          title: 'New Activity',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'ios-add-circle-outline'} size={26} style={{ color: focused ? '#33A3F4' : '#949494' }} />
          )
        }
      },
      CurrentActivity: {
        screen: CurrentActivityScreen,
        navigationOptions: {
          title: 'Activity',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'ios-list'} size={26} style={{ color: focused ? '#33A3F4' : '#949494' }} />
          )
        }
      },
      Trend: {
        screen: TrendScreen,
        navigationOptions: {
          title: 'Trend',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={'ios-stats'} size={26} style={{ color: focused ? '#33A3F4' : '#949494' }} />
          )
        }
      }
    })
  },
  {
    initialRouteName: 'Login',
  }
);

const AppContainer = createAppContainer(RootStack);

class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

export default App;