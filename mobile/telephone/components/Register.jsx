import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, Animated, View, Button, useWindowDimensions, } from 'react-native';
import slides from '../assets/data/register.js';
import RegisterItem from './registerItem.jsx';
import CustomButton from './registerButtons.jsx';

export default function Register() {
    const { width } = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null); 
    const numCol = 3;
    const [currentIndex, setCurrentIndex] = useState(0); 

    const organizeInColumns = (data, columns) => {
        const columnsData = [];
        for (let i = 0; i < data.length; i += columns) {
            columnsData.push(data.slice(i, i + columns));
        }
        return columnsData;
    };

    const columns = organizeInColumns(slides, numCol);

    const handleNext = () => {
        if (currentIndex < columns.length - 1) {
            const newIndex = currentIndex + 1;
            flatListRef.current.scrollToOffset({ offset: newIndex * width, animated: true });
            setCurrentIndex(newIndex);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            flatListRef.current.scrollToOffset({ offset: newIndex * width, animated: true });
            setCurrentIndex(newIndex);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Register</Text>
            
            <FlatList
                ref={flatListRef} 
                data={columns}
                style={styles.flatlist}
                renderItem={({ item: column }) => (
                    <View style={[styles.column, { width }]}>
                        {column.map((element) => (
                            <RegisterItem key={element.id} item={element} />
                        ))}
                    </View>
                )}
                showsHorizontalScrollIndicator={false}
                horizontal
                scrollEnabled={false}
                pagingEnabled
                keyExtractor={(item, index) => `column-${index}`}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            />
            <FlatList horizontal>
                <View style={styles.buttonContainer}>
                    <CustomButton title="Previous" onPress={handlePrevious} style={styles.button} disabled={currentIndex === 0} />
                    <CustomButton title="Next" onPress={handleNext} style={styles.button} disabled={currentIndex === columns.length - 1} />
                </View>
            </FlatList>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E9E9E9',
        borderTopEndRadius: 60,
        borderTopStartRadius: 60,
        alignContent: 'center',
        padding: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '80%',
    },
    title: {
        fontSize: 46,
        textAlign: 'center',
        marginVertical: "10%",

    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70%',
        
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        marginBottom: '20%',
        backgroundColor: 'purple',
    },
    flatlist:{
        backgroundColor: 'green',
        height: '0%',
        
    },
    button: {
        width: '30%',
        alignItems: 'center',
        backgroundColor: '#69B7F6',
        padding: 10, 
        borderRadius: 10,
        width: '40%',    
    }


});
