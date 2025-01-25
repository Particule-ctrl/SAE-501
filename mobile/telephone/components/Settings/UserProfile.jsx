import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserProfile = ({ profile, onEdit, onDelete }) => {
  const renderField = (label, value) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'Non renseigné'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {renderField('PRÉNOM', profile?.firstName)}
          {renderField('NOM', profile?.lastName)}
          {renderField('EMAIL', 'mail@mail.fr')}
          {renderField('TÉLÉPHONE', profile?.tel)}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onEdit}>
            <Text style={styles.buttonText}>Modifier le profil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <Text style={[styles.buttonText, styles.deleteText]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  profileContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    marginHorizontal: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, 
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    height: 100,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff40',
  },
  avatarText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  fieldWrapper: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 4,
    gap: 12,
  },
  button: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#0ea5e9',
  },
  deleteButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteText: {
    color: '#ef4444',
  },
 });

export default UserProfile;