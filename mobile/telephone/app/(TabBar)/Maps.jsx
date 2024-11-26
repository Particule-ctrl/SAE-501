import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { db } from '../authentication/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; // Importez `getDoc` pour obtenir un seul document
import { getAuth } from 'firebase/auth'; // Importez `getAuth` pour gérer l'utilisateur connecté

export default function Maps() {
  const [user, setUser] = useState(null); // Stocke les données de l'utilisateur
  const auth = getAuth(); // Initialisez Firebase Auth pour récupérer l'utilisateur connecté

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = auth.currentUser; // Récupère l'utilisateur connecté
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid); // Référence au document Firestore de l'utilisateur
          const userDoc = await getDoc(userDocRef); // Récupère le document Firestore
          if (userDoc.exists()) {
            setUser(userDoc.data()); // Stocke les données de l'utilisateur
          } else {
            console.log("Aucun utilisateur trouvé avec cet UID !");
          }
        } else {
          console.log("Aucun utilisateur connecté !");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        // Affiche les informations de l'utilisateur connecté
        <View>
          <Text style={styles.title}>Bienvenue, {user.FirstName} {user.LastName} !</Text>
          <Text>Âge : {user.Age}</Text>
          <Text>PMR : {user.PMR ? "Oui" : "Non"}</Text>
        </View>
      ) : (
        // Affiche un message de chargement
        <Text>Chargement des informations utilisateur...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
