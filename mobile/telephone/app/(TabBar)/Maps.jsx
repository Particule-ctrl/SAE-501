import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PLACE_TYPES } from '../../constants/PLACE_TYPES';
import { API_CONFIG } from '../../constants/API_CONFIG';

const MapComponent = () => {
    const { departure, arrival, departureCoords, arrivalCoords } = useLocalSearchParams();
    const mapRef = useRef(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const [selectedArrival, setSelectedArrival] = useState(null);
    const [trainStations, setTrainStations] = useState([]); // Pour stocker les gares
    const [airports, setAirports] = useState([]); // Pour stocker les aéroports

    // Fonction pour obtenir les itinéraires multimodaux
    const getMultimodalRoutes = async (start, end) => {
        try {
            // Appel à l'API pour les itinéraires en voiture
            const carRoute = await getCarRoute(start, end);
            
            // Appel à l'API pour les itinéraires en train
            const trainRoute = await getTrainRoute(start, end);
            
            // Appel à l'API pour les itinéraires mixtes (train + voiture)
            const mixedRoute = await getMixedRoute(start, end);

            // Simulons différents types de trajets (à remplacer par les vraies données d'API)
            setRoutes([
                {
                    id: '1',
                    type: 'car',
                    segments: [
                        {
                            mode: 'car',
                            duration: 90, // en minutes
                            distance: 50, // en km
                            coordinates: carRoute,
                            color: '#2196F3'
                        }
                    ],
                    totalDuration: 90,
                    totalDistance: 50,
                    price: 25
                },
                {
                    id: '2',
                    type: 'train',
                    segments: [
                        {
                            mode: 'train',
                            duration: 60,
                            distance: 45,
                            coordinates: trainRoute,
                            color: '#4CAF50',
                            stations: [
                                { name: "Gare de départ", coords: [start[0], start[1]] },
                                { name: "Gare d'arrivée", coords: [end[0], end[1]] }
                            ]
                        }
                    ],
                    totalDuration: 60,
                    totalDistance: 45,
                    price: 35
                },
                {
                    id: '3',
                    type: 'mixed',
                    segments: [
                        {
                            mode: 'car',
                            duration: 20,
                            distance: 15,
                            coordinates: mixedRoute.car1,
                            color: '#2196F3'
                        },
                        {
                            mode: 'train',
                            duration: 45,
                            distance: 30,
                            coordinates: mixedRoute.train,
                            color: '#4CAF50',
                            stations: [
                                { name: "Gare intermédiaire 1", coords: mixedRoute.stations[0] },
                                { name: "Gare intermédiaire 2", coords: mixedRoute.stations[1] }
                            ]
                        },
                        {
                            mode: 'car',
                            duration: 15,
                            distance: 10,
                            coordinates: mixedRoute.car2,
                            color: '#2196F3'
                        }
                    ],
                    totalDuration: 80,
                    totalDistance: 55,
                    price: 45
                }
            ]);
        } catch (error) {
            console.error('Erreur lors de la récupération des itinéraires:', error);
        }
    };

    // Fonction pour obtenir l'itinéraire en voiture
    const getCarRoute = async (start, end) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${API_CONFIG.mapbox}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.routes[0].geometry.coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0],
        }));
    };

    // Fonction pour obtenir l'itinéraire en train
    const getTrainRoute = async (start, end) => {
        // Simuler un itinéraire en train (à remplacer par une vraie API de train)
        return [
            { latitude: start[1], longitude: start[0] },
            // Points intermédiaires simulant une voie ferrée
            { latitude: end[1], longitude: end[0] }
        ];
    };

    // Fonction pour obtenir l'itinéraire mixte
    const getMixedRoute = async (start, end) => {
        // Simuler un itinéraire mixte (à remplacer par une vraie API)
        const midPoint1 = {
            latitude: (start[1] + end[1]) * 0.3,
            longitude: (start[0] + end[0]) * 0.3
        };
        const midPoint2 = {
            latitude: (start[1] + end[1]) * 0.7,
            longitude: (start[0] + end[0]) * 0.7
        };

        return {
            car1: [
                { latitude: start[1], longitude: start[0] },
                { latitude: midPoint1.latitude, longitude: midPoint1.longitude }
            ],
            train: [
                { latitude: midPoint1.latitude, longitude: midPoint1.longitude },
                { latitude: midPoint2.latitude, longitude: midPoint2.longitude }
            ],
            car2: [
                { latitude: midPoint2.latitude, longitude: midPoint2.longitude },
                { latitude: end[1], longitude: end[0] }
            ],
            stations: [
                [midPoint1.longitude, midPoint1.latitude],
                [midPoint2.longitude, midPoint2.latitude]
            ]
        };
    };

    // Fonction pour récupérer les gares de train
    const fetchTrainStations = async () => {
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["railway"="station"](around:50000,48.8566,2.3522);out;`;
        try {
            const response = await fetch(overpassUrl);
            const data = await response.json();
            console.log('Données des gares:', data); // Afficher les données dans la console
            setTrainStations(data.elements);
        } catch (error) {
            console.error('Erreur lors de la récupération des gares:', error);
        }
    };

    // Fonction pour récupérer tous les aéroports
    const fetchAirports = async () => {
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["aeroway"="aerodrome"](around:50000,48.8566,2.3522);way["aeroway"="aerodrome"](around:50000,48.8566,2.3522);relation["aeroway"="aerodrome"](around:50000,48.8566,2.3522););out;`;
        try {
            const response = await fetch(overpassUrl);
            const data = await response.json();
            console.log('Données des aéroports:', data); // Afficher les données dans la console

            // Liste des aéroports connus (noms ou codes IATA)
            const knownAirports = ['CDG', 'ORY', 'Paris-Charles de Gaulle', 'Paris-Orly'];

            // Traiter les aéroports pour extraire les coordonnées
            const processedAirports = data.elements
                .map((airport) => {
                    let latitude, longitude;

                    if (airport.type === 'node') {
                        // Si c'est un node, utiliser directement lat et lon
                        latitude = airport.lat;
                        longitude = airport.lon;
                    } else if (airport.type === 'way' || airport.type === 'relation') {
                        // Si c'est un way ou une relation, utiliser le centre géométrique
                        latitude = airport.center?.lat;
                        longitude = airport.center?.lon;
                    }

                    return {
                        ...airport,
                        latitude,
                        longitude,
                    };
                })
                .filter((airport) => {
                    // Filtrer les aéroports connus
                    const name = airport.tags?.name || '';
                    const iata = airport.tags?.iata || '';
                    return knownAirports.includes(name) || knownAirports.includes(iata);
                })
                .filter((airport) => airport.latitude && airport.longitude); // Filtrer les aéroports sans coordonnées valides

            setAirports(processedAirports);
        } catch (error) {
            console.error('Erreur lors de la récupération des aéroports:', error);
        }
    };

    // Charger les données au montage du composant
    useEffect(() => {
        fetchTrainStations();
        fetchAirports();
    }, []);

    // Fonction pour sélectionner un itinéraire
    const selectRoute = (route) => {
        setSelectedRoute(route);
        
        // Ajuster la vue de la carte pour montrer l'itinéraire complet
        if (mapRef.current && route.segments) {
            const coordinates = route.segments.flatMap(segment => segment.coordinates);
            const minLat = Math.min(...coordinates.map(c => c.latitude));
            const maxLat = Math.max(...coordinates.map(c => c.latitude));
            const minLng = Math.min(...coordinates.map(c => c.longitude));
            const maxLng = Math.max(...coordinates.map(c => c.longitude));

            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true
            });
        }
    };

    // Charger les itinéraires multimodaux lorsque les coordonnées de départ et d'arrivée sont disponibles
    useEffect(() => {
        if (departureCoords && arrivalCoords) {
            const startCoords = JSON.parse(departureCoords);
            const endCoords = JSON.parse(arrivalCoords);

            setSelectedDeparture({
                coords: startCoords,
                name: departure,
                type: 'address',
            });

            setSelectedArrival({
                coords: endCoords,
                name: arrival,
                type: 'address',
            });

            getMultimodalRoutes(startCoords, endCoords);
        }
    }, [departureCoords, arrivalCoords]);

    // Fonction pour obtenir l'icône du mode de transport
    const getTransportIcon = (mode) => {
        switch (mode) {
            case 'car':
                return 'car-outline';
            case 'train':
                return 'train-outline';
            case 'plane':
                return 'airplane-outline';
            default:
                return 'navigate-outline';
        }
    };

    // Fonction pour formater la durée
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h${mins}min` : `${mins}min`;
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 48.8566,
                    longitude: 2.3522,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/* Afficher les gares de train avec une icône de train */}
                {trainStations.map((station, index) => (
                    <Marker
                        key={`station-${index}`}
                        coordinate={{
                            latitude: station.lat,
                            longitude: station.lon,
                        }}
                        title={station.tags?.name || 'Gare inconnue'}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="train-outline" size={24} color="#4CAF50" />
                        </View>
                    </Marker>
                ))}

                {/* Afficher les aéroports connus avec un logo d'avion personnalisé */}
                {airports.map((airport, index) => (
                    <Marker
                        key={`airport-${index}`}
                        coordinate={{
                            latitude: airport.latitude,
                            longitude: airport.longitude,
                        }}
                        title={airport.tags?.name || 'Aéroport inconnu'}
                    >
                        <Image
                            source={require('../../assets/images/airport-icon.png')} // Chemin vers votre logo d'avion
                            style={{ width: 30, height: 30 }}
                        />
                    </Marker>
                ))}

                {/* Afficher les itinéraires */}
                {selectedRoute && selectedRoute.segments.map((segment, index) => (
                    <React.Fragment key={index}>
                        <Polyline
                            coordinates={segment.coordinates}
                            strokeColor={segment.color}
                            strokeWidth={4}
                        />
                        {segment.stations?.map((station, stationIndex) => (
                            <Marker
                                key={`station-${index}-${stationIndex}`}
                                coordinate={{
                                    latitude: station.coords[1],
                                    longitude: station.coords[0],
                                }}
                                title={station.name}
                                pinColor="#FFC107"
                            />
                        ))}
                    </React.Fragment>
                ))}
            </MapView>

            <View style={styles.routesList}>
                <Text style={styles.routesTitle}>Itinéraires disponibles</Text>
                <ScrollView>
                    {routes.map(route => (
                        <TouchableOpacity
                            key={route.id}
                            style={[
                                styles.routeCard,
                                selectedRoute?.id === route.id && styles.selectedRouteCard
                            ]}
                            onPress={() => selectRoute(route)}
                        >
                            <View style={styles.routeHeader}>
                                <View style={styles.transportIcons}>
                                    {route.segments.map((segment, index) => (
                                        <Ionicons
                                            key={index}
                                            name={getTransportIcon(segment.mode)}
                                            size={24}
                                            color={selectedRoute?.id === route.id ? 'white' : '#666'}
                                            style={styles.transportIcon}
                                        />
                                    ))}
                                </View>
                                <Text style={[
                                    styles.routePrice,
                                    selectedRoute?.id === route.id && styles.selectedText
                                ]}>
                                    {route.price}€
                                </Text>
                            </View>
                            <View style={styles.routeDetails}>
                                <Text style={[
                                    styles.routeInfo,
                                    selectedRoute?.id === route.id && styles.selectedText
                                ]}>
                                    {formatDuration(route.totalDuration)} • {route.totalDistance}km
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    iconContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    routesList: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        width: '35%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    routesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    routeCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    selectedRouteCard: {
        backgroundColor: '#007AFF',
    },
    routeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    transportIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transportIcon: {
        marginRight: 8,
    },
    routePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    routeDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    routeInfo: {
        fontSize: 14,
        color: '#666',
    },
    selectedText: {
        color: 'white',
    },
});

export default MapComponent;