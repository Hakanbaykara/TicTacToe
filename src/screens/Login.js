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

export default Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Home');
      }
    });
  }, []);

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, pass)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with: ', user.email);
      })
      .catch(error => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.home} behavior="padding">
      <View>
        <Text style={{top: -200, fontSize: 30, left: 50}}>Login</Text>
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
          onPress={handleLogin} 
          style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.login}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={[styles.button, styles.buttonOutLine]}>
            <Text style={styles.buttonOutLineText}>Go Back To Sign Up</Text>
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
  buttonOutLine: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'blue',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutLineText: {
    color: 'blue',
    fontWeight: '700',
    fontSize: 16,
  },
  login: {
    top: 146,
    width: '89%',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
});
