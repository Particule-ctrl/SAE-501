import React from 'react';
import { View, Text, StyleSheet, SafeAreaView} from 'react-native';
import { Link } from 'expo-router'
import Register from '../../components/Authentication/Register/Register';

export default function SignIn() {
    return (
        <View style={styles.background}>
          <SafeAreaView style={styles.container}>
            <Register/> 
          </SafeAreaView>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#282828',
    
      },
      container: {
        backgroundColor: '#192032',
        borderTopEndRadius: 60,
        borderTopStartRadius: 60,
        alignContent: 'center',
        padding: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '80%',
    },
      text: {
        fontSize: 16,
      },
    });
    