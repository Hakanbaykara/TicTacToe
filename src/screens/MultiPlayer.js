import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {styles} from '../../App.style';

export default MultiPlayer = () => {

  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Hello Room</Text>
      <TouchableOpacity style={{position: 'absolute', top: 30, left: 0}}>
        <Text style={styles.button} onPress={navigation.goBack}>
          Go Back To Home Screen
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
