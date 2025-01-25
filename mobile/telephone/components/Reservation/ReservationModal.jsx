import React, { useState } from 'react';
import {
 Modal,
 View,
 Text,
 TouchableOpacity,
 TextInput,
 ScrollView,
 Switch,
 StyleSheet,
 Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
   security: {
     validDocuments: false,
     documentsExpiry: '',
     dangerousItems: [],
     liquidVolume: '',
     medicalEquipment: '',
     securityQuestions: {
       packedOwn: false,
       leftUnattended: false,
       acceptedItems: false,
       receivedItems: false,
       dangerousGoods: false
     },
     declarations: {
       weaponsFirearms: false,
       explosives: false,
       flammableMaterials: false,
       radioactiveMaterials: false,
       toxicSubstances: false,
       compressedGases: false,
       illegalDrugs: false
     }
   },
   additionalInfo: {
     emergencyContact: '',
     medicalInfo: '',
     dietaryRestrictions: '',
   },
 });

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
   <ScrollView style={styles.stepContainer}>
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
   </ScrollView>
 );

 const AssistanceStep = () => (
   <ScrollView style={styles.stepContainer}>
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
   </ScrollView>
 );

 const SecurityStep = () => (
   <ScrollView style={styles.stepContainer}>
     <Text style={styles.stepTitle}>Vérification de Sécurité</Text>

     <View style={styles.securitySection}>
       <View style={styles.iconHeader}>
         <Ionicons name="document-text" size={24} color="#12B3A8" />
         <Text style={styles.sectionTitle}>Documents de Voyage</Text>
       </View>
       <View style={styles.switchContainer}>
         <Text style={styles.label}>Je confirme avoir des documents d'identité valides</Text>
         <Switch
           value={formData.security.validDocuments}
           onValueChange={(value) => updateFormData('security', 'validDocuments', value)}
           ios_backgroundColor="#3e3e3e"
         />
       </View>
     </View>

     <View style={styles.securitySection}>
       <View style={styles.iconHeader}>
         <Ionicons name="warning" size={24} color="#12B3A8" />
         <Text style={styles.sectionTitle}>Déclarations de Non-Transport</Text>
       </View>
       {Object.entries({
         weaponsFirearms: { icon: 'flash', label: 'Je déclare ne pas transporter d\'armes ou munitions' },
         explosives: { icon: 'nuclear', label: 'Je déclare ne pas transporter d\'explosifs' },
         flammableMaterials: { icon: 'flame', label: 'Je déclare ne pas transporter de matières inflammables' },
         radioactiveMaterials: { icon: 'radio', label: 'Je déclare ne pas transporter de matières radioactives' },
         toxicSubstances: { icon: 'skull', label: 'Je déclare ne pas transporter de substances toxiques' },
         compressedGases: { icon: 'cube', label: 'Je déclare ne pas transporter de gaz comprimés' },
         illegalDrugs: { icon: 'medkit', label: 'Je déclare ne pas transporter de substances illicites' }
       }).map(([key, { icon, label }]) => (
         <View key={key} style={styles.checkItem}>
           <Ionicons name={icon} size={20} color="white" />
           <Text style={styles.checkLabel}>{label}</Text>
           <Switch
             value={formData.security.declarations[key]}
             onValueChange={(value) => {
               updateFormData('security', 'declarations', {
                 ...formData.security.declarations,
                 [key]: value
               });
             }}
             ios_backgroundColor="#3e3e3e"
           />
         </View>
       ))}
     </View>

     <View style={styles.securitySection}>
       <View style={styles.iconHeader}>
         <Ionicons name="help-circle" size={24} color="#12B3A8" />
         <Text style={styles.sectionTitle}>Questions de Sécurité</Text>
       </View>
       {[
         { key: 'packedOwn', label: 'Avez-vous fait vos bagages vous-même ?' },
         { key: 'leftUnattended', label: 'Vos bagages sont-ils restés sous votre surveillance ?' },
         { key: 'acceptedItems', label: 'Avez-vous accepté des objets d\'autres personnes ?' },
         { key: 'receivedItems', label: 'Transportez-vous des objets pour d\'autres personnes ?' }
       ].map(({ key, label }) => (
         <View key={key} style={styles.questionItem}>
           <Text style={styles.questionText}>{label}</Text>
           <Switch
             value={formData.security.securityQuestions[key]}
             onValueChange={(value) => {
               updateFormData('security', 'securityQuestions', {
                 ...formData.security.securityQuestions,
                 [key]: value
               });
             }}
             ios_backgroundColor="#3e3e3e"
           />
         </View>
       ))}
     </View>

     <View style={styles.securitySection}>
       <View style={styles.iconHeader}>
         <Ionicons name="medical" size={24} color="#12B3A8" />
         <Text style={styles.sectionTitle}>Équipement Médical</Text>
       </View>
       <TextInput
         style={[styles.input, styles.textArea]}
         multiline
         value={formData.security.medicalEquipment}
         onChangeText={(value) => updateFormData('security', 'medicalEquipment', value)}
         placeholder="Décrivez tout équipement médical nécessaire"
         placeholderTextColor="#888"
       />
     </View>
   </ScrollView>
 );

 const AdditionalInfoStep = () => (
   <ScrollView style={styles.stepContainer}>
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
   </ScrollView>
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

     <View style={styles.summarySection}>
       <Text style={styles.summaryTitle}>Informations Médicales</Text>
       <Text style={styles.summaryText}>
         {formData.additionalInfo.medicalInfo || 'Aucune information médicale fournie'}
       </Text>
     </View>
   </ScrollView>
 );

 const renderCurrentStep = () => {
   switch (step) {
     case 1:
       return <BaggageStep />;
     case 2:
       return <AssistanceStep />;
     case 3:
       return <SecurityStep />;
     case 4:
       return <AdditionalInfoStep />;
     case 5:
       return <ConfirmationStep />;
     default:
       return null;
   }
 };

 const validateSecurityStep = () => {
   if (!formData.security.validDocuments) {
     Alert.alert('Documents Invalides', 'Vous devez confirmer avoir des documents valides.');
     return false;
   }

   const declarations = formData.security.declarations;
   const allDeclared = Object.values(declarations).every(value => value === true);

   if (!allDeclared) {
     Alert.alert(
       'Déclarations Requises',
       'Vous devez confirmer toutes les déclarations de non-transport d\'objets interdits.'
     );
     return false;
   }

   if (!formData.security.securityQuestions.packedOwn) {
     Alert.alert('Vérification de Sécurité', 'Vous devez avoir fait vos bagages vous-même.');
     return false;
   }

   if (formData.security.securityQuestions.leftUnattended ||
       formData.security.securityQuestions.acceptedItems ||
       formData.security.securityQuestions.receivedItems) {
     Alert.alert('Alerte de Sécurité', 'Vos réponses aux questions de sécurité ne permettent pas de poursuivre la réservation.');
     return false;
   }

   return true;
 };

 const handleNext = () => {
   if (step === 3) {
     if (!validateSecurityStep()) {
       return;
     }
   }

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
          <Text style={styles.headerText}>Étape {step}/5</Text>
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
            <Text style={styles.buttonText}>{step === 5 ? 'Confirmer' : 'Suivant'}</Text>
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
  securitySection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3A4A',
    paddingBottom: 16,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#12B3A8',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
  },
  checkLabel: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  questionItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3A4A',
    paddingBottom: 12,
  },
  questionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
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
});

export default ReservationModal;