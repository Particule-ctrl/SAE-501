import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const router = useRouter();
  const auth = getAuth();
  const [id, setId] = useState(null);

  const ipaddress = '192.168.1.29';  // changer ipaddress par rapport au reseau

  const fetchUserProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
      }

      const response = await fetch(`http://${ipaddress}/api/user/byGoogleID/${userId}`);
      if (response.ok) {
        const responseData = await response.json();
        setId(responseData.id);
        const [firstName, lastName] = responseData.name.split(' ') || ['', ''];
        setProfile({ firstName, lastName, email: responseData.email, tel: responseData.tel });
        setEditedProfile({ firstName, lastName, email: responseData.email, tel: responseData.tel, password: '' });
      } else {
        Alert.alert('Erreur', 'Données utilisateur non disponibles.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les données utilisateur.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`http://${ipaddress}/api/user/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour.');
      Alert.alert('Succès', 'Profil mis à jour.');
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const response = await fetch(`http://${ipaddress}/api/user/byGoogleID/${userId}`);
      if (!response.ok) throw new Error('Erreur lors de la suppression.');
      const responseData = await response.json();
      const pu = await fetch(`http://${ipaddress}/api/user/delete/${responseData.id}`);
      if (pu.ok) Alert.alert('Compte supprimé', 'Votre compte a été supprimé.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer le profil.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Utilisateur déconnecté avec succès !');
      router.replace('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error.message);
      Alert.alert('Erreur', 'Impossible de se déconnecter.');
    }
  };

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

      <View style={styles.mainContent}>
        {isEditing ? (
          <EditProfile
            editedProfile={editedProfile}
            onChange={setEditedProfile}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <UserProfile profile={profile} onEdit={() => setIsEditing(true)} onDelete={handleDeleteProfile} />
        )}

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192031',
    padding: 16,
  },
  mainContent: {
    width: '100%',
    alignItems: 'center',
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
    color: 'white',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  logoutButton: {
    backgroundColor: '#4B0082',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;