import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';

export default function Header() {
    const [trajets, setTrajets] = useState();
    const router = useRouter();
    const auth = getAuth();

    const extractTime = (dateTime) => {
        const timeMatch = dateTime.match(/T(\d{2}:\d{2}):/);
        if (timeMatch) {
            return timeMatch[1];
        }
        return 'Heure inconnue';
    };
    const extractDate = (dateTime) => {
        if (!dateTime) return 'Date inconnue';

        const regex = /(\d{4})-(\d{2})-(\d{2})/;
        const match = dateTime.match(regex);

        if (match) {
            const [, year, month, day] = match;
            return `${day}/${month}/${year}`;
        }

        return 'Date invalide';
    };

    const handleRefuser = (idDossier) => {
        setTrajets((prevTrajets) => prevTrajets.filter((trajet) => trajet['id-dossier'] !== idDossier));
    };

    const handleValider = (idDossier) => {
        setTrajets((prevTrajets) => prevTrajets.filter((trajet) => trajet['id-dossier'] !== idDossier));
        router.push({
            pathname: './Trajet',
            params: { idDossier },
        });
    };

    const getTrajets = async () => {
        try {
            console.log(`http://192.168.1.22/api/agent/getTrajetsFromUuid/${auth.currentUser.uid}`);
            const response = await fetch(`http://192.168.1.22/api/agent/getTrajetsFromUuid/${auth.currentUser.uid}`);
            const data = await response.json();
            setTrajets(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des trajets :', error);
        }
    };

    const retrievePassenger = async (idPMR) => {
        try {
            const response = await fetch(`http://192.168.1.22/api/user/${idPMR}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération du passager :', error);
        }
    };

    useEffect(() => {
        getTrajets();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={{ marginTop: 10 }}
                data={trajets}
                renderItem={({ item }) => (
                    <TouchableOpacity activeOpacity={0.9}>
                        <View style={styles.item}>
                            <View style={styles.top}>
                                <Text style={styles.header}>Jean Dupont</Text>
                                <Text style={styles.header}>{extractDate(item.departureTime)}</Text>
                            </View>
                            <View style={styles.middle}>
                                <Text style={styles.middleText}>{item.departure}</Text>
                                <Text style={styles.middleText}>{extractTime(item.departureTime)}</Text>
                            </View>
                            <View style={styles.bottom}>
                                <TouchableOpacity
                                    style={styles.buttonRouge}
                                    onPress={() => handleRefuser(item.idDossier)}
                                >
                                    <Text style={styles.bouttonText}>Refuser</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonVert}
                                    onPress={() => handleValider(item.idDossier)}
                                >
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
        backgroundColor: '#192031',
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
    },
});
