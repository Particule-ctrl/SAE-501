import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { getAuth, signOut } from 'firebase/auth'; 
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const router = useRouter();
  const auth = getAuth();

  // Récupérer les données utilisateur
  const fetchUserProfile = async () => {
    try {
      const userId = auth.currentUser?.uid; // ID utilisateur depuis Firebase Auth
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
      }
  
      const response = await fetch(`http://192.168.92.235/api/user/byGoogleID/${userId}`);
      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);
      console.log('Response headers:', response.headers);  
      if (response.ok) {
        const responseData = await response.json(); 
        console.log('Données utilisateur :', responseData);
        setProfile(responseData); 
        setEditedProfile(responseData); 
      } else {
        console.error('Erreur de réponse:', response.status);
        Alert.alert('Erreur', 'Données utilisateur non disponibles.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil :', error);
      Alert.alert('Erreur', 'Impossible de récupérer les données utilisateur.');
    } finally {
      setLoading(false);
    }
  };
  

  // Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Déconnexion réussie !');
      router.push('/index');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter.');
    }
  };

  // Modification du profil
  const handleSaveProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const response = await fetch(`http://172.20.10.7:80/api/user/byGoogleID/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProfile),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour.');
      }
      Alert.alert('Succès', 'Profil mis à jour.');
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    }
  };

  // Suppression du profil
  const handleDeleteProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const response = await fetch(`http://192.168.92.235/api/user/byGoogleID/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression.');
      }
      Alert.alert('Compte supprimé', 'Votre compte a été supprimé.');
      handleLogout(); // Déconnecter après suppression
    } catch (error) {
      console.error('Erreur lors de la suppression du profil :', error);
      Alert.alert('Erreur', 'Impossible de supprimer le profil.');
    }
  };

  // Chargement des données au montage
  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Impossible de charger le profil utilisateur.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Utilisateur</Text>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editedProfile.name}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
            placeholder="Nom"
          />
          <TextInput
            style={styles.input}
            value={editedProfile.email}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
            placeholder="Email"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={editedProfile.phone}
            onChangeText={(text) => setEditedProfile({ ...editedProfile, phone: text })}
            placeholder="Téléphone"
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.buttonText}>Sauvegarder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Nom : {profile.name}</Text>
          <Text style={styles.label}>Email : {profile.email}</Text>
          <Text style={styles.label}>Téléphone : {profile.phone || 'Non renseigné'}</Text>

          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Modifier le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProfile}>
            <Text style={styles.buttonText}>Supprimer le compte</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    backgroundColor: '#ffffff',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});