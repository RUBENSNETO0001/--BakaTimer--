import React from 'react';
import { View, Text, Image, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../css/themes';

export default function AnimeCard({ animeData, currentEp, setCurrentEp, epHint }) {
    // Monta o texto de episódios conforme o status
    let epsText = 'Desconhecido';
    if (animeData.episodes) {
        epsText = String(animeData.episodes);
    } else if (animeData.releasing && animeData.episodesReleased != null) {
        epsText = `${animeData.episodesReleased} lançados (em exibição)`;
    } else if (animeData.releasing) {
        epsText = 'Em exibição';
    }

    return (
        <View style={styles.card}>
            <View style={styles.animeInfoRow}>
                <Image source={{ uri: animeData.imageUrl }} style={styles.animeImage} />
                <View style={styles.animeTextDetails}>
                    <Text style={styles.animeTitle}>{animeData.title}</Text>
                    <Text style={styles.animeTotalEps}>
                        Total de episódios: {epsText}
                    </Text>
                    <Text style={styles.animeTotalEps}>Duração base: {animeData.duration} min</Text>
                    {animeData.releasing && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>🔴 Em lançamento</Text>
                        </View>
                    )}
                </View>
            </View>

            <Text style={styles.label}>Em qual episódio você está?</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 0 (do começo)"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={currentEp}
                onChangeText={setCurrentEp}
            />
            {epHint && (
                <Text style={styles.epHint}>{epHint}</Text>
            )}
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
    epHint: {
        fontSize: 12,
        color: COLORS.primary,
        marginTop: 6,
        fontStyle: 'italic',
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
    badge: {
        marginTop: 6,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(239,68,68,0.15)',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderWidth: 0.5,
        borderColor: 'rgba(239,68,68,0.4)',
    },
    badgeText: {
        fontSize: 11,
        color: '#ef4444',
        fontWeight: '600',
    },
});