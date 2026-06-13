import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../themes/themes';

export default function OptionCheckbox({ label, checked, onPress }) {
    return (
        <TouchableOpacity style={styles.checkboxRow} activeOpacity={0.7} onPress={onPress}>
            <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.primary,
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
    },
    checkboxLabel: {
        fontSize: 14,
        color: COLORS.checkboxLabel,
    },
});