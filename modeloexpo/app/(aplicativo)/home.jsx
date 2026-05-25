import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from './css/themes';
import OptionCheckbox from './components/OptionCheckbox';
import AnimeCard from './components/AnimeCard';

export default function HomeScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentEp, setCurrentEp] = useState('');
    const [animeData, setAnimeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [skipOpenings, setSkipOpenings] = useState(false);
    const [skipRecaps, setSkipRecaps] = useState(false);
    const [result, setResult] = useState(null);

    const searchAnime = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setErrorMsg(null);
        setAnimeData(null);
        setResult(null);

        try {
            const response = await fetch(
                `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=10&type=tv`
            );
            const json = await response.json();

            if (json.data && json.data.length > 0) {
                const query = searchQuery.trim().toLowerCase();
                const best = json.data.find(a =>
                    a.title.toLowerCase() === query ||
                    a.title_english?.toLowerCase() === query
                ) || json.data[0];

                const durationMatch = best.duration ? best.duration.match(/\d+/) : null;
                const detectedMinutes = durationMatch ? parseInt(durationMatch[0]) : 24;

                setAnimeData({
                    title: best.title,
                    episodes: best.episodes,
                    imageUrl: best.images.jpg.image_url,
                    duration: detectedMinutes,
                });
            } else {
                setErrorMsg('Anime não encontrado!');
            }
        } catch (error) {
            setErrorMsg('Erro ao conectar com a API.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTime = () => {
        if (!animeData) return;
        const current = parseInt(currentEp) || 0;
        const total = animeData.episodes;

        if (!total) {
            setResult('Este anime ainda está em lançamento ou não tem total de eps definido!');
            return;
        }
        if (total <= current) {
            setResult('Você já terminou ou passou do episódio final!');
            return;
        }

        const remainingEpisodes = total - current;
        let timePerEpisode = animeData.duration;

        if (skipOpenings && timePerEpisode > 5) timePerEpisode -= 3;
        if (skipRecaps && timePerEpisode > 5) timePerEpisode -= 2;

        const totalMinutes = remainingEpisodes * timePerEpisode;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setResult(hours > 0 ? `Faltam ${hours}h e ${minutes}min para você terminar!` : `Faltam ${minutes} minutos para você terminar!`);
    };

    return (
        <LinearGradient colors={COLORS.backgroundGradient} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.headerTitle}>Baka<Text style={styles.brandText}>Timer</Text></Text>
                <Text style={styles.headerSubtitle}>Arquitetura componentizada e limpa</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Buscar Anime</Text>
                    <View style={styles.searchRow}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            placeholder="Ex: Naruto, Jujutsu, Cyberpunk..."
                            placeholderTextColor="#64748b"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={searchAnime}>
                            <Text style={styles.searchButtonText}>🔍</Text>
                        </TouchableOpacity>
                    </View>
                    {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 12 }} />}
                    {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
                </View>

                {animeData && (
                    <AnimeCard
                        animeData={animeData}
                        currentEp={currentEp}
                        setCurrentEp={setCurrentEp}
                    />
                )}

                {animeData && (
                    <>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Configurações da Maratona</Text>

                            <OptionCheckbox
                                label="Pular Openings/Endings (-3 min) e"
                                checked={skipOpenings}
                                onPress={() => setSkipOpenings(!skipOpenings)}
                            />

                            <OptionCheckbox
                                label="Pular Recaps (-2 min) e"
                                checked={skipRecaps}
                                onPress={() => setSkipRecaps(!skipRecaps)}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={calculateTime}>
                            <Text style={styles.buttonText}>Calcular Tempo Restante 🚀</Text>
                        </TouchableOpacity>
                    </>
                )}

                {result && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultValue}>{result}</Text>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textMain, letterSpacing: 0.5 },
    brandText: { color: COLORS.primary },
    headerSubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4, marginBottom: 24 },
    card: { backgroundColor: COLORS.cardBackground, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'COLORS.cardBorder' },
    cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.textLabel, marginBottom: 8 },
    searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    input: { backgroundColor: COLORS.inputBackground, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, color: COLORS.textMain, fontSize: 15, borderWidth: 1, borderColor: COLORS.inputBorder },
    searchButton: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 14, justifyContent: 'center', alignItems: 'center' },
    searchButtonText: { fontSize: 18 },
    errorText: { color: '#ef4444', marginTop: 10, fontWeight: '600' },
    button: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
    buttonText: { color: COLORS.textMain, fontSize: 16, fontWeight: '700' },
    resultCard: { backgroundColor: COLORS.resultCardBg, borderRadius: 16, padding: 24, marginTop: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
    resultValue: { fontSize: 18, fontWeight: '800', color: COLORS.textMain, textAlign: 'center' },
});