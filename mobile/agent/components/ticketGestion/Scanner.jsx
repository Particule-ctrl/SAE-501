import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';

export default function Scanner() {
  const [trajet, setTrajet] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const checkPermission = async () => {
    const { status } = await requestPermission();
    setHasPermission(status === 'granted');
  };
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo.uri); // Vous pouvez ici faire ce que vous voulez avec l'URI de l'image
      setCameraActive(false); // Désactiver la caméra après la prise de photo
    }
  };

  const onScan = (result) => {
    if (result) {
      console.log("QR Code detected:", result.data);
      // Ajoutez ici la logique pour traiter le résultat (par exemple, navigation ou mise à jour de l'état)
    }
  };

  return (
    <CameraView style={styles.container} facing={facing} barcodeScannerSettings={{ barcodeTypes: ["qr"], }} onBarcodeScanned={onScan}>
      <View style={styles.scanZone} />
    </CameraView>

  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,


  },
  scanZone: {
    width: 200,
    height: 200,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
