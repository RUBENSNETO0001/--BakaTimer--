import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Modal, TextInput
} from 'react-native';
import { COLORS } from '../css/themes';

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Adicionado o array de cores para a seleção do modal
const CORES_SELECAO = ['#f97316', '#ef4444', '#3b82f6', '#10b981', '#a855f7'];

export default function AbaCalendario() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [events, setEvents] = useState([
        { day: today.getDate(), month: today.getMonth(), year: today.getFullYear(), name: 'Dia Atual', time: '14:00', eps: 'Eps 1-12', color: '#f97316' },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newEvent, setNewEvent] = useState({ name: '', time: '', eps: '', color: '#f97316' });

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

    const handleAddEvent = () => {
        if (!newEvent.name.trim()) return;
        setEvents(prev => [...prev, {
            ...newEvent,
            day: selectedDay, month, year,
        }]);
        setNewEvent({ name: '', time: '', eps: '', color: '#f97316' });
        setModalVisible(false);
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
                    {DIAS_SEMANA.map(d => (
                        <Text key={d} style={styles.weekDay}>{d}</Text>
                    ))}
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

            {/* Lista de eventos do dia */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>
                    📅 Dia {selectedDay} de {MESES[month]}
                </Text>

                {selectedDayEvents.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma maratona agendada para este dia.</Text>
                ) : (
                    selectedDayEvents.map((ev, i) => (
                        <View key={i} style={styles.eventItem}>
                            {/* Pontinho com a cor dinâmica salva no evento */}
                            <View style={[styles.eventColorDot, { backgroundColor: ev.color || COLORS.primary }]} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.eventName}>{ev.name}</Text>
                                <Text style={styles.eventMeta}>
                                    {ev.time}{ev.eps ? ` · ${ev.eps}` : ''}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
                    <Text style={styles.addBtnText}>+ Agendar maratona</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de novo evento */}
            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Nova Maratona</Text>

                        <Text style={styles.inputLabel}>Anime</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Attack on Titan"
                            placeholderTextColor="#64748b"
                            value={newEvent.name}
                            onChangeText={v => setNewEvent(p => ({ ...p, name: v }))}
                        />

                        <Text style={styles.inputLabel}>Horário</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 22:22"
                            placeholderTextColor="#64748b"
                            value={newEvent.time}
                            onChangeText={v => setNewEvent(p => ({ ...p, time: v }))}
                        />

                        <Text style={styles.inputLabel}>Episódios</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Eps 1-12"
                            placeholderTextColor="#64748b"
                            value={newEvent.eps}
                            onChangeText={v => setNewEvent(p => ({ ...p, eps: v }))}
                        />

                        <Text style={styles.inputLabel}>Cor</Text>
                        <View style={styles.colorRow}>
                            {/* Correção aqui: Saudade da minha ex*/}
                            {CORES_SELECAO.map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[
                                        styles.colorDot, 
                                        { backgroundColor: c },
                                        newEvent.color === c && styles.colorDotSelected
                                    ]}
                                    onPress={() => setNewEvent(p => ({ ...p, color: c }))}
                                />
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleAddEvent}>
                                <Text style={styles.confirmBtnText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    scroll: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textMain, letterSpacing: 0.5 },
    brand: { color: COLORS.primary },
    headerSub: { fontSize: 14, color: COLORS.textMuted, marginTop: 4, marginBottom: 24 },
    card: { backgroundColor: COLORS.cardBackground, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.cardBorder },
    cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, marginBottom: 14 },

    // Navegação de mês
    monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    navBtn: { backgroundColor: 'rgba(249,115,22,0.15)', borderWidth: 0.5, borderColor: 'rgba(249,115,22,0.3)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
    navBtnText: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
    monthLabel: { color: COLORS.textMain, fontSize: 15, fontWeight: '600' },

    // Dias da semana
    weekRow: { flexDirection: 'row', marginBottom: 8 },
    weekDay: { flex: 1, textAlign: 'center', fontSize: 11, color: '#64748b', fontWeight: '600' },

    // Grid de dias
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: '14.28%', alignItems: 'center', paddingVertical: 6, borderRadius: 8, minHeight: 36, justifyContent: 'center' },
    dayCellToday: { backgroundColor: 'rgba(249,115,22,0.2)', borderWidth: 0.5, borderColor: 'rgba(249,115,22,0.4)' },
    dayCellSelected: { backgroundColor: 'rgba(249,115,22,0.35)' },
    dayText: { fontSize: 13, color: '#94a3b8' },
    dayTextToday: { color: COLORS.primary, fontWeight: '700' },
    dayTextSelected: { color: '#fff', fontWeight: '600' },
    eventDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.primary, marginTop: 2 },

    // Eventos
    emptyText: { color: '#475569', fontSize: 13, textAlign: 'center', paddingVertical: 12 },
    eventItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 10, marginBottom: 8, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.05)' },
    eventColorDot: { width: 8, height: 8, borderRadius: 4 },
    eventName: { fontSize: 13, color: COLORS.textMain, fontWeight: '600' },
    eventMeta: { fontSize: 11, color: '#64748b', marginTop: 2 },
    addBtn: { marginTop: 8, paddingVertical: 12, backgroundColor: 'rgba(249,115,22,0.15)', borderWidth: 0.5, borderColor: 'rgba(249,115,22,0.3)', borderRadius: 10, alignItems: 'center' },
    addBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalCard: { backgroundColor: '#1e293b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 40 },
    modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textMain, marginBottom: 20 },
    inputLabel: { fontSize: 13, color: COLORS.textLabel, marginBottom: 6, marginTop: 12 },
    input: { backgroundColor: COLORS.inputBackground, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, color: COLORS.textMain, fontSize: 15, borderWidth: 1, borderColor: COLORS.inputBorder },
    colorRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    colorDot: { width: 28, height: 28, borderRadius: 14 },
    colorDotSelected: { borderWidth: 3, borderColor: '#fff' },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
    cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
    cancelBtnText: { color: COLORS.textMuted, fontSize: 15, fontWeight: '600' },
    confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
    confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});