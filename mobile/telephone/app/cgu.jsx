import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CGU() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header avec bouton retour */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Conditions Générales d'Utilisation</Text>
        </View>

        {/* Contenu des CGU */}
        <View style={styles.content}>
          <Text style={styles.title}>1. Objet</Text>
          <Text style={styles.paragraph}>
            Les présentes Conditions Générales d'Utilisation déterminent les règles d'accès et d'utilisation des services proposés par C&FM.
          </Text>

          <Text style={styles.title}>2. Services</Text>
          <Text style={styles.paragraph}>
            C&FM propose des services de planification et d'organisation de voyages sécurisés pour les familles.
          </Text>

          {/* Ajoutez d'autres sections selon vos besoins */}
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
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: '#12B3A8',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
  },
  paragraph: {
    color: 'white',
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 16,
  },
});