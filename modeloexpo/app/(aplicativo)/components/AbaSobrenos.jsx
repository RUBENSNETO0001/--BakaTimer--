import React from 'react';
import { COLORS } from '../../../themes/themes';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Modal, TextInput, Alert, Platform, ActivityIndicator
} from 'react-native';

export default function AbaSobrenos() {
    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
            <View style={styles.container}>
                
                <Text style={styles.titulo}>Sobre Nós</Text>
                
                <Text style={styles.subtitulo}>
                    Versão Alpha <Text style={styles.brandText}>v1.0</Text>
                </Text>
                
                <Text style={styles.desenvolvedor}>Desenvolvido por Rubens Neto</Text>

                <Text style={styles.texto}>
                    O BakaTimer é um projeto pessoal criado por Rubens Neto, um entusiasta de tecnologia e anime. 
                    A ideia surgiu da necessidade de ter uma ferramenta simples e eficiente para calcular o tempo 
                    necessário para maratonar um anime, levando em consideração o número de episódios e a duração média de cada um.
                </Text>
                
                <Text style={styles.texto}>
                    Desde o início, o objetivo do BakaTimer foi criar uma experiência minimalista e direta, 
                    sem distrações ou funcionalidades desnecessárias. A inspiração veio de outros aplicativos de 
                    calendário e gerenciamento de tempo, mas com um foco específico no público otaku.
                </Text>
                
                <Text style={styles.texto}>
                    O desenvolvimento do BakaTimer envolveu a escolha de tecnologias modernas e eficientes, 
                    como React Native para a interface do usuário e Expo para facilitar o processo de desenvolvimento 
                    e distribuição. A estética visual foi cuidadosamente pensada para refletir a cultura otaku, 
                    com uma paleta de cores que remete ao universo dos animes.
                </Text>

                <View style={styles.divisor} />

                <Text style={styles.tituloSecundario}>Contato</Text>
                <Text style={styles.contatoTexto}>Email: rubensnetomartinssuarezneto@gmail.com</Text>
                <Text style={styles.contatoTexto}>Instagram: rube_nsneto</Text>
                
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    container: {
        backgroundColor: COLORS.cardBackground,
        borderColor: COLORS.cardBorder,
        borderWidth: 1,
        padding: 24,
        borderRadius: 12,
        width: '100%',
        shadowColor: '#afafaf',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, 
    },
    titulo: {
        color: COLORS.primary,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    tituloSecundario: {
        color: COLORS.primary,
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 12,
    },
    subtitulo: {
        color: COLORS.textMuted,
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center',
    },
    brandText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    desenvolvedor: {
        color: COLORS.textLabel || '#cbd5e1',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
    },
    texto: {
        color: COLORS.textMuted,
        lineHeight: 22,
        marginBottom: 16,
        fontSize: 15,
        textAlign: 'justify',
    },
    divisor: {
        height: 9,
        backgroundColor: COLORS.cardBorder,
        marginVertical: 20,
        width: '100%',
    },
    contatoTexto: {
        color: COLORS.textMuted,
        fontSize: 14,
        marginBottom: 8,
    }
});