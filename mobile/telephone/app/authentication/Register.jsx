import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router'

export default function Register() {
    return (
        <View style={styles.container}>
          <Text style={styles.text}>Register Page</Text>
          <Link href="./Login">
            <Text>Go to Login</Text>
          </Link>
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
    