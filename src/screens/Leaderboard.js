import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';


export default Leaderboard = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);


  useEffect(() => {
    database()
      .ref('scores/')
      .on('value', snapshot => {
        const response = snapshot.val();
        const newArr = Object.keys(response).map(key => {
          response[key].id = key;
          return response[key];
        });
        setData(newArr);
        console.log(newArr[0].id)
      });
  }, []);

  return (
    <SafeAreaView style={styles.backround}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              borderWidth: 1,
              borderColor: 'red',
            }}>
            {item.email} => {item.score}
          </Text>
        )}
      />
      <TouchableOpacity style={{position: 'absolute', bottom: 30, left: 0}}>
        <Text style={styles.button} onPress={navigation.goBack}>
          Go Back To Home Screen
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backround: {
    flex: 1,
    backroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    color: 'white',
    margin: 10,
    fontSize: 16,
    backgroundColor: '#191F24',
    padding: 10,
    paddingHorizontal: 15,
  },
});
