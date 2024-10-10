import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';


export default function Home() {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>
            HOME
        </Text>
        <Link href="../">
          <Text>Go to interface</Text>
        </Link>
        
        
    </View>
  )
}


const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "red",
   
},
text: {
  fontSize: 16,
},
});