import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Tickets from '../../components/home/Tickets/Tickets';

export default function TrajetsListe() {
    return (
        <View style={styles.container}>
                <Text style={styles.text}>Trajets</Text>
            <Tickets />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#192031',
    },
    
});
