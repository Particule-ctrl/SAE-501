import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import BarreTrajet from './BarreTrajet';
import BarreVoyage from './BarreVoyages';
import QRCodeTrajet from './QRCodeTrajet';
import { getAuth } from 'firebase/auth';

export default function Tickets() {
    const [idTrajet, setID] = useState(null);
    const [isSousTrajet, setQRCode] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Nouvel état pour le chargement
    const googleID = getAuth().currentUser?.uid;

    const ipaddress = '172.20.10.2';

    // Fonction pour récupérer les trajets
    const retrieveTrajet = async () => {
        try {
            const response = await fetch(`http://${ipaddress}/api/reservation/bygoogleid/${googleID}`);
            const data = await response.json();
            console.log(data);
            setData(data); // Mettre à jour l'état data avec les données récupérées
            setIsLoading(false); // Les données sont chargées
        } catch (error) {
            console.log(error);
            setIsLoading(false); // Arrêter l'indicateur de chargement en cas d'erreur
        }
    };

    useEffect(() => {
        retrieveTrajet();
    }, []);

    const bouton = (id) => {
        setID(idTrajet === id ? null : id);
    };

    const exctratTime = (time) => {
        return time.split('T')[1].split('.')[0];
    };

    const exctratDate = (dateTime) => {
        const [date] = dateTime.split('T'); // On prend uniquement la partie avant le 'T'
        const [year, month, day] = date.split('-'); // On décompose la date
        return `${day}/${month}/${year}`; // On retourne la date formatée
    };
    
    const qrCode = (id) => {
        setQRCode(isSousTrajet === id ? null : id);
    };

    const qrData = (id, idTrajet) => {
        const dataQR = JSON.stringify({
            trajet: data.find(item => item["id-dossier"] === id).sousTrajets.find(item => item.numDossier === idTrajet).numDossier,
            bagage: data.find(item => item["id-dossier"] === id).bagage
        });
        return dataQR;
    };

    const getStatut = (data) => {
        return data.map(dateitem => dateitem.statusValue);
    };

    // Affichez un indicateur de chargement si les données ne sont pas encore prêtes
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Chargement des données...</Text>
            </SafeAreaView>
        );
    }

    // Une fois les données chargées, affichez le contenu principal
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={{ marginTop: 10 }}
                data={data} 
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
                            <BarreVoyage ordre={getStatut(item.sousTrajets)} style={styles.barres}/>

                            {idTrajet === item["id-dossier"] && (
                                <View style={styles.details}>
                                    {item.sousTrajets.map((sousTrajet, index) => (
                                        <TouchableOpacity activeOpacity={0.9} onPress={() => qrCode(sousTrajet.numDossier)} key={index}>
                                            <View style={styles.sousTrajet}>
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
                                                    <BarreTrajet progression={sousTrajet.statusValue} style={styles.sousTrajetBarre} />
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
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        color: 'gray',
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
    barres:{
        display:"flex",
        flex:1,
    }
    
    
});
