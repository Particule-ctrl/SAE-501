import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Link } from 'expo-router'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        Alert.alert('Login Info', `Email: ${email}, Password: ${password}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Se conecter</Text>
            <TextInput
                style={styles.input}
                placeholder="Adresse Mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Se conecter</Text>
            </TouchableOpacity>
            <Link href="./Register" style={styles.pasCompte}>
                <Text>Vous ne possedez pas de compte ?</Text>
            </Link>
            <Text style={ styles.mdpOublie }>Mot de passe oublié ?</Text>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 46,
        marginTop: 0,
        marginBottom: 80,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '988F8F',
        borderWidth: 1,
        marginBottom: 25,
        borderRadius: 10,
        paddingHorizontal: 8,
        width: '80%',
        alignSelf: 'center',
        height: 50,
        
    },
    loginButton: {
        width: '80%',
        alignSelf: 'center',
        height: 50,
        backgroundColor: 'gray',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        color: 'white',
        fontSize: 20,
    },
    pasCompte: {
        textAlign: 'center',
        fontSize: 13,
        color: 'blue',
        marginBottom: 20,
    },
    mdpOublie: {
        textAlign: 'center',
        fontSize: 13,
        color: 'blue',
    },
});
