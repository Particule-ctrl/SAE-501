import React from "react";
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Text, Alert, View } from 'react-native';

const RegisterItem = ({item}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{item.title}</Text>
            <TextInput
                style={styles.input}
                placeholder={item.placeholder}
            />  

        </View>
    );
};

export default RegisterItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6a5acd',
        backgroundColor: '#E9E9E9',

    },
    text: {
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: '#988F8F',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: '5%',
        paddingHorizontal: 8,
        width: '80%',
        alignSelf: 'center',
        backgroundColor: '#E9E9E9',
    },
});
