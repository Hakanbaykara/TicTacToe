import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';


export default HomeScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('SignUp');
      })
      .catch(error => alert(error.message));
  };



  return (
    <View style={styles.home}>
      <Text style={styles.text}>Welcome Tic Tac Toe</Text>
      <Text style={styles.text}>
        User: {auth().currentUser?.email}
        </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Game')}>
        <Text style={styles.buttonText}>Play Offline</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MultiPlayer')}>
        <Text style={styles.buttonText}>Multiplayer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Leaderboard')}>
        <Text style={styles.buttonText}>Leaderboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signout} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '900',
    top: -150,
    fontSize: 30,
  },
  button: {
    backgroundColor: 'blue',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  signout: {
    backgroundColor: 'red',
    width: '40%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    top: 180,
  },
  buttonText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 17,
  },
});
