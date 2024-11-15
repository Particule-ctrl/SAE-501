import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router'
import Register from '../../components/Register';

export default function SignIn() {
    return (
        <View style={styles.container}>
          <Register />      
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6a5acd',
      },
      text: {
        fontSize: 16,
      },
    });
    