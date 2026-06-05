import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Modal, TextInput, Alert, Platform, ActivityIndicator
} from 'react-native';
import * as Calendar from 'expo-calendar';
import { COLORS } from '../css/themes';

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const CORES_SELECAO = ['#f97316', '#ef4444', '#3b82f6', '#10b981', '#a855f7'];

async function getDefaultCalendarId() {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    if (Platform.OS === 'android') {
        const primary = calendars.find(c => c.isPrimary) || calendars[0];
        return primary?.id ?? null;
    }
    const defaultCal = await Calendar.getDefaultCalendarAsync();
    return defaultCal?.id ?? null;
}

// Gera os blocos de sessão: distribui os eps em dias consecutivos
function gerarSessoes(anime, epsPorDia, minutosPorEp, dataInicio) {
    const total = anime.episodes;
    const sessoes = [];
    let epAtual = 1;
    let dia = new Date(dataInicio);
    dia.setHours(20, 0, 0, 0);

    while (epAtual <= total) {
        const epFim = Math.min(epAtual + epsPorDia - 1, total);
        const qtd = epFim - epAtual + 1;
        const duracaoMin = qtd * minutosPorEp;

        sessoes.push({
            titulo: `🍿 ${anime.title} — Eps ${epAtual}-${epFim}`,
            epInicio: epAtual,
            epFim,
            inicio: new Date(dia),
            fim: new Date(dia.getTime() + duracaoMin * 60 * 1000),
            duracaoMin,
        });

        epAtual = epFim + 1;
        dia = new Date(dia);
        dia.setDate(dia.getDate() + 1); // próximo dia
    }

    return sessoes;
}

export default function AbaCalendario({ pendingAnime, onPendingConsumed }) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [events, setEvents] = useState([]);

    // Modal de agendamento
    const [modalVisible, setModalVisible] = useState(false);
    const [epsPorDia, setEpsPorDia] = useState('');
    const [horario, setHorario] = useState('20:00');
    const [cor, setCor] = useState('#f97316');
    const [salvando, setSalvando] = useState(false);
    const [previewSessoes, setPreviewSessoes] = useState([]);
    const [animeParaAgendar, setAnimeParaAgendar] = useState(null);

    // Recebe anime vindo do home
    useEffect(() => {
        if (pendingAnime) {
            setAnimeParaAgendar(pendingAnime);
            setEpsPorDia('');
            setHorario('20:00');
            setCor('#f97316');
            setPreviewSessoes([]);
            setModalVisible(true);
            onPendingConsumed?.();
        }
    }, [pendingAnime]);

    // Atualiza preview toda vez que muda eps/dia ou horário
    useEffect(() => {
        if (!animeParaAgendar || !epsPorDia || parseInt(epsPorDia) < 1) {
            setPreviewSessoes([]);
            return;
        }
        const [h, m] = (horario || '20:00').split(':').map(Number);
        const inicio = new Date();
        inicio.setDate(inicio.getDate() + 1);
        inicio.setHours(h || 20, m || 0, 0, 0);

        const sessoes = gerarSessoes(
            animeParaAgendar,
            parseInt(epsPorDia),
            animeParaAgendar.duration,
            inicio
        );
        setPreviewSessoes(sessoes);
    }, [epsPorDia, horario, animeParaAgendar]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const dayHasEvent = (day) =>
        events.some(e => e.day === day && e.month === month && e.year === year);

    const selectedDayEvents = events.filter(
        e => e.day === selectedDay && e.month === month && e.year === year
    );

    const isToday = (day) =>
        day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const handleSalvar = async () => {
        if (!animeParaAgendar || previewSessoes.length === 0) return;
        setSalvando(true);

        try {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Autorize o acesso ao calendário nas configurações.');
                setSalvando(false);
                return;
            }

            const calendarId = await getDefaultCalendarId();
            if (!calendarId) {
                Alert.alert('Erro', 'Não foi possível encontrar um calendário no dispositivo.');
                setSalvando(false);
                return;
            }

            // Cria todos os eventos no calendário nativo
            for (const sessao of previewSessoes) {
                await Calendar.createEventAsync(calendarId, {
                    title: sessao.titulo,
                    startDate: sessao.inicio,
                    endDate: sessao.fim,
                    notes: `${animeParaAgendar.title}\nEps ${sessao.epInicio}–${sessao.epFim} · ${sessao.duracaoMin} min\nAgendado pelo BakaTimer`,
                    alarms: [{ relativeOffset: -15 }],
                });
            }

            // Salva também no estado local do app para aparecer no calendário interno
            const novosEventos = previewSessoes.map(s => ({
                day: s.inicio.getDate(),
                month: s.inicio.getMonth(),
                year: s.inicio.getFullYear(),
                name: animeParaAgendar.title,
                time: `${String(s.inicio.getHours()).padStart(2,'0')}:${String(s.inicio.getMinutes()).padStart(2,'0')}`,
                eps: `Eps ${s.epInicio}-${s.epFim}`,
                color: cor,
            }));
            setEvents(prev => [...prev, ...novosEventos]);

            setModalVisible(false);
            Alert.alert(
                '✅ Agendado!',
                `${previewSessoes.length} sessão(ões) de "${animeParaAgendar.title}" foram salvas no seu calendário com lembrete de 15 min!`
            );
        } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Não foi possível criar os eventos no calendário.');
        } finally {
            setSalvando(false);
        }
    };

    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerTitle}>Baka<Text style={styles.brand}>Timer</Text></Text>
            <Text style={styles.headerSub}>Calendário de maratonas</Text>

            {/* Calendário */}
            <View style={styles.card}>
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={goToPrevMonth} style={styles.navBtn}>
                        <Text style={styles.navBtnText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.monthLabel}>{MESES[month]} {year}</Text>
                    <TouchableOpacity onPress={goToNextMonth} style={styles.navBtn}>
                        <Text style={styles.navBtnText}>›</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.weekRow}>
                    {DIAS_SEMANA.map(d => <Text key={d} style={styles.weekDay}>{d}</Text>)}
                </View>

                <View style={styles.daysGrid}>
                    {blanks.map((_, i) => <View key={`b${i}`} style={styles.dayCell} />)}
                    {days.map(day => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayCell,
                                isToday(day) && styles.dayCellToday,
                                selectedDay === day && styles.dayCellSelected,
                            ]}
                            onPress={() => setSelectedDay(day)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.dayText,
                                isToday(day) && styles.dayTextToday,
                                selectedDay === day && styles.dayTextSelected,
                            ]}>
                                {day}
                            </Text>
                            {dayHasEvent(day) && <View style={styles.eventDot} />}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Eventos do dia */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📅 Dia {selectedDay} de {MESES[month]}</Text>

                {selectedDayEvents.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma maratona agendada para este dia.</Text>
                ) : (
                    selectedDayEvents.map((ev, i) => (
                        <View key={i} style={styles.eventItem}>
                            <View style={[styles.eventColorDot, { backgroundColor: ev.color || COLORS.primary }]} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.eventName}>{ev.name}</Text>
                                <Text style={styles.eventMeta}>{ev.time}{ev.eps ? ` · ${ev.eps}` : ''}</Text>
                            </View>
                        </View>
                    ))
                )}

                <TouchableOpacity style={styles.addBtn} onPress={() => {
                    setAnimeParaAgendar(null);
                    setEpsPorDia('');
                    setHorario('20:00');
                    setCor('#f97316');
                    setPreviewSessoes([]);
                    setModalVisible(true);
                }} activeOpacity={0.8}>
                    <Text style={styles.addBtnText}>+ Agendar maratona</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de agendamento */}
            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalCard} showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalTitle}>
                            {animeParaAgendar ? `📺 ${animeParaAgendar.title}` : 'Nova Maratona'}
                        </Text>
                        {animeParaAgendar && (
                            <Text style={styles.modalSub}>
                                {animeParaAgendar.episodes} eps · {animeParaAgendar.duration} min cada
                            </Text>
                        )}

                        <Text style={styles.inputLabel}>Quantos episódios por dia?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 3"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={epsPorDia}
                            onChangeText={setEpsPorDia}
                        />

                        <Text style={styles.inputLabel}>Horário de início</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 20:00"
                            placeholderTextColor="#64748b"
                            value={horario}
                            onChangeText={setHorario}
                        />

                        <Text style={styles.inputLabel}>Cor no app</Text>
                        <View style={styles.colorRow}>
                            {CORES_SELECAO.map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.colorDot, { backgroundColor: c }, cor === c && styles.colorDotSelected]}
                                    onPress={() => setCor(c)}
                                />
                            ))}
                        </View>

                        {/* Preview das sessões */}
                        {previewSessoes.length > 0 && (
                            <View style={styles.previewBox}>
                                <Text style={styles.previewTitle}>
                                    📋 Preview — {previewSessoes.length} dia(s) para terminar
                                </Text>
                                {previewSessoes.map((s, i) => (
                                    <View key={i} style={styles.previewItem}>
                                        <Text style={styles.previewDay}>
                                            {s.inicio.getDate()}/{s.inicio.getMonth() + 1}
                                        </Text>
                                        <Text style={styles.previewInfo}>
                                            Eps {s.epInicio}–{s.epFim} · {s.duracaoMin} min
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} disabled={salvando}>
                                <Text style={styles.cancelBtnText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.confirmBtn, (salvando || previewSessoes.length === 0) && { opacity: 0.5 }]}
                                onPress={handleSalvar}
                                disabled={salvando || previewSessoes.length === 0}
                            >
                                {salvando
                                    ? <ActivityIndicator color="#fff" size="small" />
                                    : <Text style={styles.confirmBtnText}>Salvar no Calendário 📅</Text>
                                }
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 20 }} />
                    </ScrollView>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    scroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textMain, letterSpacing: 0.5 },
    brand: { color: COLORS.primary },
    headerSub: { fontSize: 14, color: COLORS.textMuted, marginTop: 4, marginBottom: 24 },
    card: { backgroundColor: COLORS.cardBackground, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.cardBorder },
    cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, marginBottom: 14 },
    monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    navBtn: { backgroundColor: 'rgba(249,115,22,0.15)', borderWidth: 0.5, borderColor: 'rgba(249,115,22,0.3)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
    navBtnText: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
    monthLabel: { color: COLORS.textMain, fontSize: 15, fontWeight: '600' },
    weekRow: { flexDirection: 'row', marginBottom: 8 },
    weekDay: { flex: 1, textAlign: 'center', fontSize: 11, color: '#64748b', fontWeight: '600' },
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: '14.28%', alignItems: 'center', paddingVertical: 6, borderRadius: 8, minHeight: 36, justifyContent: 'center' },
    dayCellToday: { backgroundColor: 'rgba(249,115,22,0.2)', borderWidth: 0.5, borderColor: 'rgba(249,115,22,0.4)' },
    dayCellSelected: { backgroundColor: 'rgba(249,115,22,0.35)' },
    dayText: { fontSize: 13, color: '#94a3b8' },
    dayTextToday: { color: COLORS.primary, fontWeight: '700' },
    dayTextSelected: { color: '#fff', fontWeight: '600' },
    eventDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.primary, marginTop: 2 },
    emptyText: { color: '#475569', fontSize: 13, textAlign: 'center', paddingVertical: 12 },
    eventItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 10, marginBottom: 8, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.05)' },
    eventColorDot: { width: 8, height: 8, borderRadius: 4 },
    eventName: { fontSize: 13, color: COLORS.textMain, fontWeight: '600' },
    eventMeta: { fontSize: 11, color: '#64748b', marginTop: 2 },
    addBtn: { marginTop: 8, paddingVertical: 12, backgroundColor: 'rgba(249,115,22,0.15)', borderWidth: 0.5, borderColor: 'rgba(249,115,22,0.3)', borderRadius: 10, alignItems: 'center' },
    addBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalCard: { backgroundColor: '#1e293b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, maxHeight: '90%' },
    modalTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textMain, marginBottom: 2 },
    modalSub: { fontSize: 13, color: COLORS.textMuted, marginBottom: 16 },
    inputLabel: { fontSize: 13, color: COLORS.textLabel, marginBottom: 6, marginTop: 14 },
    input: { backgroundColor: COLORS.inputBackground, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, color: COLORS.textMain, fontSize: 15, borderWidth: 1, borderColor: COLORS.inputBorder },
    colorRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    colorDot: { width: 28, height: 28, borderRadius: 14 },
    colorDotSelected: { borderWidth: 3, borderColor: '#fff' },

    previewBox: { marginTop: 20, backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: 'rgba(249,115,22,0.3)' },
    previewTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
    previewItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.05)' },
    previewDay: { fontSize: 13, color: COLORS.textMain, fontWeight: '600' },
    previewInfo: { fontSize: 13, color: COLORS.textMuted },

    modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
    cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
    cancelBtnText: { color: COLORS.textMuted, fontSize: 15, fontWeight: '600' },
    confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
    confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});