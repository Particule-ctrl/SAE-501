import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router'

export default function Login() {
  return (
    <View style={styles.container}>
    <Text style={styles.text}>Login Page</Text>
    <Link href="./Register">
      <Text style={styles.text}>Go to Register</Text>
    </Link>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f4a460',
},
text: {
  fontSize: 16,
  marginTop: 24,
},
});

