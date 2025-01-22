import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

const ReservationModal = ({ visible, onClose, onConfirm, route }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    baggage: {
      hasBaggage: false,
      count: 0,
      specialBaggage: '',
    },
    specialAssistance: {
      wheelchair: false,
      visualAssistance: false,
      hearingAssistance: false,
      otherAssistance: '',
    },
    additionalInfo: {
      emergencyContact: '',
      medicalInfo: '',
      dietaryRestrictions: '',
    },
  });

  // États pour la vérification faciale
  const [selfieImage, setSelfieImage] = useState(null);
  const [idImage, setIdImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const cameraRef = useRef(null);

  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const BaggageStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Bagages</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Avez-vous des bagages ?</Text>
        <Switch
          value={formData.baggage.hasBaggage}
          onValueChange={(value) => updateFormData('baggage', 'hasBaggage', value)}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      {formData.baggage.hasBaggage && (
        <>
          <Text style={styles.label}>Nombre de bagages</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.baggage.count.toString()}
            onChangeText={(value) => updateFormData('baggage', 'count', parseInt(value) || 0)}
            placeholder="Nombre de bagages"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Bagages spéciaux</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={formData.baggage.specialBaggage}
            onChangeText={(value) => updateFormData('baggage', 'specialBaggage', value)}
            placeholder="Description des bagages spéciaux"
            placeholderTextColor="#888"
          />
        </>
      )}
    </View>
  );

  const AssistanceStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Assistance Spéciale</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Fauteuil roulant</Text>
        <Switch
          value={formData.specialAssistance.wheelchair}
          onValueChange={(value) => updateFormData('specialAssistance', 'wheelchair', value)}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Assistance visuelle</Text>
        <Switch
          value={formData.specialAssistance.visualAssistance}
          onValueChange={(value) => updateFormData('specialAssistance', 'visualAssistance', value)}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Assistance auditive</Text>
        <Switch
          value={formData.specialAssistance.hearingAssistance}
          onValueChange={(value) => updateFormData('specialAssistance', 'hearingAssistance', value)}
          ios_backgroundColor="#3e3e3e"
        />
      </View>

      <Text style={styles.label}>Autre assistance requise</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={formData.specialAssistance.otherAssistance}
        onChangeText={(value) => updateFormData('specialAssistance', 'otherAssistance', value)}
        placeholder="Précisez vos besoins d'assistance"
        placeholderTextColor="#888"
      />
    </View>
  );

  const AdditionalInfoStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Informations Complémentaires</Text>

      <Text style={styles.label}>Contact d'urgence</Text>
      <TextInput
        style={styles.input}
        value={formData.additionalInfo.emergencyContact}
        onChangeText={(value) => updateFormData('additionalInfo', 'emergencyContact', value)}
        placeholder="Nom et numéro de téléphone"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Informations médicales importantes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={formData.additionalInfo.medicalInfo}
        onChangeText={(value) => updateFormData('additionalInfo', 'medicalInfo', value)}
        placeholder="Allergies, médicaments, etc."
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Restrictions alimentaires</Text>
      <TextInput
        style={styles.input}
        value={formData.additionalInfo.dietaryRestrictions}
        onChangeText={(value) => updateFormData('additionalInfo', 'dietaryRestrictions', value)}
        placeholder="Régime particulier"
        placeholderTextColor="#888"
      />
    </View>
  );

  const ConfirmationStep = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirmation de Réservation</Text>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Itinéraire</Text>
        {route.segments.map((segment, index) => (
          <View key={index} style={styles.segmentSummary}>
            <Ionicons
              name={segment.mode === 'train' ? 'train' : segment.mode === 'plane' ? 'airplane' : 'car'}
              size={24}
              color="#12B3A8"
            />
            <Text style={styles.segmentText}>
              {segment.from.name} → {segment.to.name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Bagages</Text>
        <Text style={styles.summaryText}>
          {formData.baggage.hasBaggage
            ? `${formData.baggage.count} bagage(s)${
                formData.baggage.specialBaggage ? '\nSpécial: ' + formData.baggage.specialBaggage : ''
              }`
            : 'Aucun bagage'}
        </Text>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Assistance</Text>
        <Text style={styles.summaryText}>
          {[
            formData.specialAssistance.wheelchair ? '- Fauteuil roulant' : '',
            formData.specialAssistance.visualAssistance ? '- Assistance visuelle' : '',
            formData.specialAssistance.hearingAssistance ? '- Assistance auditive' : '',
            formData.specialAssistance.otherAssistance ? `- ${formData.specialAssistance.otherAssistance}` : '',
          ]
            .filter(Boolean)
            .join('\n') || 'Aucune assistance requise'}
        </Text>
      </View>
    </ScrollView>
  );

  const FaceVerificationStep = () => {
    const takePicture = async (isSelfiePicture) => {
      if (cameraRef.current) {
        setIsVerifying(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });

        const formData = new FormData();
        if (isSelfiePicture) {
          formData.append('selfie', {
            uri: photo.uri,
            type: 'image/jpeg',
            name: 'selfie.jpg',
          });
          setSelfieImage(photo.uri);
        } else {
          formData.append('idPhoto', {
            uri: photo.uri,
            type: 'image/jpeg',
            name: 'id.jpg',
          });
          setIdImage(photo.uri);
        }

        if (selfieImage && idImage) {
          try {
            const response = await fetch('http://172.20.10.7:80/api/facerecognition/verify', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            });

            if (!response.ok) {
              Alert.alert('Erreur', 'La vérification a échoué');
              return false;
            }

            const result = await response.json();
            return result.verified;
          } catch (error) {
            console.error('Erreur verification:', error);
            Alert.alert('Erreur', 'Problème lors de la vérification');
            return false;
          }
        }
        setIsVerifying(false);
      }
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Vérification d'identité</Text>

        {!selfieImage ? (
          <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.front}>
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraText}>Prenez un selfie</Text>
              <TouchableOpacity style={styles.captureButton} onPress={() => takePicture(true)}>
                <Text style={styles.buttonText}>Prendre la photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        ) : !idImage ? (
          <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.back}>
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraText}>Photographiez votre carte d'identité</Text>
              <TouchableOpacity style={styles.captureButton} onPress={() => takePicture(false)}>
                <Text style={styles.buttonText}>Prendre la photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        ) : (
          <View style={styles.verificationStatus}>
            {isVerifying ? (
              <ActivityIndicator size="large" color="#12B3A8" />
            ) : (
              <Text style={styles.verificationText}>Photos capturées</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <BaggageStep />;
      case 2:
        return <AssistanceStep />;
      case 3:
        return <AdditionalInfoStep />;
      case 4:
        return <FaceVerificationStep />;
      case 5:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onConfirm(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{step === 4 ? 'Vérification faciale' : `Étape ${step}/4`}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {renderCurrentStep()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.buttonText}>{step === 1 ? 'Annuler' : 'Retour'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.buttonText}>{step === 4 ? 'Confirmer' : 'Suivant'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#192031',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3A4A',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  stepContainer: {
    padding: 20,
    flex: 1,
  },
  stepTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2C3A4A',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
  },
  backButton: {
    backgroundColor: '#2C3A4A',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#12B3A8',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
  },
  camera: {
    width: '100%',
    height: 400,
    marginVertical: 20,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    padding: 20,
  },
  cameraText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#12B3A8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  verificationStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  verificationText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ReservationModal;