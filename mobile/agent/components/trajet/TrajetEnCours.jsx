import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';



const DATA =
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
}


export default function CurrentTrajet({ id }) {
    const [trajet, setTrajet] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const cameraRef = useRef(null);
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();

    useEffect(() => {
        getTrajet();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);


    const onScan = (result) => {
        if (result) {
            console.log("QR Code detected:", result.data);
            //changeTrajetStatue();
            setCameraActive(false);
        }
    };

    const changeTrajetStatue = async () => {
        try {
            if (status == 0) {
                await fetch(`http://192.168.1.22/reservation/setOngoing/${idDossier}/${idTrajet}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 1 }),
                });
            } else if (status == 1) {
                await fetch(`http://192.168.1.22/reservation/setDone/${idDossier}/${idTrajet}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 2 }),
                });
            } else {
                Alert.alert('Erreur', 'Le trajet est déjà terminé');
            }

        } catch (error) {
            console.error(error);
        }
    }

    const redirect = () => {
        router.navigate('Home');
    }
    const validerTrajet = () => {
        try {
            Alert.alert("Vous etes sur le point de valider le trajet", "Voulez-vous continuer ?", [{ text: "Annuler", onPress: () => console.log("Cancel Pressed"), style: "cancel" }, { text: "Valider", onPress: () => redirect() }]);

        } catch (error) {
            console.error(error);
        }
    }

    const checkPermission = async () => {
        const { status } = await requestPermission();
        setHasPermission(status === 'granted');
    };

    const getTrajet = async () => {
        try {
            const response = await fetch(`http://192.168.1.22/reservation/${id}`);
            const json = await response.json();
            console.log(json);
            if (response.ok) {
                setTrajet(json);
            } else {
                console.error(json);
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.textHeader}>Trajet en cours</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.bodyTop}>
                    <Text style={styles.textTop}>Nom : Jean Dupont</Text>
                    <Text style={styles.textTop}>Handicape : Sourd</Text>
                </View>
                <View style={styles.bodyTopMid}>
                    <Text style={styles.textMiddle}>Age : 25</Text>
                    <Text style={styles.textMiddle}>Naissance : 01/01/2000</Text>
                </View>
                <View style={styles.bodyMiddle}>
                    <Text style={styles.textMiddle}>Adresse : 12 rue des fleurs</Text>
                    <Text style={styles.textMiddle}>Ville : Paris</Text>
                </View>
                <View style={styles.bagage}>
                    <Text style={styles.textBagage}>Bagage : 2</Text>
                </View>
                <View style={styles.bodyMidBot}>
                    <View style={styles.trajetDepart}>
                        <Text style={styles.textTrajet}>Lieu de Départ : Gare de Lyon</Text>
                        <Text style={styles.textTrajet}>Heure : 14h30</Text>
                    </View>
                    <View style={styles.trajetArrivee}>
                        <Text style={styles.textTrajet}>Lieu d'Arrivée : CDG</Text>
                        <Text style={styles.textTrajet}>Heure : 14h45</Text>
                    </View>

                </View>
                <TouchableOpacity style={styles.buttonScan} onPress={() => setCameraActive(true)}><Text style={styles.scan}>Scanner le code</Text></TouchableOpacity>

            </View>
            <View style={styles.buttonSection}>
                <TouchableOpacity style={styles.buttonProbleme} onPress={() => { }}><Text style={styles.probleme}>Signaler un problème ?</Text></TouchableOpacity>
                <TouchableOpacity style={styles.buttonValider} onPress={() => validerTrajet()}><Text style={styles.valider}>Valider trajet</Text></TouchableOpacity>
            </View>

            {cameraActive && hasPermission && (
                <CameraView style={styles.scanContainer} facing={facing} barcodeScannerSettings={{ barcodeTypes: ["qr"], }} onBarcodeScanned={onScan}>
                    <View style={styles.scanZone} />
                </CameraView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#192031',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    body: {
        padding: 10,
        borderWidth: 0.3,
        borderColor: 'gray',
        width: '95%',
        height: '60%',
        backgroundColor: '#2D3956',
    },
    bodyTop: {
        padding: 10,
    },
    bodyMiddle: {
        padding: 10,
    },
    textMiddle: {
        fontSize: 18,
        color: 'white',
    },
    textTop: {
        fontSize: 18,
        color: 'white',
    },
    bodyMidBot: {
        borderWidth: 0.2,
        padding: 10,
        backgroundColor: '#334160',
        marginTop: 30,
    },
    textBottom: {
        fontSize: 18,
        color: 'white',
    },
    bodyTopMid: {
        padding: 10,
    },
    trajetDepart: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    trajetArrivee: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textTrajet: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
    },
    buttonSection: {
        marginTop: 10,
        width: '95%',
        alignItems: 'center',
    },
    buttonProbleme: {
        borderColor: '#df6058',
        borderWidth: 2,
        padding: 10,
        borderRadius: 2,
        margin: 10,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    buttonScan: {
        backgroundColor: '#12B3A8',
        padding: 10,
        borderRadius: 2,
        margin: 10,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    probleme: {
        color: '#df6058',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    scan: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bagage: {
        padding: 10,
    },
    textBagage: {
        fontSize: 18,
        color: 'white',
    },
    scanContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    scanZone: {
        width: 200,
        height: 200,
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonValider: {
        borderColor: 'green',
        backgroundColor: "green",
        borderWidth: 2,
        padding: 10,
        borderRadius: 2,
        margin: 10,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    valider: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },

});
