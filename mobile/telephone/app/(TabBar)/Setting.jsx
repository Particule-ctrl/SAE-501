import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

// Composant pour afficher le profil utilisateur
const UserProfile = ({ profile, onEdit, onDelete }) => (
  <View style={styles.profileUserContainer}>
    <Text style={styles.profileUserLabel}>Prénom</Text>
    <Text style={styles.profileUserValue}>{profile.firstName}</Text>

    <Text style={styles.profileUserLabel}>Nom</Text>
    <Text style={styles.profileUserValue}>{profile.lastName}</Text>

    <Text style={styles.profileUserLabel}>Email</Text>
    <Text style={styles.profileUserValue}>{profile.email}</Text>

    <Text style={styles.profileUserLabel}>Téléphone</Text>
    <Text style={styles.profileUserValue}>{profile.tel || 'Non renseigné'}</Text>

    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
      <Text style={styles.buttonText}>Modifier le profil</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <Text style={styles.buttonText}>Supprimer le compte</Text>
    </TouchableOpacity>
  </View>
);

// Composant pour modifier le profil utilisateur
const EditProfile = ({ editedProfile, onChange, onSave, onCancel }) => (
  <>
    <TextInput
      style={styles.input}
      value={editedProfile.firstName}
      onChangeText={(text) => onChange({ ...editedProfile, firstName: text })}
      placeholder="Prénom"
    />
    <TextInput
      style={styles.input}
      value={editedProfile.lastName}
      onChangeText={(text) => onChange({ ...editedProfile, lastName: text })}
      placeholder="Nom"
    />
    <TextInput
      style={styles.input}
      value={editedProfile.email}
      onChangeText={(text) => onChange({ ...editedProfile, email: text })}
      placeholder="Email"
      keyboardType="email-address"
    />
    <TextInput
      style={styles.input}
      value={editedProfile.tel}
      onChangeText={(text) => onChange({ ...editedProfile, tel: text })}
      placeholder="Téléphone"
      keyboardType="phone-pad"
    />
    <TextInput
      style={styles.input}
      value={editedProfile.password}
      onChangeText={(text) => onChange({ ...editedProfile, password: text })}
      placeholder="Mot de passe (laisser vide pour ne pas changer)"
      secureTextEntry
    />

    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
      <Text style={styles.buttonText}>Sauvegarder</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
      <Text style={styles.buttonText}>Annuler</Text>
    </TouchableOpacity>
  </>
);

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const router = useRouter();
  const auth = getAuth();
  const [id, setId] = useState(null);


setId
  // Récupérer les données utilisateur
  const fetchUserProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
      }

      const response = await fetch(`http://192.168.139.235/api/user/byGoogleID/${userId}`);
      if (response.ok) {
        const responseData = await response.json();
        setId(responseData.id);
        setProfile({
          firstName: responseData.name.split(' ')[0] || '',
          lastName: responseData.name.split(' ')[1] || '',
          email: responseData.email || '',
          tel: responseData.tel || '',
        });

        setEditedProfile({
          firstName: responseData.name.split(' ')[0] || '',
          lastName: responseData.name.split(' ')[1] || '',
          email: responseData.email || '',
          tel: responseData.tel || '',
          password: responseData.password || '',
        });
        console.log(responseData);
      } else {
        Alert.alert('Erreur', 'Données utilisateur non disponibles.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les données utilisateur.');
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
 // const handleLogout = async () => {
 //   try {
 //     await signOut(auth);
 //     Alert.alert('Déconnexion réussie !');
 //     router.push('/index');
 //   } catch (error) {
 //     Alert.alert('Erreur', 'Impossible de se déconnecter.');
 //   }
 // };

  // Modification du profil
  const handleSaveProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const response = await fetch(`http://192.168.139.235/api/user/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProfile),
      }
    );
      console.log(response.url);
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour.');
      }

      Alert.alert('Succès', 'Profil mis à jour.');
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    }
  };

  // Suppression du profil
  const handleDeleteProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const response = await fetch(`http://192.168.139.235/api/user/byGoogleID/${userId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression.');
      }
      const responseData = await response.json();
      let id = responseData.id;
      console.log(id);
      const pu = await fetch(`http://192.168.139.235/api/user/delete/${id}`);
      if (pu.ok) {
        Alert.alert('Compte supprimé', 'Votre compte a été supprimé.');
        //handleLogout();
      }
     
    } catch (error) {
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
        <EditProfile
          editedProfile={editedProfile}
          onChange={setEditedProfile}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <UserProfile profile={profile} onEdit={() => setIsEditing(true)} onDelete={handleDeleteProfile} />
      )}

      <TouchableOpacity style={styles.logoutButton} >
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
    backgroundColor: '#192031',
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
    color: 'white',
  },
  profileUserContainer: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileUserLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
  },
  profileUserValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  editButton: {
    backgroundColor: '#12b2a6',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  logoutButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  cancelButton: {
    backgroundColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

