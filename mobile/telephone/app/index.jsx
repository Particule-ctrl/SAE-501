import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const CMF = require('../assets/images/CMF_1.webp');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.viewContainer}>
          {/* Image Container */}
          <Animated.View entering={FadeInDown.duration(200).springify()} style={styles.viewTextContainer}>
            <Image source={CMF} style={styles.image} />
          </Animated.View>

          {/* First Subtitle */}
          <Animated.View entering={FadeInDown.duration(200).delay(200).springify()} style={styles.viewTextContainer2}>
            <Text style={styles.textSubtitle}>
              Voyagez serein, voyagez avec C&FM.
            </Text>
          </Animated.View>

          {/* Second Subtitle */}
          <Animated.View entering={FadeInDown.duration(200).delay(400).springify()} style={styles.viewTextContainer2}>
            <Text style={styles.textSubtitle2}>
              Choisir C&FM, c'est garantir à sa famille un voyage serein, sécurisé et dans les meilleures conditions.
            </Text>
          </Animated.View>

          {/* Buttons Container */}
          <Animated.View entering={FadeInDown.duration(200).delay(600).springify()} style={styles.ViewButton}>
            {/* Login Button */}
            <Pressable style={styles.Button} onPress={() => router.push("/authentication/Login")}>
              <Text style={styles.buttonText}>Connexion</Text>
            </Pressable>

            {/* Register Text and Button */}
            <Text style={styles.title}>Vous n'êtes pas encore inscrit ?</Text>
            <Pressable onPress={() => router.push("/authentication/Register")}>
              <Text style={styles.inscription}>Inscription</Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#192031',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  viewTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -60,
  },
  viewTextContainer2: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  textSubtitle: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textSubtitle2: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  ViewButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  Button: {
    height: 55,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#12B3A8',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    color: 'white',
    fontSize: 13,
    marginTop: 16,
  },
  inscription: {
    color: '#12B3A8',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 320,
    resizeMode: 'contain',
    marginBottom: 24,
  },
});