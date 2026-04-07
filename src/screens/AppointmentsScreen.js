import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AppointmentCard from '../components/AppointmentCard';

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Cancelled' },
];

const AppointmentsScreen = ({ navigation }) => {
  const { upcomingAppointments, pastAppointments, loading, refreshAppointments } = useApp();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  const data = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <Text style={styles.headerSubtitle}>{user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userAvatarCircle}>
          <Text style={styles.userAvatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.phone && <Text style={styles.userPhone}>📱 {user.phone}</Text>}
        </View>
        <View style={styles.apptCountBadge}>
          <Text style={styles.apptCountNum}>{upcomingAppointments.length}</Text>
          <Text style={styles.apptCountLabel}>Upcoming</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {tab.id === 'upcoming' && upcomingAppointments.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{upcomingAppointments.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshAppointments}
            tintColor="#6C63FF"
            colors={['#6C63FF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              {activeTab === 'upcoming' ? '📅' : '📋'}
            </Text>
            <Text style={styles.emptyTitle}>
              {activeTab === 'upcoming'
                ? 'No upcoming appointments'
                : 'No cancelled appointments'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming'
                ? 'Book your first appointment with a doctor'
                : 'All your cancellations will appear here'}
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity
                style={styles.findDoctorBtn}
                onPress={() => navigation.navigate("Tabs", {  screen: "Home",})}
                activeOpacity={0.8}
              >
                <Text style={styles.findDoctorBtnText}>Find a Doctor</Text>
              </TouchableOpacity>
            )}
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
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  logoutText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  userAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  userDetails: { flex: 1, marginLeft: 14 },
  userName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  userEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  userPhone: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  apptCountBadge: {
    alignItems: 'center',
    backgroundColor: '#EDE9FF',
    borderRadius: 12,
    padding: 10,
    minWidth: 54,
  },
  apptCountNum: { fontSize: 20, fontWeight: '800', color: '#6C63FF' },
  apptCountLabel: { fontSize: 10, fontWeight: '600', color: '#6C63FF', marginTop: 1 },

  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: { backgroundColor: '#6C63FF' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#FFFFFF' },
  tabBadge: {
    backgroundColor: '#FF6584',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '800' },

  listContent: { paddingBottom: 30 },
  emptyState: { alignItems: 'center', paddingTop: 50, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20 },
  findDoctorBtn: {
    marginTop: 20,
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  findDoctorBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});

export default AppointmentsScreen;
