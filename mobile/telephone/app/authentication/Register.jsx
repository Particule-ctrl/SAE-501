import React, { useState, useLayoutEffect } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from './firebaseConfig'; // Import Firebase Auth et Firestore
import { doc, setDoc } from 'firebase/firestore'; // Import des fonctions Firestore

export default function Register() {
  // États pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Fonction pour gérer l'inscription
  const handleRegister = async () => {
    if (!firstName || !lastName || !age || !email || !password) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    try {
      // Étape 1 : Créer un utilisateur avec Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Étape 2 : Ajouter les informations dans Firestore
      const userDocRef = doc(db, "users", user.uid); // Document avec UID de l'utilisateur
      await setDoc(userDocRef, {
        FirstName: firstName,
        LastName: lastName,
        Age: parseInt(age), // Convertir l'âge en nombre
        Email: email,
      });

      console.log('Utilisateur enregistré avec succès et ajouté à Firestore !');
      alert('Inscription réussie !');
      router.push('./Login'); // Redirige vers la page Login après inscription
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error.message);
      alert('Erreur : ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.text}>Créer un compte</Text>

      {/* Champ Prénom */}
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Champ Nom */}
      <TextInput
        style={styles.input}
        placeholder="Nom"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Champ Âge */}
      <TextInput
        style={styles.input}
        placeholder="Âge"
        placeholderTextColor="#888"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      {/* Champ Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Champ Mot de passe */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Bouton S'inscrire */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6a5acd',
    paddingVertical: 20,
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
});
