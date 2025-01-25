import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import { useRoute } from '@react-navigation/native';

export default function Trajet() {
    const route = useRoute();
    const [param, setParam] = useState(null);
    const verifieParam = () => param !== null;

    useEffect(() => {
        if (route.params["idDossier"]) {
            setParam(route.params["idDossier"]);
        }
    }, [route.params]);
     
    return (
        verifieParam() ? (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Text>Trajet en cours avec le paramètre : {param}</Text>
                </View>
            </SafeAreaView>
        ) : (
            <SafeAreaView style={styles.notFound}> 
                <View>
                    <Text>Aucun trajet en cours</Text>
                </View>
            </SafeAreaView>
        )
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#90ee90", 
    },
    text: {
      fontSize: 16,
    },
    notFound: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        backgroundColor: "#ff6347",
    }
  });