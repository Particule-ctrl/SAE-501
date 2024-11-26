// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { Link } from 'expo-router';


// import Header from '../../components/home/Header';
// import Map from '../../components/home/Map';
// import MainPage from '../../components/home/MainPage';

// export default function Home() {
//   return (
//         <View style={styles.container}>
//           {/* Scrollable Main Page */}
//           {/* <ScrollView contentContainerStyle={styles.scrollContent}>
//             <Header />
//             <Map />
//             <MainPage />
//           </ScrollView> */}
    
//           {/* Uncomment the link if needed */}
//           <View style={styles.styleText}>
//             <Link href="../">
//                 <Text style={styles.linkText}>Go to interface</Text>
//             </Link>
//           </View>
          



//         {/* <View>
//           <ScrollView  style={styles.scrollContent}>
//             <MainPage/>
//           </ScrollView>
//           <Map/>
          
//         </View> */}

        
        
          
           
          
          
            


//         </View>
//     );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: 'blue',
//     backgroundColor: "red", 
//     // marginTop: 30, 

    
//   },

//   scrollContent: {
//     zIndex: 100
//   },
//   linkText: {
//     fontSize: 56,
//     textAlign: 'center',
//   },

//   styleText: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// });

import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importez `useNavigation` pour gérer les options d'en-tête
import { Link } from 'expo-router'; // Utilisez `Link` de `expo-router` pour la navigation

export default function Home() {
  const navigation = useNavigation();

  // Masquer l'en-tête (header)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>

      <View style={styles.linkContainer}>
        <Link href="../">
          <Text style={styles.linkText}>Go to interface</Text>
        </Link>
      </View>
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
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 20, // Ajout d'un espacement au-dessus du lien
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#007BFF', // Couleur du lien (bleu par défaut)
    textDecorationLine: 'underline', // Souligne le texte pour indiquer un lien
  },
});

