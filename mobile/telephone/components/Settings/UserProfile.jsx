import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Photo from '../Photos/Photo';

const UserProfile = ({ profile, onEdit, onDelete }) => {
  const [avatar, setAvatar] = useState(profile.avatar || null); // État pour l'avatar

  const handleAvatarUpdate = (newAvatarUrl) => {
    setAvatar(newAvatarUrl); // Mettre à jour l'avatar
  };

  return (
    <View style={styles.profileContainer}>
      {/* Afficher l'avatar */}
      <View style={styles.logoWrapper}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Photo onAvatarUpdate={handleAvatarUpdate} />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Prénom</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{profile.firstname}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{profile.lastname}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{profile.email}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Téléphone</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{profile.tel || 'Non renseigné'}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onEdit}>
        <Text style={styles.buttonText}>Modifier le profil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
        <Text style={styles.buttonText}>Supprimer le compte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E2D',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logoWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  inputContainer: {
    width: 330,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 5,
    fontWeight: '600',
  },
  valueContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#2C3A4A',
    borderRadius: 15,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A3A4A',
  },
  value: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserProfile;