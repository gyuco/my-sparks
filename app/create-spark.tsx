import { AIStreamingIndicator } from '@/components/ai-streaming-indicator';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VoiceInputButton } from '@/components/voice-input-button';
import { useAuth } from '@/hooks/use-auth';
import { aiService, settingsService, sparksService } from '@/lib/appwrite-service';
import { AISettings, DEFAULT_AI_SETTINGS } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CreateSparkScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<AISettings | null>(null);

  // Carica le impostazioni dell'utente
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      try {
        const userSettings = await settingsService.getUserSettings(user.$id);
        setSettings(userSettings);
      } catch (error) {
        console.error('Errore nel caricamento delle impostazioni:', error);
        // Usa valori di default se non riesce a caricare
      }
    };
    loadSettings();
  }, [user]);

  const handleGenerateWithAI = async () => {
    console.log('=== INIZIO handleGenerateWithAI ===');
    console.log('Title:', title);
    
    if (!title.trim()) {
      Alert.alert('Suggerimento', 'Inserisci prima un titolo per generare contenuto più pertinente');
      return;
    }

    try {
      console.log('Setting isGenerating to true');
      setIsGenerating(true);
      
      // Crea un prompt per l'IA
      const prompt = `Scrivi un contenuto creativo e coinvolgente per una "spark" (idea innovativa) con il seguente titolo: "${title}". Il contenuto deve essere ispirazionale, conciso e stimolare la creatività. Massimo 200 parole.`;
      
      console.log('Prompt creato:', prompt);
      console.log('Chiamando aiService.generateText...');

      // Usa le impostazioni dell'utente o i valori di default
      const model = settings?.model || DEFAULT_AI_SETTINGS.model;
      const temperature = settings?.temperature || DEFAULT_AI_SETTINGS.temperature;

      console.log('Using model:', model, 'temperature:', temperature);

      // Chiama la funzione OpenRouter
      const generatedText = await aiService.generateText(
        prompt,
        model,
        temperature
      );
      
      console.log('Testo generato:', generatedText);
      setContent(generatedText);
    } catch (error) {
      console.error('=== ERRORE nella generazione ===', error);
      Alert.alert('Errore', 'Impossibile generare il contenuto. Riprova.');
    } finally {
      console.log('Setting isGenerating to false');
      setIsGenerating(false);
      console.log('=== FINE handleGenerateWithAI ===');
    }
  };

  const handleCreateSpark = async () => {
    if (!title.trim()) {
      Alert.alert('Errore', 'Inserisci un titolo per la tua spark');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Errore', 'Inserisci il contenuto della tua spark');
      return;
    }

    if (!user) {
      Alert.alert('Errore', 'Devi essere loggato per creare una spark');
      return;
    }

    try {
      setIsSubmitting(true);
      await sparksService.createSpark(title.trim(), content.trim(), user.$id);
      // Torna indietro immediatamente, la lista si aggiornerà automaticamente
      router.back();
    } catch (error) {
      console.error('Errore nella creazione della spark:', error);
      Alert.alert('Errore', 'Impossibile creare la spark. Riprova.');
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Nuova Spark</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Titolo</ThemedText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.titleInput}
                placeholder="Dai un titolo alla tua idea..."
                placeholderTextColor="#8B92A0"
                value={title}
                onChangeText={setTitle}
                maxLength={200}
                editable={!isSubmitting}
              />
              <View style={styles.voiceButtonWrapper}>
                <VoiceInputButton
                  onTranscript={(text) => setTitle((prev) => prev + ' ' + text)}
                  disabled={isSubmitting}
                />
              </View>
            </View>
            <ThemedText style={styles.charCount}>
              {title.length}/200
            </ThemedText>
          </View>

          {/* Content Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <ThemedText style={styles.label}>Contenuto</ThemedText>
              <TouchableOpacity
                style={styles.aiButton}
                onPress={handleGenerateWithAI}
                disabled={isGenerating || isSubmitting}
              >
                {isGenerating ? (
                  <ActivityIndicator size="small" color="#00D4FF" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={16} color="#00D4FF" />
                    <ThemedText style={styles.aiButtonText}>
                      Genera con IA
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            {/* Indicatore streaming */}
            <AIStreamingIndicator isStreaming={isGenerating} />
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.contentInput}
                placeholder="Scrivi la tua idea..."
                placeholderTextColor="#8B92A0"
                value={content}
                onChangeText={setContent}
                maxLength={1000}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                editable={!isSubmitting && !isGenerating}
              />
              <View style={styles.voiceButtonWrapper}>
                <VoiceInputButton
                  onTranscript={(text) => setContent((prev) => prev + ' ' + text)}
                  disabled={isSubmitting || isGenerating}
                />
              </View>
            </View>
            <ThemedText style={styles.charCount}>
              {content.length}/1000
            </ThemedText>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              isSubmitting && styles.createButtonDisabled,
            ]}
            onPress={handleCreateSpark}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.createButtonText}>
                Crea Spark
              </ThemedText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00D4FF',
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00D4FF',
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
  },
  voiceButtonWrapper: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 10,
  },
  titleInput: {
    backgroundColor: '#1A2942',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2A3952',
  },
  contentInput: {
    backgroundColor: '#1A2942',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2A3952',
    minHeight: 200,
  },
  charCount: {
    fontSize: 12,
    color: '#8B92A0',
    textAlign: 'right',
    marginTop: 8,
  },
  createButton: {
    backgroundColor: '#00D4FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
