import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CGU() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Conditions Générales d'Utilisation</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>1. Objet et Acceptation</Text>
          <Text style={styles.paragraph}>
            Les présentes Conditions Générales d'Utilisation régissent l'utilisation de l'application C&FM, une plateforme de planification de voyages adaptés. En utilisant l'application, vous acceptez d'être lié par ces conditions.
          </Text>

          <Text style={styles.title}>2. Services Proposés</Text>
          <Text style={styles.paragraph}>
            C&FM propose des services de planification d'itinéraires adaptés, incluant :
            - Organisation de trajets multimodaux
            - Assistance aux personnes à mobilité réduite
            - Accompagnement personnalisé
            - Gestion des réservations de transport
            - Suivi en temps réel des trajets
          </Text>

          <Text style={styles.title}>3. Protection des Données Personnelles</Text>
          <Text style={styles.paragraph}>
            Conformément au RGPD, nous collectons et traitons vos données personnelles pour :
            - La création et gestion de votre compte
            - L'organisation de vos trajets
            - L'amélioration de nos services
            
            Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
          </Text>

          <Text style={styles.title}>4. Accessibilité et Non-Discrimination</Text>
          <Text style={styles.paragraph}>
            C&FM s'engage à fournir des services accessibles à tous, sans discrimination liée au handicap, conformément aux lois en vigueur. Nous garantissons une assistance adaptée selon les besoins spécifiques de chaque utilisateur.
          </Text>

          <Text style={styles.title}>5. Réservations et Paiements</Text>
          <Text style={styles.paragraph}>
            Les réservations sont confirmées après validation du paiement. Les tarifs incluent:
            - Le coût du transport
            - Les frais d'assistance si requis
            - Les frais de service C&FM
          </Text>

          <Text style={styles.title}>6. Utilisation de la Reconnaissance d'Image</Text>
          <Text style={styles.paragraph}>
            La fonctionnalité de scan de documents d'identité est soumise à :
            - Votre consentement explicite
            - Une utilisation limitée à la vérification d'identité
            - Des mesures strictes de sécurité des données
          </Text>

          <Text style={styles.title}>7. Responsabilités</Text>
          <Text style={styles.paragraph}>
            C&FM s'engage à :
            - Assurer la fiabilité des services proposés
            - Sécuriser vos données personnelles
            - Fournir une assistance en cas de problème
            
            L'utilisateur s'engage à :
            - Fournir des informations exactes
            - Respecter les conditions d'utilisation
            - Ne pas utiliser le service de manière frauduleuse
          </Text>

          <Text style={styles.title}>8. Annulation et Remboursement</Text>
          <Text style={styles.paragraph}>
            Les conditions d'annulation varient selon :
            - Le type de transport
            - Le délai avant le départ
            - Les conditions des prestataires
          </Text>

          <Text style={styles.title}>9. Propriété Intellectuelle</Text>
          <Text style={styles.paragraph}>
            Tous les éléments de l'application sont protégés par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
          </Text>

          <Text style={styles.title}>10. Modifications des CGU</Text>
          <Text style={styles.paragraph}>
            C&FM se réserve le droit de modifier ces conditions. Les utilisateurs seront informés des changements substantiels.
          </Text>

          <Text style={styles.title}>11. Contact et Support</Text>
          <Text style={styles.paragraph}>
            Pour toute question ou réclamation :
            - Email : support@cfm.com
            - Téléphone : +33 XXXXXXXXX
            - Formulaire de contact dans l'application
          </Text>

          <Text style={styles.title}>12. Droit Applicable</Text>
          <Text style={styles.paragraph}>
            Ces CGU sont soumises au droit français. Tout litige relève de la compétence des tribunaux français.
          </Text>
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