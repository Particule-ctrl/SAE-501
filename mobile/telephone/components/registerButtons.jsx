import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ title, onPress, disabled, style }) => {
    return (
        !disabled && ( // Si disabled est true, le bouton ne sera pas rendu
            <TouchableOpacity
                onPress={onPress}
                style={[
                    style,
                    { backgroundColor: disabled ? '#ccc' : style?.backgroundColor },
                ]}
            >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    {title}
                </Text>
            </TouchableOpacity>
        )
    );
};

export default CustomButton;
