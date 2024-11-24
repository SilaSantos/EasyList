import React from "react";
import { Text, TouchableOpacity, StyleSheet, TouchableOpacityProps, View } from "react-native";
import { Feather} from '@expo/vector-icons'

interface ItemCardProps extends TouchableOpacityProps{
    name: string;
    price: string;
    quant: string;
}
export function ItemCard({name,price, quant, ...rest}: ItemCardProps){    
    
    const MAX_LENGTH = 13;
    const displayName = name.length > MAX_LENGTH ? `${name.substring(0, MAX_LENGTH)}...` : name;

    return(
        <View style={styles.buttonItem} {...rest}>
            <Text style={styles.textItem}>{displayName}</Text>
            <View style={styles.priceQuantityGroup}>
                <Text style={styles.groupText}>Quant: {quant}</Text>
                <Text style={styles.groupText}>{price}</Text>
                <TouchableOpacity {...rest}>
                    <Feather name="trash-2" size={24} color="#ec5353" />   
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    buttonItem: {
        backgroundColor: '#1F1E25',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    textItem: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }, 
    priceQuantityGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    groupText: {
        color: '#FFFFFF',
    }
})