import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { PLACE_TYPES } from '../../../constants/PLACE_TYPES';
import { TRANSPORT_MODES } from '../../../constants/TRANSPORT_MODES';
import { API_CONFIG } from '../../../constants/API_CONFIG';

const MapComponent = ({ selectedDeparture, selectedArrival, selectedJourney }) => {
    const mapRef = useRef(null);
    const [routeCoordinates, setRouteCoordinates] = useState(null);

    const getDirections = async (start, end) => {
        if (!start || !end) return;

        try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.coords[0]},${start.coords[1]};${end.coords[0]},${end.coords[1]}?geometries=geojson&access_token=${API_CONFIG.mapbox}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const coordinates = data.routes[0].geometry.coordinates.map(coord => ({
                    latitude: coord[1],
                    longitude: coord[0]
                }));
                setRouteCoordinates(coordinates);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'itinéraire:', error);
        }
    };

    const updateMap = () => {
        if (!mapRef.current) return;

        const coordinates = [];
        
        if (selectedDeparture) {
            coordinates.push({
                latitude: selectedDeparture.coords[1],
                longitude: selectedDeparture.coords[0]
            });
        }

        if (selectedArrival) {
            coordinates.push({
                latitude: selectedArrival.coords[1],
                longitude: selectedArrival.coords[0]
            });
        }

        if (routeCoordinates) {
            coordinates.push(...routeCoordinates);
        }

        if (coordinates.length > 0) {
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true
            });
        }
    };

    useEffect(() => {
        if (selectedDeparture && selectedArrival) {
            getDirections(selectedDeparture, selectedArrival);
        } else {
            setRouteCoordinates(null);
        }
    }, [selectedDeparture, selectedArrival]);

    useEffect(() => {
        updateMap();
    }, [selectedDeparture, selectedArrival, routeCoordinates]);

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: 48.8566,
                    longitude: 2.3522,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {selectedDeparture && (
                    <Marker
                        coordinate={{
                            latitude: selectedDeparture.coords[1],
                            longitude: selectedDeparture.coords[0]
                        }}
                        title="Départ"
                        description={selectedDeparture.name}
                        pinColor={PLACE_TYPES[selectedDeparture.type.toUpperCase()]?.markerColor}
                    />
                )}

                {selectedArrival && (
                    <Marker
                        coordinate={{
                            latitude: selectedArrival.coords[1],
                            longitude: selectedArrival.coords[0]
                        }}
                        title="Arrivée"
                        description={selectedArrival.name}
                        pinColor={PLACE_TYPES[selectedArrival.type.toUpperCase()]?.markerColor}
                    />
                )}

                {routeCoordinates && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#2196F3"
                        strokeWidth={4}
                    />
                )}

                {selectedJourney && selectedJourney.segments.map((segment, index) => {
                    const mode = TRANSPORT_MODES[segment.mode.toUpperCase()];
                    const coordinates = segment.geometry.coordinates.map(coord => ({
                        latitude: coord[1],
                        longitude: coord[0]
                    }));

                    return (
                        <Polyline
                            key={index}
                            coordinates={coordinates}
                            strokeColor={mode.lineColor}
                            strokeWidth={4}
                            lineDashPattern={segment.mode === 'plane' ? [5, 5] : null}
                        />
                    );
                })}
            </MapView>
        </View>
    );
};

export default MapComponent;