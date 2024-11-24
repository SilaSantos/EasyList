import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}
export function Button({onPress, title}: ButtonProps){
    return(
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#90EE90',
        padding: 12,
        borderRadius: 7,
        alignItems: 'center',
        marginVertical: 30
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold'
    }
})