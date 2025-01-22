import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TransportService from '../services/TransportService';
import ReservationModal from '../../components/Reservation/ReservationModal';

const { width } = Dimensions.get('window');

const MapComponent = () => {
   const mapRef = useRef(null);
   const { departure, arrival, departureCoords, arrivalCoords } = useLocalSearchParams();
   const [selectedRoute, setSelectedRoute] = useState(null);
   const [routes, setRoutes] = useState([]);
   const [loading, setLoading] = useState(true);
   const [isExpanded, setIsExpanded] = useState(false);
   const [stations, setStations] = useState([]);
   const [airports, setAirports] = useState([]);
   const [showReservationModal, setShowReservationModal] = useState(false);
   const [selectedRouteForReservation, setSelectedRouteForReservation] = useState(null);

   const getSegmentColor = (mode) => {
       switch (mode) {
           case 'car': return '#2196F3';
           case 'train': return '#4CAF50'; 
           case 'plane': return '#FF9800';
           default: return '#666666';
       }
   };

   const getTransportIcon = (mode) => {
       switch (mode) {
           case 'car': return 'car-outline';
           case 'train': return 'train-outline';
           case 'plane': return 'airplane-outline';
           default: return 'navigate-outline';
       }
   };

   const convertGeoJSONtoCoordinates = (geometry) => {
       if (!geometry || !geometry.coordinates) return [];
       return geometry.coordinates.map(coord => ({
           latitude: coord[1],
           longitude: coord[0]
       }));
   };

   const formatDuration = (minutes) => {
       const hours = Math.floor(minutes / 60);
       const mins = Math.round(minutes % 60);
       return hours > 0 ? `${hours}h${mins}min` : `${mins}min`;
   };

   const formatPrice = (price) => {
       return Math.round(price).toString();
   };

   const handleReservation = (route) => {
     setSelectedRouteForReservation(route);
     setShowReservationModal(true);
   };

   const handleConfirmReservation = async (formData) => {
     try {
       const reservationData = generateReservationJson(selectedRouteForReservation);
       
       reservationData.baggage = formData.baggage.hasBaggage ? 
         Array(formData.baggage.count).fill().map((_, i) => i + 1) : [];
       
       reservationData.Assistance = 
         Object.values(formData.specialAssistance).some(value => 
           value === true || (typeof value === 'string' && value.length > 0)) ? 1 : 0;

       reservationData.metadata = {
         specialAssistance: formData.specialAssistance,
         additionalInfo: formData.additionalInfo
       };

       const response = await fetch('http://172.20.10.7:80/api/reservation', {
         method: "POST",
         headers: {
           Accept: "application/json",
           'Content-Type': "application/json",
         },
         body: JSON.stringify(reservationData)
       });

       if (!response.ok) {
         throw new Error('Erreur lors de la réservation');
       }

       Alert.alert('Succès', 'Réservation effectuée avec succès!', [
         {text: 'OK', onPress: () => router.push('/Trajets')}
       ]);
     } catch (error) {
       console.error('Erreur réservation:', error);
       Alert.alert('Erreur', 'Impossible de finaliser la réservation. Veuillez réessayer.');
     }
   };

   const fitMapToRoute = (route) => {
       if (!mapRef.current || !route) return;

       const allCoordinates = route.segments.flatMap(segment =>
           convertGeoJSONtoCoordinates(segment.geometry)
       );

       if (allCoordinates.length > 0) {
           mapRef.current.fitToCoordinates(allCoordinates, {
               edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
               animated: true
           });
       }
   };

   const selectRoute = (route) => {
       setSelectedRoute(route);
       fitMapToRoute(route);
   };

   const initializeData = async () => {
       if (!departureCoords || !arrivalCoords) {
           console.warn('Coordonnées manquantes');
           return;
       }

       try {
           setLoading(true);
           const startCoords = JSON.parse(departureCoords);
           const endCoords = JSON.parse(arrivalCoords);

           const departurePoint = {
               coords: startCoords,
               name: departure,
               type: 'address'
           };

           const arrivalPoint = {
               coords: endCoords,
               name: arrival,
               type: 'address'
           };

           const [nearbyStations, nearbyAirports] = await Promise.all([
               TransportService.findNearestStation(startCoords),
               TransportService.findNearestAirport(startCoords)
           ]);

           setStations([nearbyStations].filter(Boolean));
           setAirports([nearbyAirports].filter(Boolean));

           const multimodalRoutes = await TransportService.generateMultimodalRoutes(
               departurePoint,
               arrivalPoint
           );

           setRoutes(multimodalRoutes);

           if (multimodalRoutes.length > 0) {
               setSelectedRoute(multimodalRoutes[0]);
               fitMapToRoute(multimodalRoutes[0]);
           }
       } catch (error) {
           console.error('Erreur lors de l\'initialisation:', error);
           Alert.alert('Erreur', 'Impossible de charger les itinéraires. Veuillez réessayer.');
       } finally {
           setLoading(false);
       }
   };

   useEffect(() => {
       initializeData();
   }, [departureCoords, arrivalCoords]);

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
               {departureCoords && (
                   <Marker
                       coordinate={{
                           latitude: JSON.parse(departureCoords)[1],
                           longitude: JSON.parse(departureCoords)[0]
                       }}
                       title="Départ"
                       pinColor="#2196F3"
                   />
               )}

               {arrivalCoords && (
                   <Marker
                       coordinate={{
                           latitude: JSON.parse(arrivalCoords)[1],
                           longitude: JSON.parse(arrivalCoords)[0]
                       }}
                       title="Arrivée"
                       pinColor="#f44336"
                   />
               )}

               {stations.map((station, index) => (
                   <Marker
                       key={`station-${index}`}
                       coordinate={{
                           latitude: station.coords[1],
                           longitude: station.coords[0]
                       }}
                       title={station.name}
                   >
                       <View style={styles.markerContainer}>
                           <Ionicons name="train-outline" size={24} color="#4CAF50" />
                       </View>
                   </Marker>
               ))}

               {airports.map((airport, index) => (
                   <Marker
                       key={`airport-${index}`}
                       coordinate={{
                           latitude: airport.coords[1],
                           longitude: airport.coords[0]
                       }}
                       title={airport.name}
                   >
                       <View style={styles.markerContainer}>
                           <Ionicons name="airplane-outline" size={24} color="#FF9800" />
                       </View>
                   </Marker>
               ))}

               {selectedRoute && selectedRoute.segments.map((segment, index) => (
                   <React.Fragment key={`segment-${index}`}>
                       <Polyline
                           coordinates={convertGeoJSONtoCoordinates(segment.geometry)}
                           strokeColor={getSegmentColor(segment.mode)}
                           strokeWidth={4}
                           tappable={true}
                           onPress={() => {
                               Alert.alert(
                                   'Mode de transport',
                                   `${segment.mode === 'car' ? 'Trajet en voiture' : 
                                     segment.mode === 'train' ? 'Trajet en train' : 
                                     'Trajet en avion'}\n` +
                                   `De: ${segment.from.name}\n` +
                                   `À: ${segment.to.name}\n` +
                                   `Durée: ${formatDuration(segment.duration)}\n` +
                                   `Distance: ${Math.round(segment.distance / 1000)} km`
                               );
                           }}
                       />
                   </React.Fragment>
               ))}
           </MapView>

           <View style={styles.routesList}>
               <TouchableOpacity 
                   style={styles.routesHeader}
                   onPress={() => setIsExpanded(!isExpanded)}
               >
                   <Text style={styles.routesTitle}>Itinéraires disponibles ({routes.length})</Text>
                   <Ionicons 
                       name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"} 
                       size={24} 
                       color="#333"
                   />
               </TouchableOpacity>
               {isExpanded && (loading ? (
                   <ActivityIndicator size="large" color="#0000ff" />
               ) : (
                   <ScrollView 
                       horizontal 
                       style={styles.routesScrollView}
                       contentContainerStyle={styles.routesContentContainer}
                   >
                       {routes.map((route) => (
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
                                           <View key={index} style={styles.iconContainer}>
                                               <Ionicons
                                                   name={getTransportIcon(segment.mode)}
                                                   size={24}
                                                   color={getSegmentColor(segment.mode)}
                                                   style={styles.transportIcon}
                                               />
                                           </View>
                                       ))}
                                   </View>
                                   <Text style={[
                                       styles.routePrice,
                                       selectedRoute?.id === route.id && styles.selectedText
                                   ]}>
                                       {formatPrice(route.price)}€
                                   </Text>
                               </View>
                               <View style={styles.routeDetails}>
                                   <Text style={[
                                       styles.routeInfo,
                                       selectedRoute?.id === route.id && styles.selectedText
                                   ]}>
                                       {formatDuration(route.totalDuration)} • {Math.round(route.totalDistance)}km
                                   </Text>
                               </View>
                               {selectedRoute?.id === route.id && (
                                   <TouchableOpacity
                                       style={styles.reserveButton}
                                       onPress={() => handleReservation(route)}
                                   >
                                       <Text style={styles.reserveButtonText}>Réserver</Text>
                                   </TouchableOpacity>
                               )}
                           </TouchableOpacity>
                       ))}
                   </ScrollView>
               ))}
           </View>

           <ReservationModal
             visible={showReservationModal}
             onClose={() => setShowReservationModal(false)}
             onConfirm={handleConfirmReservation}
             route={selectedRouteForReservation}
           />
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
   markerContainer: {
       backgroundColor: 'white',
       borderRadius: 20,
       padding: 5,
       borderWidth: 1,
       borderColor: '#ddd',
   },
   routesList: {
       position: 'absolute',
       top: 40,
       left: 20,
       right: 20,
       backgroundColor: 'white',
       borderRadius: 12,
       padding: 16,
       maxHeight: '30%',
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
       elevation: 5,
   },
   routesHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       paddingVertical: 8,
       borderBottomWidth: 1,
       borderBottomColor: '#eee',
   },
   routesTitle: {
       fontSize: 16,
       fontWeight: '600',
       color: '#333',
   },
   routesScrollView: {
       marginTop: 8,
   },
   routesContentContainer: {
       flexDirection: 'row',
       alignItems: 'center',
   },
   routeCard: {
       backgroundColor: '#f5f5f5',
       borderRadius: 8,
       padding: 12,
       marginRight: 8,
       width: width * 0.6,
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
   iconContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: 'rgba(255, 255, 255, 0.9)',
       borderRadius: 12,
       padding: 4,
       marginRight: 8,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 1,
       },
       shadowOpacity: 0.2,
       shadowRadius: 1.41,
       elevation: 2,
   },
   transportIcon: {
       marginRight: 0,
   },
   routePrice: {
       fontSize: 16,
       fontWeight: 'bold',
       color: '#333',
   },
   routeDetails: {
       flexDirection: 'row',
       alignItems: 'center',
       marginTop: 4,
   },
   routeInfo: {
       fontSize: 14,
       color: '#666',
   },
   selectedText: {
    color: 'white',
},
reserveButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
},
reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
},
summarySection: {
    marginBottom: 20,
},
summaryTitle: {
    color: '#12B3A8',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
},
summaryText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
},
segmentSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
segmentText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
}
});

export default MapComponent;