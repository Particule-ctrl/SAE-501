import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import CurrentTrajet from '../../components/trajet/TrajetEnCours';
import { useRoute } from '@react-navigation/native';

export default function Trafic() {
  const route = useRoute();
  const [param, setParam] = useState(null);
  const verifieParam = () => param !== null;

  useEffect(() => {
  try {
      if (route.params && route.params["idDossier"]) {
          setParam(route.params["idDossier"]);
      }
  } catch (error) {
      console.error("Erreur lors de l'accès à idDossier :", error);
  }
}, [route.params]);


   
  return (
      verifieParam() ? (
          <SafeAreaView style={styles.container}>
              <CurrentTrajet id={param} />
          </SafeAreaView>
      ) : (
          <SafeAreaView style={styles.notFound}> 
              <View>
                  <Text style={styles.textNotFound}>Aucun trajet en cours</Text>
              </View>
          </SafeAreaView>
      )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#192031", 
  },
  notFound: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      backgroundColor: "#192031",
  },
  textNotFound: {
      fontSize: 20,
      color: "#fff",
      fontWeight: "bold",
  },
});