import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sparksService } from '@/lib/appwrite-service';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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

export default function SparkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadSpark = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const spark = await sparksService.getSpark(id as string);
      setTitle(spark.title);
      setContent(spark.content);
    } catch (error) {
      console.error('Errore nel caricamento della spark:', error);
      Alert.alert('Errore', 'Impossibile caricare la spark');
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSpark();
  }, [loadSpark]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Errore', 'Il titolo non può essere vuoto');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Errore', 'Il contenuto non può essere vuoto');
      return;
    }

    try {
      setIsSaving(true);
      await sparksService.updateSpark(id as string, title.trim(), content.trim());
      setIsEditing(false);
      setIsSaving(false);
      // La lista si aggiornerà automaticamente quando si torna alla dashboard
    } catch (error) {
      console.error('Errore nel salvataggio della spark:', error);
      Alert.alert('Errore', 'Impossibile salvare le modifiche');
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Elimina Spark',
      'Sei sicuro di voler eliminare questa spark? Questa azione non può essere annullata.',
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              await sparksService.deleteSpark(id as string);
              // Torna indietro immediatamente, la lista si aggiornerà automaticamente
              router.back();
            } catch (error) {
              console.error('Errore nell\'eliminazione della spark:', error);
              Alert.alert('Errore', 'Impossibile eliminare la spark');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header interno con azioni */}
          <View style={styles.inlineHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>
              Dettaglio Spark
            </ThemedText>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={24} color="#00D4FF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Title */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Titolo</ThemedText>
            <TextInput
              style={[styles.titleInput, !isEditing && styles.inputDisabled]}
              value={title}
              onChangeText={setTitle}
              maxLength={200}
              editable={isEditing}
            />
            {isEditing && (
              <ThemedText style={styles.charCount}>
                {title.length}/200
              </ThemedText>
            )}
          </View>

          {/* Content */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Contenuto</ThemedText>
            <TextInput
              style={[styles.contentInput, !isEditing && styles.inputDisabled]}
              value={content}
              onChangeText={setContent}
              maxLength={1000}
              multiline
              numberOfLines={15}
              textAlignVertical="top"
              editable={isEditing}
            />
            {isEditing && (
              <ThemedText style={styles.charCount}>
                {content.length}/1000
              </ThemedText>
            )}
          </View>

          {/* Action Buttons */}
          {isEditing && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  loadSpark();
                }}
                disabled={isSaving}
              >
                <ThemedText style={styles.cancelButtonText}>
                  Annulla
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    <ThemedText style={styles.saveButtonText}>
                      Salva
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: '#FF4444',
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  titleInput: {
    backgroundColor: '#1A2942',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
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
    minHeight: 300,
  },
  inputDisabled: {
    backgroundColor: '#0F1F3A',
    borderColor: '#1A2942',
  },
  charCount: {
    fontSize: 12,
    color: '#8B92A0',
    textAlign: 'right',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2A3952',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#00D4FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
