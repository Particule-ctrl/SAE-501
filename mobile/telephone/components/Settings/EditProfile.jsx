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
     if (editedProfile.email !== user.email) {
       await updateEmail(user, editedProfile.email);
     }
     if (editedProfile.password) {
       await updatePassword(user, editedProfile.password);
     }
     const userDocRef = doc(firestore, 'users', user.uid);
     await updateDoc(userDocRef, {
       firstName: editedProfile.firstName,
       lastName: editedProfile.lastName,
       email: editedProfile.email,
       tel: editedProfile.tel,
     });
     Alert.alert('Succès', 'Profil mis à jour avec succès.');
     onSave();
   } catch (error) {
     console.error('Erreur lors de la mise à jour du profil :', error);
     Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
   }
 };

 return (
   <View style={styles.container}>
     <View style={styles.header}>
       <View style={styles.avatar}>
         <Text style={styles.avatarText}>
           {editedProfile?.firstName?.[0]}{editedProfile?.lastName?.[0]}
         </Text>
       </View>
     </View>

     <View style={styles.content}>
       <View style={styles.inputContainer}>
         <Text style={styles.label}>PRÉNOM</Text>
         <TextInput
           style={styles.input}
           value={"editedProfile.firstName"}
           onChangeText={(text) => onChange({ ...editedProfile, firstName: text })}
           placeholder="Entrez votre prénom"
           placeholderTextColor="#94a3b8"
         />
       </View>

       <View style={styles.inputContainer}>
         <Text style={styles.label}>NOM</Text>
         <TextInput
           style={styles.input}
           value={'editedProfile.lastName'}
           onChangeText={(text) => onChange({ ...editedProfile, lastName: text })}
           placeholder="Entrez votre nom"
           placeholderTextColor="#94a3b8"
         />
       </View>

       <View style={styles.inputContainer}>
         <Text style={styles.label}>EMAIL</Text>
         <TextInput
           style={styles.input}
           value={'editedProfile.email'}
           onChangeText={(text) => onChange({ ...editedProfile, email: text })}
           placeholder="Entrez votre email"
           keyboardType="email-address"
           placeholderTextColor="#94a3b8"
         />
       </View>

       <View style={styles.inputContainer}>
         <Text style={styles.label}>TÉLÉPHONE</Text>
         <TextInput
           style={styles.input}
           value={'editedProfile.tel'}
           onChangeText={(text) => onChange({ ...editedProfile, tel: text })}
           placeholder="Entrez votre téléphone"
           keyboardType="phone-pad"
           placeholderTextColor="#94a3b8"
         />
       </View>

       <View style={styles.inputContainer}>
         <Text style={styles.label}>MOT DE PASSE</Text>
         <TextInput
           style={styles.input}
           value={'editedProfile.password'}
           onChangeText={(text) => onChange({ ...editedProfile, password: text })}
           placeholder="Entrez un nouveau mot de passe"
           secureTextEntry
           placeholderTextColor="#94a3b8"
         />
       </View>

       <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
         <Text style={styles.buttonText}>Sauvegarder</Text>
       </TouchableOpacity>
       
       <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
         <Text style={[styles.buttonText, styles.cancelText]}>Annuler</Text>
       </TouchableOpacity>
     </View>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
  backgroundColor: '#0f172a',
  borderRadius: 20,
  marginHorizontal: 'auto',
  marginBottom: 30,
  marginTop: 70,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3, 
  shadowRadius: 8,
  elevation: 5,
 },
 header: {
   height: 120,
   backgroundColor: '#0ea5e9',
   alignItems: 'center',
   justifyContent: 'center',
   borderBottomLeftRadius: 20,
   borderBottomRightRadius: 20,
 },
 avatar: {
   width: 80,
   height: 80,
   borderRadius: 40,
   backgroundColor: 'rgba(255,255,255,0.2)',
   alignItems: 'center',
   justifyContent: 'center',
   borderWidth: 2,
   borderColor: 'rgba(255,255,255,0.3)',
 },
 avatarText: {
   fontSize: 26,
   color: '#ffffff',
   fontWeight: '600',
 },
 content: {
   flex: 1,
   padding: 20,
 },
 inputContainer: {
   marginBottom: 24,
 },
 label: {
   fontSize: 14,
   color: '#94a3b8',
   marginBottom: 8,
   fontWeight: '500',
 },
 input: {
   color: '#f8fafc',
   fontSize: 16,
   paddingVertical: 8,
   borderBottomWidth: 1,
   borderBottomColor: '#334155',
 },
 button: {
   borderRadius: 12,
   padding: 16,
   alignItems: 'center',
   marginTop: 8,
 },
 saveButton: {
   backgroundColor: '#0ea5e9',
   marginBottom: 12,
 },
 cancelButton: {
   backgroundColor: 'transparent',
   borderWidth: 1,
   borderColor: '#ef4444',
 },
 buttonText: {
   color: '#ffffff',
   fontSize: 16,
   fontWeight: '600',
 },
 cancelText: {
   color: '#ef4444',
 }
});

export default EditProfile;