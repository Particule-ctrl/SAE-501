import { ProgressBar, Colors } from 'react-native-paper';
import { View, StyleSheet, Text } from 'react-native';

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
                "arrivalTime": "2024-12-24 04:25:44",
                "statusValue": 2
            },
            {
                "BD": "AF",
                "numDossier": 5555,
                "departure": "LAX",
                "arrival": "CDG",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44",
                "statusValue": 2
            },
            {
                "BD": "RATP",
                "numDossier": 8901,
                "departure": "Chatelet",
                "arrival": "Saint Lazare",
                "departureTime": "2024-12-23 03:25:44",
                "arrivalTime": "2024-12-24 04:25:44",
                "statusValue": 1
            }
        ],
        "bagage": [1234, 4321]
    },


];

export default function OnGoingHeader() {
    const ongoingSubTrajets = DATA.flatMap(dossier =>
        dossier.sousTrajets.filter(trajet => trajet.statusValue === 1)
    );

    return (
        <View>
            {ongoingSubTrajets.map((trajet, index) => (
                <View key={index} style={styles.header}>
                    <Text>{trajet.departure} {trajet.arrival}</Text>
                    <Text>{trajet.departureTime} - {trajet.arrivalTime}</Text>
                    <ProgressBar progress={0.5} />
                </View>
            ))}
        </View>
    );


}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
});