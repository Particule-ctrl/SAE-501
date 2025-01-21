// TransportService.js
import { API_CONFIG } from '../../constants/API_CONFIG';

class TransportService {
    static calculateDistance(fromCoords, toCoords) {
        const R = 6371e3; // Rayon de la Terre en mètres
        const φ1 = fromCoords[1] * Math.PI / 180;
        const φ2 = toCoords[1] * Math.PI / 180;
        const Δφ = (toCoords[1] - fromCoords[1]) * Math.PI / 180;
        const Δλ = (toCoords[0] - fromCoords[0]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    static async getDetailedRoadRoute(from, to) {
        try {
            console.log('Calcul itinéraire routier entre:', from.name, 'et', to.name);
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/` +
                `${from.coords[0]},${from.coords[1]};${to.coords[0]},${to.coords[1]}?` +
                `geometries=geojson&overview=full&steps=true&access_token=${API_CONFIG.mapbox}`
            );

            if (!response.ok) {
                console.error('Erreur Mapbox:', response.status);
                throw new Error('Erreur Mapbox');
            }
            const data = await response.json();
            if (!data.routes || data.routes.length === 0) {
                throw new Error('Pas de route trouvée');
            }
            
            return {
                mode: 'car',
                duration: data.routes[0].duration / 60,
                distance: data.routes[0].distance,
                geometry: data.routes[0].geometry,
                from: { name: from.name, coords: from.coords },
                to: { name: to.name, coords: to.coords }
            };
        } catch (error) {
            console.error('Erreur itinéraire routier:', error);
            return null;
        }
    }

    static getApproximateGares() {
        return [
            {
                id: 'paris_nord',
                name: 'Paris Nord',
                type: 'station',
                coords: [2.3558, 48.8809]
            },
            {
                id: 'marseille_st_charles',
                name: 'Marseille Saint-Charles',
                type: 'station',
                coords: [5.3802, 43.3028]
            },
            {
                id: 'lyon_part_dieu',
                name: 'Lyon Part-Dieu',
                type: 'station',
                coords: [4.8590, 45.7605]
            },
            {
                id: 'bordeaux_st_jean',
                name: 'Bordeaux Saint-Jean',
                type: 'station',
                coords: [-0.5562, 44.8264]
            },
            {
                id: 'toulouse_matabiau',
                name: 'Toulouse Matabiau',
                type: 'station',
                coords: [1.4542, 43.6111]
            },
            {
                id: 'nantes',
                name: 'Nantes',
                type: 'station',
                coords: [-1.5420, 47.2172]
            }
        ];
    }

    static getApproximateAirports() {
        return [
            {
                id: 'cdg',
                name: 'Paris Charles de Gaulle',
                type: 'airport',
                coords: [2.5479, 49.0097]
            },
            {
                id: 'ory',
                name: 'Paris Orly',
                type: 'airport',
                coords: [2.3652, 48.7262]
            },
            {
                id: 'mrs',
                name: 'Marseille Provence',
                type: 'airport',
                coords: [5.2145, 43.4365]
            },
            {
                id: 'lys',
                name: 'Lyon Saint-Exupéry',
                type: 'airport',
                coords: [5.0887, 45.7256]
            },
            {
                id: 'bod',
                name: 'Bordeaux-Mérignac',
                type: 'airport',
                coords: [-0.7156, 44.8283]
            },
            {
                id: 'tls',
                name: 'Toulouse-Blagnac',
                type: 'airport',
                coords: [1.3674, 43.6293]
            },
            {
                id: 'nce',
                name: 'Nice Côte d\'Azur',
                type: 'airport',
                coords: [7.2146, 43.6584]
            }
        ];
    }

    static async findNearestStation(coords, excludeId = null) {
        console.log('Recherche de gare près de:', coords);
        const stations = this.getApproximateGares();
        
        let nearest = null;
        let minDistance = Infinity;
        
        stations.forEach(station => {
            if (excludeId && station.id === excludeId) return;
            
            const distance = this.calculateDistance(coords, station.coords);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = station;
            }
        });

        if (nearest) {
            nearest.distance = minDistance;
        }
        
        console.log('Gare la plus proche trouvée:', nearest?.name);
        return nearest;
    }

    static async findNearestAirport(coords, excludeId = null) {
        console.log('Recherche d\'aéroport près de:', coords);
        const airports = this.getApproximateAirports();
        
        let nearest = null;
        let minDistance = Infinity;
        
        airports.forEach(airport => {
            if (excludeId && airport.id === excludeId) return;
            
            const distance = this.calculateDistance(coords, airport.coords);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = airport;
            }
        });

        if (nearest) {
            nearest.distance = minDistance;
        }

        console.log('Aéroport le plus proche trouvé:', nearest?.name);
        return nearest;
    }

    static async getDetailedTrainRoute(fromStation, toStation) {
        try {
            console.log('Calcul itinéraire train entre:', fromStation.name, 'et', toStation.name);
            
            const directDistance = this.calculateDistance(fromStation.coords, toStation.coords);
            const estimatedDuration = (directDistance / 1000) / 120 * 60; // Vitesse moyenne de 120 km/h
            
            // Création de points intermédiaires pour une trajectoire plus réaliste
            const numPoints = 5;
            const coordinates = [];
            for (let i = 0; i <= numPoints; i++) {
                const ratio = i / numPoints;
                const lat = fromStation.coords[1] + (toStation.coords[1] - fromStation.coords[1]) * ratio;
                const lon = fromStation.coords[0] + (toStation.coords[0] - fromStation.coords[0]) * ratio;
                
                // Ajout d'un léger décalage aléatoire pour un tracé plus naturel
                const offset = 0.02 * Math.sin(i * Math.PI / numPoints);
                coordinates.push([lon + offset, lat + offset]);
            }

            return {
                mode: 'train',
                duration: estimatedDuration,
                distance: directDistance,
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                },
                from: fromStation,
                to: toStation
            };
        } catch (error) {
            console.error('Erreur itinéraire train:', error);
            return null;
        }
    }

    static getFlightRoute(fromAirport, toAirport) {
        const distance = this.calculateDistance(fromAirport.coords, toAirport.coords);
        return {
            mode: 'plane',
            duration: (distance / 1000) / 800 * 60 + 120, // 800 km/h + 2h pour procédures
            distance: distance,
            geometry: {
                type: 'LineString',
                coordinates: [
                    fromAirport.coords,
                    [
                        (fromAirport.coords[0] + toAirport.coords[0]) / 2,
                        (fromAirport.coords[1] + toAirport.coords[1]) / 2 + 0.5
                    ],
                    toAirport.coords
                ]
            },
            from: fromAirport,
            to: toAirport
        };
    }

    static calculatePrice(route) {
        const prices = {
            car: { base: 0, perKm: 0.15 },
            train: { base: 10, perKm: 0.20 },
            plane: { base: 50, perKm: 0.30 }
        };

        return route.segments.reduce((total, segment) => {
            const price = prices[segment.mode];
            return total + price.base + (segment.distance / 1000 * price.perKm);
        }, 0);
    }

    static async generateMultimodalRoutes(departure, arrival) {
        try {
            console.log('Génération des routes entre:', departure.name, 'et', arrival.name);
            const routes = [];
            const directDistance = this.calculateDistance(departure.coords, arrival.coords);

            // Route directe en voiture
            const directRoute = await this.getDetailedRoadRoute(departure, arrival);
            if (directRoute) {
                routes.push({
                    id: `road-${Date.now()}`,
                    type: 'direct',
                    segments: [{ ...directRoute, color: '#2196F3' }],
                    totalDuration: directRoute.duration,
                    totalDistance: directRoute.distance / 1000
                });
            }

            // Itinéraire train
            const departureStation = await this.findNearestStation(departure.coords);
            const arrivalStation = await this.findNearestStation(arrival.coords);

            if (departureStation && arrivalStation && departureStation.id !== arrivalStation.id) {
                const toStation = await this.getDetailedRoadRoute(departure, departureStation);
                const train = await this.getDetailedTrainRoute(departureStation, arrivalStation);
                const fromStation = await this.getDetailedRoadRoute(arrivalStation, arrival);

                if (toStation && train && fromStation) {
                    routes.push({
                        id: `train-${Date.now()}`,
                        type: 'multimodal-train',
                        segments: [
                            { ...toStation, color: '#2196F3' },
                            { ...train, color: '#4CAF50' },
                            { ...fromStation, color: '#2196F3' }
                        ],
                        totalDuration: toStation.duration + train.duration + fromStation.duration,
                        totalDistance: (toStation.distance + train.distance + fromStation.distance) / 1000
                    });
                }
            }

            // Itinéraire avion pour les longues distances
            if (directDistance > 500000) {
                const departureAirport = await this.findNearestAirport(departure.coords);
                const arrivalAirport = await this.findNearestAirport(arrival.coords);

                if (departureAirport && arrivalAirport && departureAirport.id !== arrivalAirport.id) {
                    const toAirport = await this.getDetailedRoadRoute(departure, departureAirport);
                    const flight = this.getFlightRoute(departureAirport, arrivalAirport);
                    const fromAirport = await this.getDetailedRoadRoute(arrivalAirport, arrival);

                    if (toAirport && flight && fromAirport) {
                        routes.push({
                            id: `air-${Date.now()}`,
                            type: 'multimodal-air',
                            segments: [
                                { ...toAirport, color: '#2196F3' },
                                { ...flight, color: '#FF9800' },
                                { ...fromAirport, color: '#2196F3' }
                            ],
                            totalDuration: toAirport.duration + flight.duration + fromAirport.duration,
                            totalDistance: (toAirport.distance + flight.distance + fromAirport.distance) / 1000
                        });
                    }
                }

                // Itinéraire multimodal complet (avion + train)
                const departureAirportForMulti = await this.findNearestAirport(departure.coords);
                const midAirport = await this.findNearestAirport(
                    [(departure.coords[0] + arrival.coords[0]) / 2,
                     (departure.coords[1] + arrival.coords[1]) / 2],
                    departureAirportForMulti?.id
                );

                if (departureAirportForMulti && midAirport) {
                    // Transport vers l'aéroport de départ
                    const toFirstAirport = await this.getDetailedRoadRoute(departure, departureAirportForMulti);
                    // Vol vers l'aéroport intermédiaire
                    const firstFlight = this.getFlightRoute(departureAirportForMulti, midAirport);
                    
                    // Recherche d'une gare près de l'aéroport intermédiaire
                    const midStation = await this.findNearestStation(midAirport.coords);
                    const finalStation = await this.findNearestStation(arrival.coords, midStation?.id);

                    if (midStation && finalStation && midStation.id !== finalStation.id) {
                        const airportToStation = await this.getDetailedRoadRoute(midAirport, midStation);
                        const trainToFinal = await this.getDetailedTrainRoute(midStation, finalStation);
                        const finalDrive = await this.getDetailedRoadRoute(finalStation, arrival);

                        if (toFirstAirport && firstFlight && airportToStation && trainToFinal && finalDrive) {
                            routes.push({
                                id: `complete-multimodal-${Date.now()}`,
                                type: 'complete-multimodal',
                                segments: [
                                    { ...toFirstAirport, color: '#2196F3' },            // Voiture vers l'aéroport
                                    { ...firstFlight, color: '#FF9800' },              // Premier vol
                                    { ...airportToStation, color: '#2196F3' },         // Voiture vers la gare
                                    { ...trainToFinal, color: '#4CAF50' },             // Train
                                    { ...finalDrive, color: '#2196F3' }                // Voiture finale
                                ],
                                totalDuration: toFirstAirport.duration + firstFlight.duration + 
                                             airportToStation.duration + trainToFinal.duration + 
                                             finalDrive.duration,
                                totalDistance: (toFirstAirport.distance + firstFlight.distance + 
                                              airportToStation.distance + trainToFinal.distance + 
                                              finalDrive.distance) / 1000
                            });
                        }
                    }
                }
            }

            // Ajout des informations de prix et de CO2 pour chaque route
            const routesWithPrices = routes.map(route => {
                // Calcul du prix total
                const price = this.calculatePrice(route);
                
                // Calcul des émissions de CO2 approximatives par mode
                const co2Factors = {
                    car: 0.2,    // kg CO2 par km
                    train: 0.02, // kg CO2 par km
                    plane: 0.25  // kg CO2 par km
                };

                const co2Emissions = route.segments.reduce((total, segment) => {
                    return total + (segment.distance / 1000) * co2Factors[segment.mode];
                }, 0);

                return {
                    ...route,
                    price: price,
                    co2Emissions: co2Emissions
                };
            });

            // Tri des routes par durée
            const sortedRoutes = routesWithPrices.sort((a, b) => a.totalDuration - b.totalDuration);

            console.log('Routes générées:', sortedRoutes.length);
            return sortedRoutes;

        } catch (error) {
            console.error('Erreur génération itinéraires:', error);
            return [];
        }
    }

    // Nouvelles méthodes utilitaires pour l'analyse des itinéraires
    static getRouteDetails(route) {
        const segments = route.segments.map(segment => ({
            type: segment.mode,
            from: segment.from.name,
            to: segment.to.name,
            duration: Math.round(segment.duration),
            distance: Math.round(segment.distance / 1000)
        }));

        return {
            type: route.type,
            totalDuration: Math.round(route.totalDuration),
            totalDistance: Math.round(route.totalDistance),
            price: Math.round(route.price),
            co2Emissions: Math.round(route.co2Emissions),
            segments: segments
        };
    }

    static getRouteComparison(routes) {
        if (!routes || routes.length === 0) return null;

        const fastest = routes.reduce((prev, curr) => 
            prev.totalDuration < curr.totalDuration ? prev : curr
        );

        const cheapest = routes.reduce((prev, curr) => 
            prev.price < curr.price ? prev : curr
        );

        const greenest = routes.reduce((prev, curr) => 
            prev.co2Emissions < curr.co2Emissions ? prev : curr
        );

        return {
            fastest: this.getRouteDetails(fastest),
            cheapest: this.getRouteDetails(cheapest),
            greenest: this.getRouteDetails(greenest)
        };
    }

    // Méthode pour générer un résumé textuel de l'itinéraire
    static generateRouteSummary(route) {
        const details = this.getRouteDetails(route);
        const segments = details.segments.map(segment => {
            const duration = segment.duration;
            const distance = segment.distance;
            
            let transport;
            switch (segment.type) {
                case 'car':
                    transport = 'voiture';
                    break;
                case 'train':
                    transport = 'train';
                    break;
                case 'plane':
                    transport = 'avion';
                    break;
                default:
                    transport = segment.type;
            }

            return `${segment.from} → ${segment.to} en ${transport} (${distance} km, ${duration} min)`;
        });

        return {
            summary: `Trajet ${details.type} : ${Math.round(details.totalDistance)} km en ${Math.round(details.totalDuration)} minutes`,
            price: `Prix estimé : ${Math.round(details.price)}€`,
            co2: `Émissions CO2 : ${Math.round(details.co2Emissions)} kg`,
            segments: segments
        };
    }
}

export default TransportService;