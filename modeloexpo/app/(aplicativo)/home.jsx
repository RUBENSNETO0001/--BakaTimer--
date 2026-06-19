import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, StatusBar, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../themes/themes';
import OptionCheckbox from './components/OptionCheckbox';
import AnimeCard from './components/AnimeCard';
import AbaCalendario from './components/AbaCalendario';
import AbaSobrenos from './components/AbaSobrenos';

const TABS = [
    { key: 'home', label: 'Início' },
    { key: 'calendario', label: 'Calendário' },
    { key: 'sobrenos', label: 'Sobre Nós' },
];

const ANILIST_QUERY = `
query ($search: String) {
  Page(perPage: 10) {
    media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
      title { romaji english }
      episodes
      duration
      coverImage { large }
      status
      format
      nextAiringEpisode { episode }
    }
  }
}
`;

async function searchAniList(query) {
    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query: ANILIST_QUERY, variables: { search: query } }),
    });
    const json = await response.json();
    return json?.data?.Page?.media ?? [];
}

const TABS_DATA = TABS;

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState('home');
    const [pendingAnime, setPendingAnime] = useState(null);
    const [pendingStartEp, setPendingStartEp] = useState(0);

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
        setCurrentEp('');

        try {
            const results = await searchAniList(searchQuery.trim());

            if (results.length > 0) {
                const ql = searchQuery.trim().toLowerCase();
                const best = results.find(a =>
                    a.title.romaji?.toLowerCase() === ql ||
                    a.title.english?.toLowerCase() === ql
                ) || results[0];

                const title = best.title.english || best.title.romaji;
                const duration = best.duration ?? 24;

                let episodes = null;
                let episodesReleased = null;
                let releasing = false;

                if (best.format === 'MOVIE') {
                    episodes = 1;
                } else if (best.episodes) {
                    episodes = best.episodes;
                } else if (best.nextAiringEpisode) {
                    episodesReleased = best.nextAiringEpisode.episode - 1;
                    releasing = true;
                }

                setAnimeData({
                    title,
                    episodes,
                    episodesReleased,
                    releasing,
                    imageUrl: best.coverImage.large,
                    duration,
                    status: best.status,
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
        const total = animeData.episodes ?? animeData.episodesReleased;

        if (!total) {
            setResult('Este anime ainda está em lançamento e não tem episódios registrados!');
            return;
        }
        if (total <= current) {
            setResult('Você já terminou ou passou do episódio disponível!');
            return;
        }

        const remainingEpisodes = total - current;
        let timePerEpisode = animeData.duration;

        if (skipOpenings && timePerEpisode > 5) timePerEpisode -= 3;
        if (skipRecaps && timePerEpisode > 5) timePerEpisode -= 2;

        const totalMinutes = remainingEpisodes * timePerEpisode;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setResult(hours > 0
            ? `Faltam ${hours}h e ${minutes}min para você terminar!`
            : `Faltam ${minutes} minutos para você terminar!`
        );
    };

    const addAnimeToCalendar = () => {
        if (!animeData) return;
        if (!animeData.episodes) {
            setResult('Não é possível adicionar animes sem número total de episódios!');
            return;
        }
        const current = parseInt(currentEp) || 0;
        setPendingAnime(animeData);
        setPendingStartEp(current);
        setActiveTab('calendario');
    };

    const epHint = animeData && parseInt(currentEp) > 0
        ? `Você vai assistir a partir do ep ${parseInt(currentEp) + 1} (${animeData.episodes - parseInt(currentEp)} eps restantes)`
        : null;

    return (
        <LinearGradient colors={COLORS.backgroundGradient} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <View style={styles.tabBar}>
                {TABS_DATA.map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {activeTab === 'home' && (
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.headerTitle}>
                        Baka<Text style={styles.brandText}>Timer</Text>
                    </Text>
                    <Text style={styles.headerSubtitle}>Calculadora de maratona</Text>

                    <View style={styles.card}>
                        <Text style={styles.label}>Buscar Anime</Text>
                        <View style={styles.searchRow}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                placeholder="Ex: Naruto, Jujutsu, Cyberpunk..."
                                placeholderTextColor="#64748b"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={searchAnime}
                                returnKeyType="search"
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
                            epHint={epHint}
                        />
                    )}

                    {animeData && (
                        <>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Configurações da Maratona</Text>
                                <OptionCheckbox
                                    label="Pular Openings/Endings (-3 min)"
                                    checked={skipOpenings}
                                    onPress={() => setSkipOpenings(!skipOpenings)}
                                />
                                <OptionCheckbox
                                    label="Pular Recaps (-2 min)"
                                    checked={skipRecaps}
                                    onPress={() => setSkipRecaps(!skipRecaps)}
                                />
                            </View>

                            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={calculateTime}>
                                <Text style={styles.buttonText}>Calcular Tempo Restante</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonSecondary} activeOpacity={0.8} onPress={addAnimeToCalendar}>
                                <Text style={styles.buttonSecondaryText}>Adicionar ao Calendário</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {result && (
                        <View style={styles.resultCard}>
                            <Text style={styles.resultValue}>{result}</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            {activeTab === 'calendario' && (
                <AbaCalendario
                    pendingAnime={pendingAnime}
                    pendingStartEp={pendingStartEp}
                    onPendingConsumed={() => { setPendingAnime(null); setPendingStartEp(0); }}
                />
            )}

            {activeTab === 'sobrenos' && (
                <AbaSobrenos/>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    tabBar: {
        flexDirection: 'row',
        marginHorizontal: 24,
        marginTop: 56,
        marginBottom: 8,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    tabActive: { backgroundColor: COLORS.primary },
    tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
    tabTextActive: { color: '#ffffff' },
    scrollContainer: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textMain, letterSpacing: 0.5 },
    brandText: { color: COLORS.primary },
    headerSubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4, marginBottom: 24 },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.textLabel, marginBottom: 8 },
    searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
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
    searchButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: { fontSize: 18 },
    errorText: { color: '#ef4444', marginTop: 10, fontWeight: '600' },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: { color: COLORS.textMain, fontSize: 15, fontWeight: '700' },
    buttonSecondary: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    buttonSecondaryText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
    resultCard: {
        backgroundColor: 'rgba(249, 115, 22, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginTop: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    resultValue: { fontSize: 18, fontWeight: '800', color: COLORS.textMain, textAlign: 'center' },
});