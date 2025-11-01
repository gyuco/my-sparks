import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { sparksService } from '@/lib/appwrite-service';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Spark {
  $id: string;
  title: string;
  content: string;
  user_id: string;
  $createdAt: string;
  $updatedAt: string;
}

export default function HomeScreen() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [loadingSparks, setLoadingSparks] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated]);

  const loadSparks = useCallback(async (isRefreshing = false) => {
    if (!user) return;
    
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoadingSparks(true);
      }
      const userSparks = await sparksService.getUserSparks(user.$id);
      setSparks(userSparks as unknown as Spark[]);
    } catch (error) {
      console.error('Errore nel caricamento delle sparks:', error);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoadingSparks(false);
      }
    }
  }, [user]);

  const onRefresh = useCallback(() => {
    loadSparks(true);
  }, [loadSparks]);

  useEffect(() => {
    if (user) {
      loadSparks();
    }
  }, [user, loadSparks]);

  // Ricarica le sparks quando la schermata torna in focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadSparks();
      }
    }, [user, loadSparks])
  );

  const handleLogout = async () => {
    await logout();
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <ThemedText style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </ThemedText>
          </View>
          <View style={styles.welcomeContainer}>
            <ThemedText style={styles.welcomeText}>Welcome Back</ThemedText>
            <ThemedText style={styles.userName}>
              {user?.name || 'User'}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* My Sparks Section */}
      <View style={styles.sparksHeader}>
        <ThemedText style={styles.sparksTitle}>My Sparks</ThemedText>
        <ThemedText style={styles.notesCount}>
          {sparks.length} {sparks.length === 1 ? 'nota' : 'note'}
        </ThemedText>
      </View>

      {/* Sparks List or Empty State */}
      {loadingSparks ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D4FF" />
        </View>
      ) : sparks.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <ThemedText style={styles.emptyIconText}>✨</ThemedText>
          </View>
          <ThemedText style={styles.emptyTitle}>Nessuna Spark</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Tocca il pulsante &apos;+&apos; per aggiungere la tua prima idea.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={sparks}
          keyExtractor={(item: Spark) => item.$id}
          contentContainerStyle={styles.sparksList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00D4FF"
              colors={['#00D4FF']}
            />
          }
          renderItem={({ item }: { item: Spark }) => (
            <TouchableOpacity
              style={styles.sparkCard}
              onPress={() => router.push(`/spark/${item.$id}`)}
            >
              <View style={styles.sparkHeader}>
                <ThemedText style={styles.sparkTitle} numberOfLines={1}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.sparkDate}>
                  {new Date(item.$createdAt).toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </ThemedText>
              </View>
              <ThemedText style={styles.sparkContent} numberOfLines={3}>
                {item.content}
              </ThemedText>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#00D4FF" />
          <ThemedText style={styles.navTextActive}>Home</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/create-spark')}
        >
          <View style={styles.addButtonCircle}>
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#8B92A0" />
          <ThemedText style={styles.navText}>Settings</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00D4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#8B92A0',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    padding: 8,
  },
  sparksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sparksTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notesCount: {
    fontSize: 16,
    color: '#00D4FF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A2942',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8B92A0',
    textAlign: 'center',
  },
  sparksList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sparkCard: {
    backgroundColor: '#1A2942',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A3952',
  },
  sparkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sparkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  sparkDate: {
    fontSize: 12,
    color: '#8B92A0',
  },
  sparkContent: {
    fontSize: 14,
    color: '#B0B8C4',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: '#0F1F3A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    color: '#8B92A0',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: '#00D4FF',
    marginTop: 4,
  },
  addButton: {
    marginTop: -30,
  },
  addButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00D4FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
