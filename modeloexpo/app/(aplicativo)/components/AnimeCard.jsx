import React from 'react';
import { View, Text, Image, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../css/themes';

export default function AnimeCard({ animeData, currentEp, setCurrentEp }) {
    return (
        <View style={styles.card}>
            <View style={styles.animeInfoRow}>
                <Image source={{ uri: animeData.imageUrl }} style={styles.animeImage} />
                <View style={styles.animeTextDetails}>
                    <Text style={styles.animeTitle}>{animeData.title}</Text>
                    <Text style={styles.animeTotalEps}>Total de Episódios: {animeData.episodes || 'Desconhecido'}</Text>
                    <Text style={styles.animeTotalEps}>Duração base: {animeData.duration} min</Text>
                </View>
            </View>

            <Text style={styles.label}>Em qual episódio você está e?</Text>
            <TextInput 
                style={styles.input}
                placeholder="Ex: 0 (Do começo)"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={currentEp}
                onChangeText={setCurrentEp}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLabel,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: COLORS.textMain,
        fontSize: 15,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
    },
    animeInfoRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    animeImage: {
        width: 60,
        height: 85,
        borderRadius: 8,
        backgroundColor: COLORS.inputBackground,
    },
    animeTextDetails: {
        flex: 1,
    },
    animeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    animeTotalEps: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginTop: 4,
    },
});