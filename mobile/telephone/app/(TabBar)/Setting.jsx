// import React from 'react'
// import {View, Text, StyleSheet} from 'react-native';
// import { Link } from 'expo-router';


// export default function Setting() {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.text}>
//                 Setting
//             </Text>
//             <Link href="../">
//               <Text>Go to interface</Text>
//             </Link>
            
//         </View>
//       )
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor: "#808080", 
//     },
//     text: {
//       fontSize: 16,
//     },
//   });

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { getAuth, signOut } from 'firebase/auth'; // Importez Firebase Auth pour gérer la déconnexion
import { useRouter } from 'expo-router'; // Pour naviguer vers app/index

import {br} from "./../index"

export default function Setting() {
  const router = useRouter(); // Initialisez le router pour la navigation
  const auth = getAuth(); // Récupérez Firebase Auth

  const handleLogout = async () => {
    try {
      await signOut(auth); // Déconnexion de l'utilisateur
      alert('Déconnexion réussie !');
      router.push("/index"); // Redirection vers app/index (racine)
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Paramètres</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    marginBottom: 24,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
