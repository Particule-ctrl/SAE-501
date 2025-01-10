import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Link } from 'expo-router';
import { Tickets } from '../../components/home/Tickets/Tickets';


export default function Trafic() {
    return (
        <View style={styles.container}>
            <Tickets />
        </View>
      )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#90ee90", 
    },
    text: {
      fontSize: 16,
    },
  });


