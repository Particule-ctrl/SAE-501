import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router, useNavigation } from 'expo-router';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Modifier pour suivre l'état de l'utilisateur
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // navigation.replace('Home'); // Rediriger vers Home après une connexion réussie
      router.replace("../(TabBar)/Home")
    } catch (error) {
      console.error('Sign in error:', error.message);
      alert(error.message); // Afficher un message d'erreur en cas d'échec
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Page</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4a460',
  },
  text: {
    fontSize: 24,
    marginBottom: 24,
    color: 'white',
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#4B0082',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 16,
    color: 'white',
    marginTop: 16,
  },
});
