import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import BarreTrajet from './BarreTrajet';
import BarreVoyage from './BarreVoyages';
import QRCodeTrajet from './QRCodeTrajet';

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
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-23 03:25:44",
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
                "departureTime": "2025-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-23 03:25:44",
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
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            }
        ],
        "bagage": [1234, 4321]
    }, {
        "id-dossier": 1222234,
        "idPMR": 1234,
        "enregistre": 0,
        "Assistance": 1,
        "sousTrajets": [
            {
                "BD": "SNCF",
                "numDossier": 1234,
                "departure": "Paris Est",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            }
        ],
        "bagage": [1234, 4321]
    },
    {
        "id-dossier": 12212322234,
        "idPMR": 1234,
        "enregistre": 0,
        "Assistance": 1,
        "sousTrajets": [
            {
                "BD": "SNCF",
                "numDossier": 1234,
                "departure": "Paris Est",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            }
        ],
        "bagage": [1234, 4321]
    },
    {
        "id-dossier": 12234342234,
        "idPMR": 1234,
        "enregistre": 0,
        "Assistance": 1,
        "sousTrajets": [
            {
                "BD": "SNCF",
                "numDossier": 1234,
                "departure": "Paris Est",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44"
            }
        ],
        "bagage": [1234, 4321]
    },

];

export default function Tickets() {
    const [idTrajet, setID] = useState(null);
    const [isSousTrajet, setQRCode] = useState(null);


    const bouton = (id) => {
        setID(idTrajet === id ? null : id);

    };

    const exctratTime = (time) => {
        return time.split(' ')[1];
    };

    const exctratDate = (time) => {
        let date = time.split(' ')[0];
        let [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const qrCode = (id) => {
        setQRCode(isSousTrajet === id ? null : id);
    };

    const qrData = (id, idTrajet) => {
        const dataQR = JSON.stringify({
            trajet: DATA.find(item => item["id-dossier"] === id).sousTrajets.find(item => item.numDossier === idTrajet).numDossier,
            bagage: DATA.find(item => item["id-dossier"] === id).bagage
        });
        return dataQR;
    }


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={{ marginTop: 10 }}
                data={DATA}
                keyExtractor={(item) => item["id-dossier"].toString()}

                renderItem={({ item, index }) => (
                    <TouchableOpacity activeOpacity={0.9} onPress={() => bouton(item["id-dossier"])}>

                        <View style={[styles.item]}>
                            <View style={styles.top}>
                                <Text style={styles.idTrajet}>Id Trajet: {item["id-dossier"]}</Text>
                                <Text style={styles.idTrajet}>{exctratDate(item.sousTrajets[0].departureTime)}</Text>
                            </View>
                            <View style={styles.bottom}>
                                <Text style={styles.isAssisted}>Besoin assistance: {item.Assistance ? "Oui" : "Non"}</Text>
                                <Text style={styles.trajet}>Nombre trajet: {item.sousTrajets.length}</Text>
                            </View>
                            <BarreVoyage points={item.sousTrajets} ordre={["Train", "Plane", "Bus"]} />

                            {idTrajet === item["id-dossier"] && (
                                <View style={styles.details}>
                                    {item.sousTrajets.map((sousTrajet, index) => (
                                        <TouchableOpacity activeOpacity={0.9} onPress={() => qrCode(sousTrajet.numDossier)}>
                                            <View key={index} style={styles.sousTrajet}>
                                                <View style={styles.top}>
                                                    <Text style={styles.detailsDate}>{exctratDate(sousTrajet.departureTime)}</Text>
                                                    <Text style={styles.detailsDate}>{exctratDate(sousTrajet.arrivalTime)}</Text>
                                                </View>
                                                <View style={styles.place}>
                                                    <Text style={styles.lieu}>{sousTrajet.departure}</Text>
                                                    <Text style={styles.lieu}>{sousTrajet.arrival}</Text>
                                                </View>
                                                <View style={styles.time}>
                                                    <Text style={styles.detailsTime}>{exctratTime(sousTrajet.departureTime)}</Text>
                                                    <Text style={styles.detailsTime}>{exctratTime(sousTrajet.arrivalTime)}</Text>
                                                </View>
                                                <View style={styles.sousTrajetBarre}>
                                                    <BarreTrajet style={styles.sousTrajetBarre} />
                                                </View>

                                                {isSousTrajet === sousTrajet.numDossier && (
                                                    <View style={styles.qrCode}>
                                                        <QRCodeTrajet id={qrData(idTrajet, isSousTrajet)} />
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                ListFooterComponent={<View style={{ height: 120 }} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: 750,
        backgroundColor: '#FAF9F6',
        bottom: 0,
        borderRadius: 20,
    },
    item: {
        backgroundColor: '#f4f5f9',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 0.2,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    idTrajet: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'right',
    },
    isAssisted: {
        fontSize: 17,

    },
    trajet: {
        fontSize: 17,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    details: {
        marginTop: 10,
        padding: 10,

    },

    sousTrajet: {
        marginBottom: 20,
        borderRadius: 10,
        padding: 5,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 0.2,
    },
    place: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    lieu: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    time: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    detailsDate: {
        fontSize: 16,
    },
    detailsTime: {
        fontSize: 15,
    },
    qrCode: {
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
});