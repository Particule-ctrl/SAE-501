import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

export default function Trajet() {
    const route = useRoute();
    const param1 = route.params?.param1 || null;

    const verifieParam = () => param1 !== null;
     
    return (
        verifieParam() ? (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Text>Trajet en cours avec le paramètre : {param1}</Text>
                </View>
            </SafeAreaView>
        ) : (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Text>Aucun trajet en cours</Text>
                </View>
            </SafeAreaView>
        )
    );
}
