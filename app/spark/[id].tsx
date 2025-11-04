import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VoiceInputButton } from '@/components/voice-input-button';
import { useAlert } from '@/lib/alert-service';
import { sparksService } from '@/lib/appwrite-service';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function SparkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showAlert } = useAlert();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSpark = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const spark = await sparksService.getSpark(id as string);
      setTitle(spark.title);
      setContent(spark.content);
    } catch (error) {
      console.error('Errore nel caricamento della spark:', error);
      showAlert({
        title: 'Errore',
        message: 'Impossibile caricare la spark',
      });
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id, showAlert]);

  useEffect(() => {
    loadSpark();
  }, [loadSpark]);

  const handleSave = async () => {
    if (!title.trim()) {
      showAlert({
        title: 'Errore',
        message: 'Il titolo non può essere vuoto',
      });
      return;
    }

    if (!content.trim()) {
      showAlert({
        title: 'Errore',
        message: 'Il contenuto non può essere vuoto',
      });
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
      showAlert({
        title: 'Errore',
        message: 'Impossibile salvare le modifiche',
      });
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await sparksService.deleteSpark(id as string);
      setShowDeleteModal(false);
      router.back();
    } catch (error) {
      console.error('Errore nell\'eliminazione della spark:', error);
      showAlert({
        title: 'Errore',
        message: 'Impossibile eliminare la spark',
      });
      setIsDeleting(false);
    }
  };

  const markdownStyles = {
    body: {
      color: '#FFFFFF',
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: 'bold' as const,
      marginTop: 16,
      marginBottom: 12,
    },
    heading2: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold' as const,
      marginTop: 14,
      marginBottom: 10,
    },
    heading3: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold' as const,
      marginTop: 12,
      marginBottom: 8,
    },
    paragraph: {
      color: '#FFFFFF',
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12,
    },
    link: {
      color: '#00D4FF',
      textDecorationLine: 'underline' as const,
    },
    code_inline: {
      backgroundColor: '#1A2942',
      color: '#00D4FF',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    code_block: {
      backgroundColor: '#1A2942',
      color: '#FFFFFF',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    fence: {
      backgroundColor: '#1A2942',
      color: '#FFFFFF',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    blockquote: {
      backgroundColor: '#1A2942',
      borderLeftWidth: 4,
      borderLeftColor: '#00D4FF',
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
    },
    list_item: {
      color: '#FFFFFF',
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 4,
    },
    bullet_list: {
      marginBottom: 12,
    },
    ordered_list: {
      marginBottom: 12,
    },
    strong: {
      fontWeight: 'bold' as const,
      color: '#FFFFFF',
    },
    em: {
      fontStyle: 'italic' as const,
      color: '#FFFFFF',
    },
    hr: {
      backgroundColor: '#2A3952',
      height: 1,
      marginVertical: 16,
    },
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
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={24} color="#00D4FF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.deleteButton]}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Title */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Titolo</ThemedText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.titleInput, !isEditing && styles.inputDisabled]}
                value={title}
                onChangeText={setTitle}
                maxLength={200}
                editable={isEditing}
              />
              {isEditing && (
                <View style={styles.voiceButtonWrapper}>
                  <VoiceInputButton
                    onTranscript={(text) => setTitle((prev) => prev + ' ' + text)}
                    disabled={isSaving}
                  />
                </View>
              )}
            </View>
            {isEditing && (
              <ThemedText style={styles.charCount}>
                {title.length}/200
              </ThemedText>
            )}
          </View>

          {/* Content */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Contenuto</ThemedText>
            {isEditing ? (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.contentInput}
                  value={content}
                  onChangeText={setContent}
                  maxLength={1000}
                  multiline
                  numberOfLines={15}
                  textAlignVertical="top"
                  editable={true}
                />
                <View style={styles.voiceButtonWrapper}>
                  <VoiceInputButton
                    onTranscript={(text) => setContent((prev) => prev + ' ' + text)}
                    disabled={isSaving}
                  />
                </View>
                <ThemedText style={styles.charCount}>
                  {content.length}/1000
                </ThemedText>
              </View>
            ) : (
              <View style={styles.contentDisplay}>
                <Markdown style={markdownStyles}>{content}</Markdown>
              </View>
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

      {/* Modal di conferma eliminazione */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={48} color="#FF4444" style={styles.modalIcon} />
            <ThemedText style={styles.modalTitle}>Elimina Spark</ThemedText>
            <ThemedText style={styles.modalMessage}>
              Sei sicuro di voler eliminare questa spark? Questa azione non può essere annullata.
            </ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                <ThemedText style={styles.modalCancelText}>Annulla</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.modalDeleteText}>Elimina</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    zIndex: 10,
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: '#FF4444',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
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
    marginBottom: 12,
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
  contentDisplay: {
    backgroundColor: '#0F1F3A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1A2942',
    minHeight: 300,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1A2942',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#8B92A0',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#2A3952',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
