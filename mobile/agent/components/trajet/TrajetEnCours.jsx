import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import Scanner from './Scanner';

export default function CurrentTrajet({ id }) {
    const [trajet, setTrajet] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const cameraRef = useRef(null);
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        getTrajet();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);


    const checkPermission = async () => {
        const { status } = await requestPermission();
        setHasPermission(status === 'granted');
    };

    const getTrajet = async () => {
        try {
            const response = await fetch(`http://localhost/reservation/${id}`);
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

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log(photo.uri);
            setCameraActive(false);
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
            </View>
            <View style={styles.buttonSection}>
                <TouchableOpacity style={styles.buttonProbleme} onPress={() => { }}><Text style={styles.probleme}>Signaler un problème ?</Text></TouchableOpacity>
                <TouchableOpacity style={styles.buttonScan} onPress={() => setCameraActive(true)}><Text style={styles.scan}>Scanner le code</Text></TouchableOpacity>
            </View>

            {cameraActive && hasPermission && (
                <Scanner style={styles.Scanner} />
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

});
