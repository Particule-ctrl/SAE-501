import { SafeAreaView, StyleSheet, Text, FlatList, Animated, View, Alert} from 'react-native';
import React, { useState, useRef } from 'react';

const DATA = [
    {
        id: '1',
        depart: 'blablabla',
        destination: 'blobloblo',
        date: '01/01/2021',
        points: '2',
    },
    {
        id: '2',
        depart: 'piririri',
        destination: 'paraa',
        date: '01/01/2021',
        points: '8',
    },
    {
        id: '3',
        depart: 'dzdzdzdz',
        destination: 'mrmrmr',
        date: '09/02/2025',
        points: '4',
        etapes : ['dzdzdzdz', 'mrmrmr']
    },
];

export default function Tickets() {
    return (
        <SafeAreaView style={styles.container}>
            <FlatList data={DATA} 
                renderItem={({ item }) => ( 
                <View style={styles.item}>
                    <Text style={styles.title}>{item.depart}</Text>
                    <Text style={styles.title}>{item.destination}</Text>
                    <Text style={styles.title}>{item.date}</Text>
                    <Text style={styles.title}>{item.points}</Text>
                </View>
                )
            }
            keyExtractor={item => item.id}
            />

        </SafeAreaView>
    )

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 20,
        },
        item: {
            backgroundColor: '#f9c2ff',
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
        },
        title: {
            fontSize: 32,
        },
    });
}
