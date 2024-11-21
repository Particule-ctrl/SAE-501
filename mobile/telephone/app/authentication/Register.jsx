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
  const [birthdate , setBirthdate] = useState('')
  const [civility, setCivility] = useState('')
  const [tel, setTel] = useState('')
  const [note , setNote] = useState('')

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Fonction pour gérer l'inscription
  const handleRegister = async () => {
    if (!firstName || !lastName || !age || !email || !password || !birthdate || !civility || !tel) {
      alert("Tous les champs sont obligatoires !");
      return;
    }
  
    if (isNaN(age) || age <= 0) {
      alert("Veuillez entrer un âge valide.");
      return;
    }

    if (isNaN(age) || age <= 18){
      alert("Vous devez etre majeur pour avoir un compte ")
    }
  
    if (!/\d{2}-\d{2}-\d{4}/.test(birthdate)) {
      alert("Veuillez entrer une date de naissance valide au format JJ-MM-AAAA.");
      return;
    }
  
    if (!/^\d{10}$/.test(tel)) {
      alert("Veuillez entrer un numéro de téléphone valide à 10 chiffres.");
      return;
    }

    try {
      // Étape 1 : Créer un utilisateur avec Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Combiner `firstName` et `lastName`
      const fullName = `${firstName} ${lastName}`;

      // Étape 2 : Ajouter les informations dans Firestore
      const userDocRef = doc(db, "users", user.uid); // Document avec UID de l'utilisateur
      await setDoc(userDocRef, {
        Name: fullName,
        Age: parseInt(age), // Convertir l'âge en nombre
        Email: email,
        Birthdate: birthdate,
        Civility: civility,
        Tel: tel,
        Note: note,
      });

      fetch('http://localhost/api/user', {
        method: "POST",
        mode: "no-cors", // Désactive les restrictions CORS
        headers: {
          Accept: "application/json",
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          name: fullName, 
          birthdate,
          email,
          tel,
          password,
          civility,
          note,
          googleUUID: user.uid,
        })
      })
      

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

      {/* Champ Date de naissance */}
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (JJ-MM-AAAA)"
        placeholderTextColor="#888"
        value={birthdate}
        onChangeText={setBirthdate}
      />

      {/* Champ Civilité */}
      <TextInput
        style={styles.input}
        placeholder="Civilité (Mr, Mme)"
        placeholderTextColor="#888"
        value={civility}
        onChangeText={setCivility}
      />

      {/* Champ Téléphone */}
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        placeholderTextColor="#888"
        value={tel}
        onChangeText={setTel}
        keyboardType="phone-pad"
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

      {/* Champ Note */}
      <TextInput
        style={styles.input}
        placeholder="Note (optionnel)"
        placeholderTextColor="#888"
        value={note}
        onChangeText={setNote}
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
