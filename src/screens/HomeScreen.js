import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import ProviderCard from '../components/ProviderCard';
import { providers, categories } from '../data/mockProviders';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { upcomingAppointments } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.specialty.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{firstName} 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.appointmentsBadge}
          onPress={() => navigation.navigate('Appointments')}
          activeOpacity={0.8}
        >
          <Text style={styles.appointmentsIcon}>📅</Text>
          {upcomingAppointments.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{upcomingAppointments.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, specialties..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Strip */}
      {upcomingAppointments.length > 0 && (
        <TouchableOpacity
          style={styles.upcomingStrip}
          onPress={() => navigation.navigate('Appointments')}
          activeOpacity={0.8}
        >
          <Text style={styles.upcomingStripIcon}>🔔</Text>
          <Text style={styles.upcomingStripText}>
            You have {upcomingAppointments.length} upcoming appointment
            {upcomingAppointments.length > 1 ? 's' : ''}
          </Text>
          <Text style={styles.upcomingStripArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Providers List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Available Doctors</Text>
        <Text style={styles.listCount}>{filtered.length} found</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => navigation.navigate('ProviderDetails', { provider: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or category</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 20,
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  userName: { fontSize: 22, color: '#FFFFFF', fontWeight: '800', marginTop: 2 },
  appointmentsBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  appointmentsIcon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6584',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, color: '#FFF', fontWeight: '800' },
  searchContainer: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A2E' },
  clearIcon: { fontSize: 14, color: '#94A3B8', padding: 4 },
  categoriesSection: { backgroundColor: '#FFFFFF', paddingVertical: 12 },
  categoriesList: { paddingHorizontal: 16, gap: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#EDE9FF',
    borderColor: '#6C63FF',
  },
  categoryChipIcon: { fontSize: 14, marginRight: 5 },
  categoryChipText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  categoryChipTextActive: { color: '#6C63FF' },
  upcomingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  upcomingStripIcon: { fontSize: 16, marginRight: 8 },
  upcomingStripText: { flex: 1, fontSize: 13, fontWeight: '500', color: '#92400E' },
  upcomingStripArrow: { fontSize: 16, color: '#92400E' },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  listTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  listCount: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  listContent: { paddingBottom: 24 },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center' },
});

export default HomeScreen;
