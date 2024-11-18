import React from "react";
import { StyleSheet, TextInput, Text, View } from 'react-native';

const RegisterItem = ({item}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{item.title}</Text>
            <TextInput
                style={styles.input}
            
            />  

        </View>
    );
};

export default RegisterItem;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#6a5acd',
        backgroundColor: '#E9E9E9',
        backgroundColor: 'blue',
    
    },
    text: {
        fontSize: 16,
        marginLeft: '10%',
        marginBottom: '1%',

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
