import React from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View } from 'react-native';

const DATA = [
    { id: '1', depart: 'Paris', destination: 'Tokyo', dateDepart: '01/01/2021', dateArriver: '03/01/2021', points: '2', ordre : ["bus", "plane"] },
    { id: '2', depart: 'Paris', destination: 'Moscou', dateDepart: '08/01/2022',dateArriver: '12/02/2023',dateArriver: '03/01/2021', points: '3', ordre : ["train", "bus", "train"] },
    { id: '3', depart: 'Paris', destination: 'Berlin', dateDepart: '09/02/2025',dateArriver: '19/02/2025', points: '4',  ordre : ["bus", "plane", "bus", "train"] },
];

export default function Tickets() {
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={DATA}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.lieu}>
                            <Text style={styles.destination}>{item.depart}</Text>
                            <Text style={styles.destination}>{item.destination}</Text>
                        </View>
                        <View style={styles.date}>
                        <Text style={styles.title}>{item.dateDepart}</Text>
                        <Text style={styles.title}>{item.dateArriver}</Text>
                        </View>
                        <Text style={styles.title}>{item.points}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 20,
        width: '100%',
    },
    item: {
        backgroundColor: '#f4f5f9',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
    },

    destination: {
        fontSize: 20,
    },
    lieu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    date: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    
});