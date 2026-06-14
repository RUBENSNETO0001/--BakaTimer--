import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#0f172a', '#1e1b4b', '#311042']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <View style={styles.content}>
                <Text style={styles.title}>
                    Bem-vindo à <Text style={styles.brandText}>BakaTime</Text>
                </Text>
                <Text style={styles.subtitle}>O BakaTimer é uma calculadora de maratona ultra minimalista e direta.</Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('./app/(aplicativo)/home')}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingVertical: 64,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    brandText: {
        color: '#f97316',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 12,
    },
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#0f172a',
        fontSize: 18,
        fontWeight: '700',
    },
});