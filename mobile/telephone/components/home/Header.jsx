import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { db } from '../../app/authentication/firebaseConfig';
import SearchBar from './SearchBar';

import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Header() {
  const navigation = useNavigation();
  const [pending, setPending] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  // Hide header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setPending(true); // Start loading
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.log("Aucun utilisateur trouvé avec cet UID !");
          }
        } else {
          console.log("Aucun utilisateur connecté !");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      } finally {
        setPending(false); // Stop loading
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {pending && (
        <View style={styles.pending}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      

      <View style={styles.box}>
        <View style={styles.container2}>
          <View style={styles.leftContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("./../../assets/Profile/profil.jpeg")}
                style={styles.logo}
              />
            </View>
            <View style={styles.ConText}>
              <Text style={styles.Text1}>Bienvenue,</Text>
              {user && user.Name && (
                <Text style={styles.Text2}> {user.Name.split(' ')[0]} 👋</Text>
              )}
            </View>
            <View style={styles.ConText2}>
              <Text style={styles.Text3}>
                Réservez votre titre de transport facilement et en toute sérénité
              </Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            {user && <Text style={styles.Text3}> {user.Name} </Text>}
          </View>
        </View>
      </View>

      <View style={styles.box2}>
          <SearchBar/>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
  },
  box: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: "#192031",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    zIndex: 20,
  },

  box2: {
    width: 380,
    height: 450,
    top: 220,
    zIndex:26,
    position: 'absolute',
  },
  pending: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000000",
    opacity: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "red",
    marginTop: 40,
    left: 25,
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 66,
  },
  leftContainer: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  logoWrapper: {
    paddingRight: 8,
    marginTop: 52,
    left: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2, // Largeur de la bordure
    borderColor: "white", // Couleur de la bordure
  },
  rightContainer: {
    width: "37%",
    height: 45,
    backgroundColor: "grey",
    marginTop: 60,
    borderRadius: 25,
  },
  ConText: {
    marginTop: 42,
    left: 10,
    height: 25,
  },
  Text1: {
    color: "grey",
    fontStyle: "italic",
  },
  Text2: {
    color: "red",
    marginTop: 3,
    fontWeight: "bold",
  },
  ConText2: {
    width: 300,
    marginTop:240,
    marginLeft: 1,
    height: 80,
    right:120
  },
  Text3: {
    color: "white",
    marginTop: 3,
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize:20
  },
});