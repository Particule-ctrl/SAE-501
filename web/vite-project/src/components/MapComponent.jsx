import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { API_CONFIG } from '../constants/API_CONFIG';
import { PLACE_TYPES } from '../constants/PLACE_TYPES';
import { TRANSPORT_MODES } from '../constants/TRANSPORT_MODES';

const MapComponent = ({ selectedDeparture, selectedArrival, selectedJourney }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);
    const routesRef = useRef([]);

    useEffect(() => {
        if (!mapContainer.current) return;

        mapboxgl.accessToken = API_CONFIG.mapbox;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [2.3522, 48.8566], // Paris
            zoom: 11
        });

        map.current.addControl(new mapboxgl.NavigationControl());

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    const clearMap = () => {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        routesRef.current.forEach(routeId => {
            if (map.current.getLayer(routeId)) {
                map.current.removeLayer(routeId);
            }
            if (map.current.getSource(routeId)) {
                map.current.removeSource(routeId);
            }
        });
        routesRef.current = [];
    };

    const updateMap = () => {
        if (!map.current) return;

        clearMap();

        const bounds = new mapboxgl.LngLatBounds();

        if (selectedDeparture) {
            const marker = new mapboxgl.Marker({
                color: PLACE_TYPES[selectedDeparture.type.toUpperCase()]?.markerColor
            })
                .setLngLat(selectedDeparture.coords)
                .addTo(map.current);
            markersRef.current.push(marker);
            bounds.extend(selectedDeparture.coords);
        }

        if (selectedArrival) {
            const marker = new mapboxgl.Marker({
                color: PLACE_TYPES[selectedArrival.type.toUpperCase()]?.markerColor
            })
                .setLngLat(selectedArrival.coords)
                .addTo(map.current);
            markersRef.current.push(marker);
            bounds.extend(selectedArrival.coords);
        }

        if (selectedJourney) {
            selectedJourney.segments.forEach((segment, index) => {
                const routeId = `route-${index}`;
                if (!map.current.getSource(routeId)) {
                    routesRef.current.push(routeId);

                    map.current.addSource(routeId, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: segment.geometry
                        }
                    });

                    const mode = TRANSPORT_MODES[segment.mode.toUpperCase()];
                    const isPlane = segment.mode === 'plane';

                    map.current.addLayer({
                        id: routeId,
                        type: 'line',
                        source: routeId,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': mode.lineColor,
                            'line-width': 4,
                            'line-opacity': 0.8,
                            'line-dasharray': isPlane ? [2, 1] : []
                        }
                    });
                }

                if (segment.geometry.coordinates) {
                    segment.geometry.coordinates.forEach(coord => {
                        bounds.extend(coord);
                    });
                }
            });
        }

        if (bounds.getNorthEast() && bounds.getSouthWest()) {
            map.current.fitBounds(bounds, {
                padding: 50,
                duration: 2000,
                easing: (t) => t * (2 - t)
            });
        }
    };

    useEffect(() => {
        updateMap();
    }, [selectedDeparture, selectedArrival, selectedJourney]);

    return <div className="flex-1" ref={mapContainer} />;
};

export default MapComponent;