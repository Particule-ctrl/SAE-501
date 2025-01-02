import { API_CONFIG } from '../constants/API_CONFIG';

class TransportService {
    static calculateDistance(fromCoords, toCoords) {
        const R = 6371e3;
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

    static calculateFlightDuration(fromCoords, toCoords) {
        const distance = this.calculateDistance(fromCoords, toCoords);
        const averageSpeed = 800; // km/h
        return (distance / 1000) / averageSpeed * 60;
    }

    static async searchStations(query) {
        try {
            const response = await fetch(
                `https://api.sncf.com/v1/coverage/sncf/places?` +
                `q=${encodeURIComponent(query)}&type[]=stop_area&count=10`,
                {
                    headers: {
                        'Authorization': `Basic ${btoa(API_CONFIG.sncf + ':')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Erreur API SNCF');
            const data = await response.json();
            return data.places.map(place => ({
                id: place.id,
                name: place.name,
                type: 'station',
                coords: [place.stop_area.coord.lon, place.stop_area.coord.lat]
            }));
        } catch (error) {
            console.error('Erreur recherche stations:', error);
            return [];
        }
    }

    static async findNearbyStations(coords, radius = 5000) {
        try {
            const response = await fetch(
                `https://api.sncf.com/v1/coverage/sncf/coords/${coords[1]};${coords[0]}/places_nearby?` +
                `type[]=stop_area&distance=${radius}`,
                {
                    headers: {
                        'Authorization': `Basic ${btoa(API_CONFIG.sncf + ':')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Erreur API SNCF');
            const data = await response.json();

            if (!data.places_nearby || !Array.isArray(data.places_nearby)) {
                console.warn('Aucune station trouvée ou données invalides:', data);
                return [];
            }

            return data.places_nearby.map(place => ({
                id: place.id,
                name: place.name,
                type: 'station',
                coords: [place.stop_area.coord.lon, place.stop_area.coord.lat],
                distance: place.distance
            }));
        } catch (error) {
            console.error('Erreur recherche stations proximité:', error);
            return [];
        }
    }

    static async findNearbyAirports(coords) {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/airport.json?` +
                `proximity=${coords.join(',')}&` +
                `types=poi&` +
                `limit=3&` +
                `access_token=${API_CONFIG.mapbox}`
            );

            if (!response.ok) throw new Error('Erreur Mapbox');
            const data = await response.json();

            if (!data.features || !Array.isArray(data.features)) {
                console.warn('Aucun aéroport trouvé ou données invalides:', data);
                return [];
            }

            return data.features
                .filter(feature => feature.properties.category === 'airport')
                .map(feature => ({
                    id: feature.id,
                    name: feature.text,
                    type: 'airport',
                    coords: feature.center
                }));
        } catch (error) {
            console.error('Erreur recherche aéroports:', error);
            return [];
        }
    }

    static async findNearestStationOrAirport(coords) {
        const [stations, airports] = await Promise.all([
            this.findNearbyStations(coords),
            this.findNearbyAirports(coords)
        ]);

        // Retourne la station ou l'aéroport le plus proche
        const nearestStation = stations[0];
        const nearestAirport = airports[0];

        if (!nearestStation && !nearestAirport) {
            throw new Error('Aucune gare ou aéroport trouvé à proximité');
        }

        // Retourne le point le plus proche
        if (!nearestAirport || (nearestStation && nearestStation.distance < nearestAirport.distance)) {
            return nearestStation;
        } else {
            return nearestAirport;
        }
    }

    static async searchAddress(query) {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json` +
                `?access_token=${API_CONFIG.mapbox}&country=FR&types=address,poi`
            );

            if (!response.ok) throw new Error('Erreur Mapbox');
            const data = await response.json();

            if (!data.features || !Array.isArray(data.features)) {
                console.warn('Aucune adresse trouvée ou données invalides:', data);
                return [];
            }

            return data.features.map(feature => ({
                id: feature.id,
                name: feature.place_name,
                type: 'address',
                coords: feature.center
            }));
        } catch (error) {
            console.error('Erreur recherche adresse:', error);
            return [];
        }
    }

    static async getTrainRoute(from, to, datetime = new Date()) {
        try {
            const fromId = from.id.includes('SNCF') ? from.id : `stop_area:SNCF:${from.id}`;
            const toId = to.id.includes('SNCF') ? to.id : `stop_area:SNCF:${to.id}`;

            const response = await fetch(
                `https://api.sncf.com/v1/coverage/sncf/journeys?` +
                `from=${fromId}&` +
                `to=${toId}&` +
                `datetime=${datetime.toISOString()}&` +
                `data_freshness=realtime&` +
                `min_nb_journeys=5&` +
                `depth=2`,
                {
                    headers: {
                        'Authorization': `Basic ${btoa(API_CONFIG.sncf + ':')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Erreur API SNCF');
            const data = await response.json();

            if (!data.journeys || data.journeys.length === 0) {
                console.log('Aucun trajet en train trouvé directement');
                return [];
            }

            return data.journeys.map(journey => ({
                id: `train-${Date.now()}-${Math.random()}`,
                mode: 'train',
                departureTime: new Date(journey.departure_date_time),
                arrivalTime: new Date(journey.arrival_date_time),
                duration: journey.duration / 60,
                distance: this.calculateDistance(from.coords, to.coords),
                price: this.calculateTrainPrice(journey.duration / 60),
                returnable: true,
                segments: journey.sections
                    .filter(section => section.type === 'public_transport')
                    .map(section => ({
                        mode: 'train',
                        from: {
                            name: section.from.name,
                            coords: [section.from.stop_point.coord.lon, section.from.stop_point.coord.lat]
                        },
                        to: {
                            name: section.to.name,
                            coords: [section.to.stop_point.coord.lon, section.to.stop_point.coord.lat]
                        },
                        train_number: section.display_informations?.headsign || 'Train',
                        geometry: section.geojson
                    }))
            }));
        } catch (error) {
            console.error('Erreur route train:', error);
            return [];
        }
    }

    static async getPlaneRoute(from, to) {
        const distance = this.calculateDistance(from.coords, to.coords);
        const duration = this.calculateFlightDuration(from.coords, to.coords);

        return {
            id: `plane-${Date.now()}`,
            mode: 'plane',
            departureTime: new Date(),
            arrivalTime: new Date(Date.now() + duration * 60000),
            duration: duration,
            distance: distance,
            price: this.calculatePlanePrice(distance),
            returnable: true,
            segments: [{
                mode: 'plane',
                from: { name: from.name, coords: from.coords },
                to: { name: to.name, coords: to.coords },
                geometry: {
                    type: 'LineString',
                    coordinates: [from.coords, to.coords]
                }
            }]
        };
    }

    static async getRoadRoute(from, to, mode) {
        try {
            if (mode === 'plane') {
                return this.getPlaneRoute(from, to);
            }

            const profile = mode === 'car' ? 'driving' : 'driving-traffic';
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/${profile}/` +
                `${from.coords.join(',')};${to.coords.join(',')}?` +
                `geometries=geojson&overview=full&steps=true&` +
                `access_token=${API_CONFIG.mapbox}`
            );

            if (!response.ok) throw new Error('Erreur Mapbox');
            const data = await response.json();
            const route = data.routes[0];

            return {
                id: `${mode}-${Date.now()}`,
                mode: mode,
                departureTime: new Date(),
                arrivalTime: new Date(Date.now() + route.duration * 1000),
                duration: route.duration / 60,
                distance: route.distance,
                price: mode === 'car' ?
                    this.calculateCarCost(route.distance) :
                    this.calculateBusPrice(route.distance),
                returnable: mode === 'bus',
                segments: [{
                    mode: mode,
                    from: { name: from.name, coords: from.coords },
                    to: { name: to.name, coords: to.coords },
                    geometry: route.geometry,
                    steps: route.legs[0].steps
                }]
            };
        } catch (error) {
            console.error('Erreur route:', error);
            return null;
        }
    }

    static calculateTrainPrice(duration, distance) {
        const basePrice = 10;
        const pricePerKm = 0.15;
        return Math.round((basePrice + (distance / 1000) * pricePerKm) * 100) / 100;
    }

    static calculateCarCost(distance) {
        const fuelCostPerKm = 0.15;
        return Math.round(distance / 1000 * fuelCostPerKm * 100) / 100;
    }

    static calculateBusPrice(distance) {
        const basePrice = 15;
        const pricePerKm = 0.10;
        return Math.round((basePrice + (distance / 1000) * pricePerKm) * 100) / 100;
    }

    static calculatePlanePrice(distance) {
        const basePrice = 50;
        const pricePerKm = 0.25;
        return Math.round((basePrice + (distance / 1000) * pricePerKm) * 100) / 100;
    }

    static async getMultiModalRoute(from, to, selectedModes) {
        try {
            const routes = [];
            const directDistance = this.calculateDistance(from.coords, to.coords);
            console.log('Recherche d\'itinéraires multimodaux...');

            // Vérifiez si les points de départ et d'arrivée sont des gares ou des aéroports
            const isFromStationOrAirport = from.type === 'station' || from.type === 'airport';
            const isToStationOrAirport = to.type === 'station' || to.type === 'airport';

            // Si ce n'est pas le cas, trouvez la gare ou l'aéroport le plus proche
            const startPoint = isFromStationOrAirport ? from : await this.findNearestStationOrAirport(from.coords);
            const endPoint = isToStationOrAirport ? to : await this.findNearestStationOrAirport(to.coords);

            // 1. Recherche des trajets mixtes optimaux
            if (selectedModes.length > 1) {
                const [departureAirports, departureStations] = await Promise.all([
                    selectedModes.includes('plane') ? this.findNearbyAirports(startPoint.coords) : [],
                    selectedModes.includes('train') ? this.findNearbyStations(startPoint.coords) : []
                ]);

                const [arrivalAirports, arrivalStations] = await Promise.all([
                    selectedModes.includes('plane') ? this.findNearbyAirports(endPoint.coords) : [],
                    selectedModes.includes('train') ? this.findNearbyStations(endPoint.coords) : []
                ]);

                const transferPoints = [...departureAirports, ...departureStations];
                const endPoints = [...arrivalAirports, ...arrivalStations];

                for (const startTransferPoint of transferPoints) {
                    for (const mode1 of selectedModes.filter(m => ['car', 'bus'].includes(m))) {
                        const firstLeg = await this.getRoadRoute(startPoint, startTransferPoint, mode1);
                        if (!firstLeg) continue;

                        for (const endTransferPoint of endPoints) {
                            for (const mode2 of selectedModes.filter(m => ['train', 'plane'].includes(m))) {
                                let secondLeg = null;

                                if (mode2 === 'train' && startTransferPoint.type === 'station' && endTransferPoint.type === 'station') {
                                    const trainRoutes = await this.getTrainRoute(startTransferPoint, endTransferPoint);
                                    if (trainRoutes.length > 0) {
                                        secondLeg = trainRoutes[0];
                                    }
                                } else if (mode2 === 'plane' && startTransferPoint.type === 'airport' && endTransferPoint.type === 'airport') {
                                    secondLeg = await this.getPlaneRoute(startTransferPoint, endTransferPoint);
                                }

                                if (secondLeg) {
                                    for (const mode3 of selectedModes.filter(m => ['car', 'bus'].includes(m))) {
                                        const lastLeg = await this.getRoadRoute(endTransferPoint, endPoint, mode3);
                                        if (!lastLeg) continue;

                                        routes.push({
                                            id: `multimodal-${Date.now()}-${Math.random()}`,
                                            mode: 'multimodal',
                                            departureTime: firstLeg.departureTime,
                                            arrivalTime: new Date(secondLeg.arrivalTime.getTime() + lastLeg.duration * 60000),
                                            duration: firstLeg.duration + secondLeg.duration + lastLeg.duration,
                                            price: firstLeg.price + secondLeg.price + lastLeg.price,
                                            segments: [...firstLeg.segments, ...secondLeg.segments, ...lastLeg.segments],
                                            returnable: false
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 2. Trajets directs
            if (selectedModes.includes('plane') && directDistance > 500000) {
                const planeRoute = await this.getPlaneRoute(startPoint, endPoint);
                if (planeRoute) routes.push(planeRoute);
            }

            if (selectedModes.includes('train') && startPoint.type === 'station' && endPoint.type === 'station') {
                const trainRoutes = await this.getTrainRoute(startPoint, endPoint);
                routes.push(...trainRoutes);
            }

            for (const mode of selectedModes.filter(m => ['car', 'bus'].includes(m))) {
                const roadRoute = await this.getRoadRoute(startPoint, endPoint, mode);
                if (roadRoute) routes.push(roadRoute);
            }

            // Trier par durée et retourner les meilleurs itinéraires
            const sortedRoutes = routes
                .sort((a, b) => (a.duration + a.price / 100) - (b.duration + b.price / 100))
                .slice(0, 5);

            console.log(`Total routes trouvées: ${sortedRoutes.length}`);
            return sortedRoutes;

        } catch (error) {
            console.error('Erreur recherche multimodale:', error);
            return [];
        }
    }
}

export default TransportService;