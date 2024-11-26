import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated ,{ FadeInDown,  }from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {

  const CMF = require('../assets/images/CMF_1.webp');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.viewContainer}>
        <Animated.View entering={FadeInDown.duration(200).springify()} style={styles.viewTextContainer}>
          {/* <Text style={styles.textTitle}>Come and follow me</Text> */}
          <Image  source={CMF} style={styles.image} />

        </Animated.View>
        <Animated.View entering={FadeInDown.duration(200).delay(200).springify()} style={styles.viewTextContainer2}>
          <Text style={styles.textSubtitle}>
              Voyagez serein, voyagez avec C&FM.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(200).delay(400).springify()} style={styles.viewTextContainer2}>
          <Text style={styles.textSubtitle2}>
            Choisir C&FM, c'est garantir à sa famille un voyage serein, sécurisé et dans les meilleures conditions.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(200).delay(600).springify()} style={styles.ViewButton}>
          <Pressable style={styles.Button} onPress={()=> router.push("/authentication/Login")}>
            <Text style={styles.buttonText}>Connexion</Text>
          </Pressable>

          {/* <Link href="/authentication/Register"> */}
            <Text style={styles.title}>Vous etes pas encore inscrit ? </Text>
          {/* </Link> */}
          <Pressable onPress={()=> router.push("/authentication/Register")}>
            <Text style={styles.inscription}>Inscription</Text>
          </Pressable>
          
          
        </Animated.View>



      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#192031',
  },
  viewContainer: {
    height: '100%',
  },
  viewTextContainer: {
    height: "10%",
    display : "flex",
    alignItems: "center",
    justifyContent: "center",
    alignItems: 'center',
    margin: 32,
    marginTop: 45, 
  },
  viewTextContainer2: {
    height: "auto",
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 32,
  },
  textTitle: {
    color: 'white',
    fontSize: 20,
  },
  textSubtitle: {
    color: 'white',
    fontSize: 45,
  },

  textSubtitle2: {
    color: 'white',
    fontSize: 19,
  },

  ViewButton: {
    width: "auto",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  Button: {
    height: 55,
    width: "90%",
    display : "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#12B3A8"

  },
  buttonText: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 18, 
  },

  

  title: {
    color: "white",
    fontSize:13,
    paddingTop:20
  },
  inscription: {
    color: "#12B3A8",
    fontWeight: "bold",
    paddingTop:10
  }, 
  
  image: {
    width: 200, // Ajustez selon vos besoins
    height: 220,
    resizeMode: 'contain',
  },
});


