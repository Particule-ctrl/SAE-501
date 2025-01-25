import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';


const DATA = [
    {
        "id-dossier": 1234,
        "idPMR": 1234,
        "enregistre": 0,
        "Assistance": 1,
        "sousTrajets": [
            {
                "BD": "SNCF",
                "numDossier": 1234,
                "departure": "Paris Est",
                "arrival": "CDG",
                "departureTime": "2024-12-22 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-40 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-40 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            }
        ],
        "bagage": [1234, 4321]
    },
        {
        "id-dossier": 127834,
        "idPMR": 1234,
        "enregistre": 0,
        "Assistance": 1,
        "sousTrajets": [
            {
                "BD": "SNCF",
                "numDossier": 1234,
                "departure": "Paris Est",
                "arrival": "CDG",
                "departureTime": "2025-12-27 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-40 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-40 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            }
        ],
        "bagage": [1234, 4321]
    },
        {
        "id-dossier": 143434,
        "idPMR": 1234,
        "enregistre": 0,
        "Assistance": 1,
        "sousTrajets": [
            {
                "BD": "SNCF",
                "numDossier": 1234,
                "departure": "Paris Est",
                "arrival": "CDG",
                "departureTime": "2024-12-40 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-40 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-40 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            }
        ],
        "bagage": [1234, 4321]
    },
    
];

export default function Header() {
    const [trajets, setTrajets] = useState([]);
    const router = useRouter();

    const exctratTime = (time) => {
        return time.split(' ')[1];
    };

    const exctratDate = (time) => {
        let date = time.split(' ')[0];
        let [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleRefuser = (idDossier) => {
        setTrajets((prevTrajets) => prevTrajets.filter(trajet => trajet['id-dossier'] !== idDossier));
    };
    useEffect(() => {
        setTrajets(DATA); 
    }, []);

    const handleValider = (idDossier) => {
    router.push({
        pathname: './Trajet',
        params: { idDossier }, 
    });
};

    

    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                style={{ marginTop: 10 }}
                data={trajets}
                keyExtractor={(item) => item['id-dossier'].toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
                        <View style={[styles.item]}>
                            <View style={styles.top}>
                                <Text style={styles.header}>Jean Dupont</Text>
                                <Text style={styles.header}>{exctratDate(item.sousTrajets[0].departureTime)}</Text>
                            </View>
                            <View style={styles.middle}>
                                <Text style={styles.middleText}>Gare du nord</Text>
                                <Text style={styles.middleText}>17:50:54</Text>
                            </View>
                            <View style={styles.bottom}>
                                <TouchableOpacity
                                    style={styles.buttonRouge}
                                    onPress={() => handleRefuser(item['id-dossier'])}
                                >
                                    <Text style={styles.bouttonText}>Refuser</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonVert}
                                onPress={() => handleValider(item['id-dossier'])}>
                                    <Text style={styles.bouttonText}>Accepter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'efefef',
    },
    item: {
        backgroundColor: '#2D3956',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: 'gray',
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',

    },
    middle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buttonVert: {
        backgroundColor: '#12B3A8',
        padding: 10,
        borderRadius: 2,
    },
    buttonRouge: {
        backgroundColor: '#df6058',
        padding: 10,
        borderRadius: 2,
    },
    bouttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    middleText: {
        fontSize: 16,
        color: 'white',

    }

});


