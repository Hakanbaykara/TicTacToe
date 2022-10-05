import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Home'), {id};
      }
    });
  }, []);
  
  const newUserData = (id,email,score) => {
    database()
      .ref('scores/').child(id)
      .set({
        email,
        score,
      })
      .then(data => {
        console.log('data ', data);
      })
      .catch(error => {
        console.log('error ', error);
      });
  };

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, pass)
      .then(userCredentials => {
        const user = userCredentials.user;
        var uid = user.uid
        setId(uid)
        console.log('Registered with: ', user.email, "  ", user.uid);
        newUserData(uid,email,0);
      })
      .catch(error => alert(error.message))
  };

  return (
    <KeyboardAvoidingView style={styles.home} behavior="padding">
      <View>
        <Text style={{top: -200, fontSize: 30, left: 34}}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="What is your e-mail?"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={pass}
          onChangeText={setPass}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.login}>
          <Text>If you have an account</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[styles.button, styles.buttonOutLine]}>
            <Text style={styles.buttonOutLineText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 180,
    height: 50,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 15,
    padding: 7,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutLine: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'blue',
    borderWidth: 2,
  },
  buttonOutLineText: {
    color: 'blue',
    fontWeight: '700',
    fontSize: 16,
  },
  login: {
    top:146,
    width: '80%',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
});
