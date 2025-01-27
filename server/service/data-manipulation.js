const API_MAPPING = {
    AF: 'http://api-af:3000',  // Updated to Docker service name and correct port
    SNCF: 'http://api-sncf:3000',
    RATP: 'http://api-ratp:3000',
    TAXI: 'http://api-taxi:3000'
};



const transformData = (incomingData) => {
    return {
        idDossier: incomingData["id-dossier"],
        idPMR: incomingData.idPMR,
        googleId: incomingData.googleId,
        enregistre: incomingData.enregistre,
        Assistance: incomingData.Assistance,
        sousTrajets: incomingData.sousTrajets.map(st => ({
            BD: st.BD,
            numDossier: st.numDossier,
            statusValue: 0
        })),
        bagage: incomingData.bagage,
        specialAssistance: incomingData.specialAssistance,
        security: incomingData.security,
        additionalInfo: incomingData.additionalInfo
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
                const response = await fetch(`${apiUrl}/reservations`, {
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

const getTrajetFromAPIs = async(incomingData) => {
    const apiUrl = API_MAPPING[incomingData.BD];
    const response = await fetch(`${apiUrl}/reservations/${incomingData.numDossier}`);
    const responseData = await response.json();
    return {
        BD: incomingData.BD,
        numDossier: incomingData.numDossier,
        statusValue: incomingData.statusValue,
        departure: responseData.departure,
        arrival: responseData.arrival,
        departureTime: responseData.departureTime,
        arrivalTime: responseData.arrivalTime
    };
}

const getDataFromAPIs = async (incomingData) => {
    try {
        const sousTrajets = incomingData.sousTrajets || [];
        const newData = {
            idDossier: incomingData.idDossier,
            idPMR: incomingData.idPMR,
            googleId: incomingData.googleId,
            enregistre: incomingData.enregistre,
            bagage: incomingData.bagage,
            specialAssistance: incomingData.specialAssistance,
            security: incomingData.security,
            additionalInfo: incomingData.additionalInfo,
            sousTrajets: []
        }; // Clone l'objet pour éviter de modifier directement l'entrée

        for (let i = 0; i < sousTrajets.length; i++) {
            const trajet = sousTrajets[i];
            const apiUrl = API_MAPPING[trajet.BD];

            if (!apiUrl) {
                console.warn(`No API defined for BD: ${trajet.BD}, skipping.`);
                continue;
            }

            try {
                const response = await fetch(`${apiUrl}/reservations/${trajet.numDossier}`);
                if (!response.ok) {
                    console.warn(`Failed to fetch data for numDossier ${trajet.numDossier}: ${response.status}`);
                    continue;
                }

                const responseData = await response.json();
                console.log("Received :",typeof(responseData));
                console.log("Received content:", responseData);
                console.log("Trajet :",typeof(trajet));
                console.log("Trajet content:",trajet);

                newData.sousTrajets[i] =  {
                    BD: trajet.BD,
                    numDossier: trajet.numDossier,
                    statusValue: trajet.statusValue,
                    departure: responseData.departure,
                    arrival: responseData.arrival,
                    departureTime: responseData.departureTime,
                    arrivalTime: responseData.arrivalTime
                };
                console.log(newData.sousTrajets[i]);
            } catch (fetchError) {
                console.error(`Error fetching data for numDossier ${trajet.numDossier}:`, fetchError.message);
                continue;
            }
        }

        return newData;
    } catch (error) {
        console.error('Error in getDataFromAPIs:', error.message);
        throw error;
    }
};

const getTrajetsForPlace = async (incomingData) => {
    try {
      // Fetch the agent details
      const agentResponse = await fetch(`${API_MAPPING[incomingData.entreprise]}/agent/?email=${incomingData.email}`);
      if (!agentResponse.ok) {
        throw new Error(`Failed to fetch agent: ${agentResponse.statusText}`);
      }
      const agentData = await agentResponse.json();
      console.log("A")
      console.log("Agent Data:", agentData);
  
      // Fetch the voyage details using the agent and incoming data
      const voyageResponse = await fetch(`${API_MAPPING[incomingData.entreprise]}/reservations/fromLieu/${agentData.lieu}`);
      if (!voyageResponse.ok) {
        throw new Error(`Failed to fetch voyage: ${voyageResponse.statusText}`);
      }
      const voyageData = await voyageResponse.json();
      console.log("Voyage Data:", voyageData);
  
      // Return both agent and voyage data as a result
      return voyageData ;
    } catch (error) {
      console.error("Error in getTrajetsForPlace:", error.message);
      throw error;
    }
  };
  

functions = {
    transformData: transformData,
    sendDataToAPIs: sendDataToAPIs,
    getDataFromAPIs: getDataFromAPIs,
    getTrajetFromAPIs: getTrajetFromAPIs,
    getTrajetsForPlace: getTrajetsForPlace,
    API_MAPPING: API_MAPPING
}
module.exports = functions