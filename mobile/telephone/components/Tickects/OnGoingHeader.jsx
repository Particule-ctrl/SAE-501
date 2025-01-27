import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';

export default function OnGoingHeader() {
    const [data, setData] = useState([]); // État pour stocker les données récupérées
    const [isLoading, setIsLoading] = useState(true); // État pour gérer le chargement
    const googleID = getAuth().currentUser?.uid;

    const ipaddress = '172.20.10.2';

    // Fonction pour récupérer les données
    const retrieveTrajet = async () => {
        try {
            const response = await fetch(`http://${ipaddress}/api/reservation/bygoogleid/${googleID}`);
            const data = await response.json();
            console.log("Données récupérées :", data);
            setData(data); // Met à jour l'état avec les données récupérées
        } catch (error) {
            console.log("Erreur :", error);
        } finally {
            setIsLoading(false); // Arrêter l'indicateur de chargement
        }
    };

    // Filtrer les sous-trajets en cours
    const ongoingSubTrajets = data.flatMap((dossier) =>
        dossier.sousTrajets?.filter((trajet) => trajet.statusValue === 1) || []
    );

    // Extraire l'heure d'une chaîne de date/heure
    const extractTime = (dateTime) => {
        return dateTime.split('T')[1].split('.')[0]; // Retourne "HH:MM:SS"
    };

    // Extraire la date d'une chaîne de date/heure
    const extractDate = (dateTime) => {
        const [date] = dateTime.split('T'); // On prend uniquement la partie avant le 'T'
        const [year, month, day] = date.split('-'); // On décompose la date
        return `${day}/${month}/${year}`; // On retourne la date formatée
    };

    // Convertir une chaîne "HH:MM:SS" en secondes
    const timeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    // Convertir des secondes en format "X heure(s) Y min"
    const secondsToReadableTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (minutes === 0) {
            return `${hours} h ${hours > 1 ? 's' : ''}`; // Exemple : "1 heure" ou "2 heures"
        } else {
            return `${hours} h${hours > 1 ? 's' : ''} ${pad(minutes)} min`; // Exemple : "1 heure 04 min"
        }
    };

    // Ajouter un zéro devant les nombres < 10
    const pad = (num) => {
        return num < 10 ? `0${num}` : num;
    };

    // Calculer la durée entre deux heures
    const calculateDuration = (trajet) => {
        const timeOne = extractTime(trajet.arrivalTime); // "HH:MM:SS"
        const timeTwo = extractTime(trajet.departureTime); // "HH:MM:SS"

        // Convertir les heures en secondes
        const timeOneSeconds = timeToSeconds(timeOne);
        const timeTwoSeconds = timeToSeconds(timeTwo);

        // Calculer la différence en secondes
        const durationSeconds = timeOneSeconds - timeTwoSeconds;

        // Convertir la différence en format lisible
        return secondsToReadableTime(durationSeconds);
    };

    // Charger les données lors du montage du composant
    useEffect(() => {
        retrieveTrajet();
    }, []);

    // Affichage de l'indicateur de chargement ou des sous-trajets
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement des trajets en cours...</Text>
            </View>
        );
    }

    return (
        <View>
            {ongoingSubTrajets.length > 0 ? (
                ongoingSubTrajets.map((trajet, index) => (
                    <View key={index} style={styles.trajetContainer}>
                        <Text style={styles.trajetText}>
                            <Text style={styles.locationText}>{trajet.departure}</Text>
                            <Text style={styles.specialText}> ---jusqu'à--- </Text>
                            <Text style={styles.locationText}>{trajet.arrival}</Text>
                        </Text>
                        <Text style={styles.trajetDetails}>
                            {extractDate(trajet.departureTime)} --- {calculateDuration(trajet)} --- {extractDate(trajet.arrivalTime)}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noTrajetText}>Aucun trajet en cours.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    trajetContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 25,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    trajetText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A3A3A',
        marginBottom: 5,
        textAlign: 'center',
    },
    locationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3A3A3A',
    },
    specialText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    trajetDetails: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    noTrajetText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});
