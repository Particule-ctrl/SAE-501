import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Link } from 'expo-router';



export default function Maps() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Maps
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
      backgroundColor: "#daa520",
       
    },
    text: {
      fontSize: 16,
    },
  });