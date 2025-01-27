import { Alert } from "react-native";

/**
 * Fonction pour récupérer un trajet.
 */
export const getTrajet = async (idDossier) => {
    try {
        const response = await fetch(`http://192.168.1.22/api/reservation/${idDossier}`);
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            return data; // Retourne les données
        } else {
            console.error("Erreur de récupération du trajet :", data);
            throw new Error(data);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du trajet :", error);
        throw error;
    }
};

/**
 * Fonction pour récupérer les informations d'un passager PMR.
 */
export const retrievePassenger = async (idPMR) => {
    try {
        const response = await fetch(`http://192.168.1.22/api/user/${idPMR}`);
        const data = await response.json();
        console.log(data);
        return data; // Retourne les données du passager
    } catch (error) {
        console.error("Erreur lors de la récupération du passager :", error);
        throw error;
    }
};

/**
 * Fonction pour changer l'état d'un trajet.
 */
export const changeTrajetStatue = async (idDossier, idTrajet, status) => {
    try {
        let endpoint;
        if (status === 0) {
            endpoint = `http://192.168.1.22/reservation/setOngoing/${idDossier}/${idTrajet}`;
        } else if (status === 1) {
            endpoint = `http://192.168.1.22/reservation/setDone/${idDossier}/${idTrajet}`;
        } else {
            Alert.alert("Erreur", "Le trajet est déjà terminé");
            return;
        }

        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: status + 1 }),
        });

        if (!response.ok) {
            throw new Error("Erreur lors du changement de statut");
        }
    } catch (error) {
        console.error("Erreur dans changeTrajetStatue :", error);
        throw error;
    }
};

/**
 * Formatte une date dans le format DD/MM/YYYY.
 */
export const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

export const calculerAge = (dateNaissance) => {
    // Convertir la date de naissance en objet Date
    const naissance = new Date(dateNaissance);
    const aujourdHui = new Date();

    // Calculer la différence d'années
    let age = aujourdHui.getFullYear() - naissance.getFullYear();

    // Vérifier si l'anniversaire est déjà passé cette année
    const mois = aujourdHui.getMonth() - naissance.getMonth();
    if (mois < 0 || (mois === 0 && aujourdHui.getDate() < naissance.getDate())) {
        age--;
    }

    return age;
}