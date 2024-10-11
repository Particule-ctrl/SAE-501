import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


export default function index() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                ber
            </Text>
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