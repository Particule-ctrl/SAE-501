import React from 'react';
import { View, Image, StyleSheet } from 'react-native';


export default function Header() {
  return (
    <View style={styles.vprofil}>
      <Image style={styles.profil} source={require('../../assets/Profile/profil.jpeg')} />
    </View>
  )
}


const styles = StyleSheet.create({
    vprofil: {
        display: 'flex',
        marginTop: -7, 
        marginLeft: 20,
        zIndex: 3,
      },
      profil: {
        width: 50,
        height: 50,
        borderRadius: 25,
        top:50
      },
});