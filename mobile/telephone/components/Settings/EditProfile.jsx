import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const EditProfile = ({ editedProfile, onChange, onSave, onCancel }) => {
  const auth = getAuth();
  const firestore = getFirestore();

  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      // Mettre à jour l'e-mail dans Firebase Authentication
      if (editedProfile.email !== user.email) {
        await updateEmail(user, editedProfile.email);
      }

      // Mettre à jour le mot de passe dans Firebase Authentication (si un nouveau mot de passe est fourni)
      if (editedProfile.password) {
        await updatePassword(user, editedProfile.password);
      }

      // Mettre à jour les informations supplémentaires dans Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        email: editedProfile.email,
        tel: editedProfile.tel,
      });

      Alert.alert('Succès', 'Profil mis à jour avec succès.');
      onSave(); // Appeler la fonction onSave pour fermer le mode édition ou rafraîchir les données
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={editedProfile.firstName}
          onChangeText={(text) => onChange({ ...editedProfile, firstName: text })}
          placeholder="Entrez votre prénom"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={editedProfile.lastName}
          onChangeText={(text) => onChange({ ...editedProfile, lastName: text })}
          placeholder="Entrez votre nom"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={editedProfile.email}
          onChangeText={(text) => onChange({ ...editedProfile, email: text })}
          placeholder="Entrez votre email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={editedProfile.tel}
          onChangeText={(text) => onChange({ ...editedProfile, tel: text })}
          placeholder="Entrez votre téléphone"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={editedProfile.password}
          onChangeText={(text) => onChange({ ...editedProfile, password: text })}
          placeholder="Entrez un nouveau mot de passe"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
        <Text style={styles.buttonText}>Sauvegarder</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%', // Largeur maximale de 90%
    minWidth: '75%', // Largeur minimale de 75%
    marginBottom: 7,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    minWidth: '90%',
    height: 40,
    backgroundColor: '#2C3A4A', // Fond sombre pour les champs
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: 'white',
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%', // Largeur maximale de 90%
    minWidth: '65%', // Largeur minimale de 75%
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditProfile;