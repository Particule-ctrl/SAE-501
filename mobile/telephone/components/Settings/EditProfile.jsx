import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

const EditProfile = ({ editedProfile, onChange, onSave, onCancel }) => (
  <View style={styles.container}>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        value={editedProfile.firstname}
        onChangeText={(text) => onChange({ ...editedProfile, firstname: text })}
        placeholder="Entrez votre prénom"
      />
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={editedProfile.lastname}
        onChangeText={(text) => onChange({ ...editedProfile, lastname: text })}
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

    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
      <Text style={styles.buttonText}>Sauvegarder</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
      <Text style={styles.buttonText}>Annuler</Text>
    </TouchableOpacity>
  </View>
);

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