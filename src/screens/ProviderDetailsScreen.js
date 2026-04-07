import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

const ProviderDetailsScreen = ({ route, navigation }) => {
  const { provider } = route.params;

  const stats = [
    { label: 'Experience', value: provider.experience, icon: '🏆' },
    { label: 'Reviews', value: `${provider.reviews}+`, icon: '💬' },
    { label: 'Rating', value: `${provider.rating}/5`, icon: '⭐' },
    { label: 'Fee', value: provider.fee, icon: '💰' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: provider.image }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.doctorName}>{provider.name}</Text>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{provider.category}</Text>
            </View>
          </View>
          <Text style={styles.specialty}>{provider.specialty}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{provider.location}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{provider.about}</Text>
        </View>

        {/* Available Time Slots Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <View style={styles.slotsGrid}>
            {provider.availableSlots.map((slot) => (
              <View key={slot} style={styles.slotPreview}>
                <Text style={styles.slotPreviewText}>{slot}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate('Booking', { provider })}
            activeOpacity={0.85}
          >
            <Text style={styles.bookBtnText}>📅  Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6C63FF',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20, color: '#FFF', fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  headerSpacer: { width: 40 },

  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#EDE9FF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  doctorName: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', textAlign: 'center' },
  categoryRow: { marginTop: 8, marginBottom: 6 },
  categoryBadge: {
    backgroundColor: '#EDE9FF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  categoryText: { fontSize: 13, fontWeight: '600', color: '#6C63FF' },
  specialty: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: { fontSize: 13, marginRight: 4 },
  locationText: { fontSize: 13, color: '#94A3B8' },

  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '500' },

  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 12 },
  aboutText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotPreview: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotPreviewText: { fontSize: 13, color: '#475569', fontWeight: '500' },

  ctaContainer: { paddingHorizontal: 16, paddingBottom: 30, marginTop: 4 },
  bookBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  bookBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});

export default ProviderDetailsScreen;
