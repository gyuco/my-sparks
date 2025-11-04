import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { settingsService } from '@/lib/appwrite-service';
import { AISettings } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated]);

  const loadSettings = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingSettings(true);
      const userSettings = await settingsService.getUserSettings(user.$id);
      setSettings(userSettings);
      setSelectedModel(userSettings.model);
      setTemperature(userSettings.temperature);
    } catch (error) {
      console.error('Errore nel caricamento delle impostazioni:', error);
      Alert.alert('Errore', 'Impossibile caricare le impostazioni');
    } finally {
      setLoadingSettings(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user, loadSettings]);

  const handleSave = async () => {
    if (!settings || !user) return;

    try {
      setSaving(true);
      await settingsService.updateUserSettings(
        settings.$id!,
        selectedModel,
        temperature
      );
      Alert.alert('Successo', 'Impostazioni salvate con successo!');
    } catch (error) {
      console.error('Errore nel salvataggio delle impostazioni:', error);
      Alert.alert('Errore', 'Impossibile salvare le impostazioni');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loadingSettings) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D4FF" />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Impostazioni AI</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={24} color="#00D4FF" />
            <ThemedText style={styles.cardTitle}>Profilo Utente</ThemedText>
          </View>
          <View style={styles.userInfoContainer}>
            <ThemedText style={styles.userLabel}>Nome:</ThemedText>
            <ThemedText style={styles.userValue}>{user?.name || 'N/A'}</ThemedText>
          </View>
          <View style={styles.userInfoContainer}>
            <ThemedText style={styles.userLabel}>Email:</ThemedText>
            <ThemedText style={styles.userValue}>{user?.email || 'N/A'}</ThemedText>
          </View>
        </View>

        {/* AI Settings Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles-outline" size={24} color="#00D4FF" />
            <ThemedText style={styles.cardTitle}>
              Impostazioni Generazione AI
            </ThemedText>
          </View>

          {/* Model Selection */}
          <View style={styles.settingSection}>
            <ThemedText style={styles.settingLabel}>Modello AI</ThemedText>
            <ThemedText style={styles.settingDescription}>
              Inserisci il nome del modello di intelligenza artificiale da utilizzare
            </ThemedText>
            <TextInput
              style={styles.textInput}
              value={selectedModel}
              onChangeText={setSelectedModel}
              placeholder="es. openai/gpt-4"
              placeholderTextColor="#8B92A0"
            />
          </View>

          {/* Temperature Input */}
          <View style={styles.settingSection}>
            <ThemedText style={styles.settingLabel}>Temperatura</ThemedText>
            <ThemedText style={styles.settingDescription}>
              Controlla la creatività delle risposte (valore tra 0 e 1, default 0.7)
            </ThemedText>
            <TextInput
              style={styles.textInput}
              value={temperature.toString()}
              onChangeText={(text) => {
                const value = parseFloat(text);
                if (!isNaN(value) && value >= 0 && value <= 1) {
                  setTemperature(value);
                } else if (text === '' || text === '.') {
                  setTemperature(0);
                }
              }}
              placeholder="0.7"
              placeholderTextColor="#8B92A0"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
              <ThemedText style={styles.saveButtonText}>
                Salva Impostazioni
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        {/* Info Card */}
        <View style={[styles.card, styles.infoCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#FFA500" />
            <ThemedText style={styles.cardTitle}>Informazioni</ThemedText>
          </View>
          <ThemedText style={styles.infoText}>
            Le impostazioni verranno applicate alla prossima generazione di Spark.
            I modelli più avanzati potrebbero avere costi maggiori.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3952',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#1A2942',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A3952',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  userLabel: {
    fontSize: 14,
    color: '#8B92A0',
  },
  userValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  settingSection: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 13,
    color: '#8B92A0',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#0F1F3A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A3952',
    color: '#FFFFFF',
    fontSize: 16,
    padding: 14,
    height: 50,
  },

  saveButton: {
    backgroundColor: '#00D4FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#1A2942',
    borderColor: '#FFA500',
    marginBottom: 40,
  },
  infoText: {
    fontSize: 13,
    color: '#B0B8C4',
    lineHeight: 20,
  },
});
