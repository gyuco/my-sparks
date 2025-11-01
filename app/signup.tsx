import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { authService } from '@/lib/appwrite-service';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    setErrorMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await authService.createAccount(email, password, name);
      // Registrazione e login automatico riusciti
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Sign up error:', error);
      const message =
        error.message || 'Could not create account. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
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
          <ThemedText style={styles.title}>Create Account</ThemedText>
          <ThemedText style={styles.subtitle}>
            Join My Sparks and start capturing{'\n'}your brilliant ideas
          </ThemedText>

          {/* Form di Registrazione */}
          <View style={styles.formContainer}>
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>
                  ⚠️ {errorMessage}
                </ThemedText>
              </View>
            ) : null}

            <TextInput
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrorMessage('');
              }}
              autoCapitalize="words"
            />

            <TextInput
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="Password (min 8 characters)"
              placeholderTextColor="#666"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage('');
              }}
              secureTextEntry
            />

            <TextInput
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrorMessage('');
              }}
              secureTextEntry
            />
          </View>

          {/* Pulsante Sign Up */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#00D4FF', '#0080FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.signupButtonText}>
                  Sign Up
                </ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Link login */}
          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>
              Already have an account?{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleBackToLogin}>
              <ThemedText style={styles.loginLink}>Log in</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  outerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 2,
    borderColor: '#2A4A6F',
    backgroundColor: '#0F1F3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 35,
  },
  title: {
    fontSize: 42,
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
  errorContainer: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF6666',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
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
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  signupButton: {
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
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  loginText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  loginLink: {
    color: '#00D4FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
