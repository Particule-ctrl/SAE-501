import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome</Text>

      <Link href="/(TabBar)/Home">
        <Text>Go to Home page</Text>
      </Link>

      <Link href="/authentication/Register">
        <Text> Connect </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4682b4',
  },
  text: {
    fontSize: 16,
  },
});
