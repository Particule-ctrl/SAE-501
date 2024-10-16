import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Text, Alert, View } from 'react-native';
import { Link } from 'expo-router'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        Alert.alert("Test");
    };

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <Link href="./Register" style={styles.pasCompte}>
                <Text>You don't have an account ?</Text>
            </Link>
            <Text style={ styles.mdpOublie }>Forgotten password ?</Text>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E9E9E9',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        justifyContent: 'center',
        padding: 5,
        position: 'absolute', 
        bottom: 0, 
        width: '100%',
        height: '80%',
    },
    title: {
        fontSize: 46,
        marginBottom: "15%",
        textAlign: 'center',
    },
    input: {
        height: 40,                
        borderColor: '#988F8F',    
        borderWidth: 1,            
        borderBottomWidth: 1,       
        borderRightWidth: 0,        
        borderLeftWidth: 0,
        borderTopWidth: 0,
        marginBottom: '5%',         
        paddingHorizontal: 8,       
        width: '80%',               
        alignSelf: 'center',       
      },
    loginButton: {
        width: '80%',
        alignSelf: 'center',
        backgroundColor: '#a83c54',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: "5%",
        padding: 10,

    },
    loginText: {
        color: 'white',
        fontSize: 20,
    },
    pasCompte: {
        textAlign: 'center',
        fontSize: 13,
        color: '#010292',
        marginBottom: "1%",
    },
    mdpOublie: {
        textAlign: 'center',
        fontSize: 13,
        color: '#010292',
    },
});
