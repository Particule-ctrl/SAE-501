const API_MAPPING = {
    AF: 'http://api-af:3000/reservations',  // Updated to Docker service name and correct port
    SNCF: 'http://api-sncf:3000/reservations',
    RATP: 'http://api-ratp:3000/reservations'
};



const transformData = (incomingData) => {
    return {
        idDossier: incomingData["id-dossier"],
        idPMR: incomingData.idPMR,
        enregistre: incomingData.enregistre,
        Assistance: incomingData.Assistance,
        sousTrajets: incomingData.sousTrajets.map(st => ({
            BD: st.BD,
            numDossier: st.numDossier,
            statusValue: 0
        })),
        bagage: incomingData.bagage
    };
};

const sendDataToAPIs = async (incomingData) => {
    try {
        const sousTrajets = incomingData.sousTrajets;

        // Loop through sousTrajets and send data to the corresponding API
        for (const trajet of sousTrajets) {
            const apiUrl = API_MAPPING[trajet.BD]; // Get API URL for this BD

            if (!apiUrl) {
                console.warn(`No API defined for BD: ${trajet.BD}, skipping.`);
                continue; // Skip if no API is defined for the BD
            }

            const { BD, ...dataToSend } = trajet;

            try {
                console.log('Data to send: ',dataToSend)
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend) // Send the data as JSON
                });
                console.log('Status: ',response.status)
                if (!response.ok) {
                    console.error(`Failed with status ${response.status}: ${response.statusText}`);
                }

                console.log(`Data sent successfully to ${trajet.BD} API:`, response.data);
            } catch (error) {
                console.error(`Error sending data to ${trajet.BD} API:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error in sendDataToAPIs:', error.message);
        throw error;
    }
};


functions = {
    transformData: transformData,
    sendDataToAPIs: sendDataToAPIs
}
module.exports = functions