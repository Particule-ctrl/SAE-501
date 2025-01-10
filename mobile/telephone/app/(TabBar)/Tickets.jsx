import React from 'react';
import { View, StyleSheet } from 'react-native';
import Tickets from '../../components/home/Tickets/Tickets';

export default function TrajetsListe() {
    return (
        <View style={styles.container}>
            <Tickets />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#90ee90',
    },
});
