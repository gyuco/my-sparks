import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Logica di login
    console.log('Login:', { email, password });
    // Usa replace invece di push per evitare di tornare indietro al login
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ThemedView style={styles.container}>
        {/* Logo e cerchi concentrici */}
        <View style={styles.logoContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <ThemedText style={styles.logoIcon}>⭐</ThemedText>
            </View>
          </View>
        </View>

        {/* Titolo */}
        <ThemedText style={styles.title}>My Sparks</ThemedText>
        <ThemedText style={styles.subtitle}>
          Capture your ideas and let AI turn{'\n'}them into developed concepts.
        </ThemedText>

        {/* Form di Login */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>
              Forgot password?
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Pulsante Enter */}
        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00D4FF', '#0080FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <ThemedText style={styles.enterButtonText}>Enter</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        {/* Link registrazione */}
        <View style={styles.signupContainer}>
          <ThemedText style={styles.signupText}>
            Don&apos;t have an account?{' '}
          </ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.signupLink}>Sign up</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#2A4A6F',
    backgroundColor: '#0F1F3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1A2942',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A4A6F',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#00D4FF',
    fontSize: 14,
  },
  enterButton: {
    width: '100%',
    maxWidth: 400,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 20,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  signupText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  signupLink: {
    color: '#00D4FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
