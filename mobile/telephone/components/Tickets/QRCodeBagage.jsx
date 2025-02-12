import React, { useRef } from "react";
import QRCode from "react-native-qrcode-svg";
import { View, Button, Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function QRCodeBagage({ bagageListe }) {
    const qrRefs = useRef([]);

    // Fonction pour récupérer l'URL de chaque QRCode
    const getDataURL = (index) => {
        if (qrRefs.current[index]) {
            qrRefs.current[index].toDataURL((dataURL) => {
                qrRefs.current[index] = dataURL;
                console.log("QR Code Data URL:", dataURL);
            });
        }
    };

    const saveToPDF = async () => {
        try {
            // S'assurer que tous les QR codes ont leur base64 généré
            await Promise.all(
                bagageListe.map((_, index) =>
                    new Promise((resolve) => {
                        if (qrRefs.current[index]) {
                            qrRefs.current[index].toDataURL((dataURL) => {
                                qrRefs.current[index] = dataURL;
                                resolve();
                            });
                        } else {
                            resolve();
                        }
                    })
                )
            );

            let qrCodesHTML = bagageListe.map((bagage, index) => `
                <div style="text-align: center; margin-bottom: 100;">
                    <h2>BAGAGE ${index + 1}</h2><br/> <br/> 
                    <img src="${qrRefs.current[index]}" width="300" height="300"/>
                    <br/>
                </div>
                <i class="fa-solid fa-scissors">--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</i>
                <br/> 
            `).join("");

            const { uri } = await Print.printToFileAsync({
                html: `<html><body>${qrCodesHTML}</body></html>`,
                base64: false,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert("Erreur", "Impossible de partager le fichier.");
            }
        } catch (error) {
            console.error("Erreur PDF :", error);
            Alert.alert("Erreur", "Impossible de générer le PDF.");
        }
    };

    return (
        <View>
            {bagageListe.map((bagage, index) => (
                <View key={index}>
                    <QRCode
                        value={JSON.stringify(bagage)}
                        size={100}
                        getRef={(c) => {
                            qrRefs.current[index] = c;
                            getDataURL(index);
                        }}
                    />
                </View>
            ))}
            <Button title="Enregistrer en PDF" onPress={saveToPDF} />
        </View>
    );
}
