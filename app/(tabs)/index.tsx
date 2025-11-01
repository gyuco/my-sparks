import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const handleLogout = () => {
    // Torna alla pagina di login
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=33' }}
            style={styles.avatar}
          />
          <View style={styles.welcomeContainer}>
            <ThemedText style={styles.welcomeText}>Welcome Back</ThemedText>
            <ThemedText style={styles.userName}>Guest User</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* My Sparks Section */}
      <View style={styles.sparksHeader}>
        <ThemedText style={styles.sparksTitle}>My Sparks</ThemedText>
        <ThemedText style={styles.notesCount}>0 notes</ThemedText>
      </View>

      {/* Empty State */}
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <ThemedText style={styles.emptyIconText}>✨</ThemedText>
        </View>
        <ThemedText style={styles.emptyTitle}>No Sparks Yet</ThemedText>
        <ThemedText style={styles.emptySubtitle}>
          Tap the &apos;+&apos; button to add your first idea.
        </ThemedText>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#00D4FF" />
          <ThemedText style={styles.navTextActive}>Home</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
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
