import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import HomeScreen from './src/screens/HomeScreen';
import Game from './src/screens/Game';
import Leaderboard from './src/screens/Leaderboard';
import SignUp from './src/screens/SignUp';

const Stack = createNativeStackNavigator()


const App = () => {

  return(
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='SignUp'
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Game" component={Game}/>
        <Stack.Screen name="Leaderboard" component={Leaderboard}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;