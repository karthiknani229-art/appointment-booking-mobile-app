import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../context/AppContext';

const DAYS_AHEAD = 14;

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const formatDateKey = (date) => date.toISOString().split('T')[0];

const BookingScreen = ({ route, navigation }) => {
  const { provider } = route.params;
  const { bookAppointment, isSlotBooked } = useApp();

  const dates = useMemo(() => generateDates(), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const handleBook = async () => {
    if (!selectedSlot) {
      Alert.alert('Select a Time Slot', 'Please choose an available time slot to continue.');
      return;
    }
    setLoading(true);
    const result = await bookAppointment({
      provider,
      slot: selectedSlot,
      date: formatDateKey(selectedDate),
    });
    setLoading(false);
    if (result.success) {
      Alert.alert(
        '✅ Appointment Booked!',
        `Your appointment with ${provider.name} is confirmed for ${selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })} at ${selectedSlot}.`,
        [
          {
            text: 'View Appointments',
            onPress: () => navigation.navigate("Tabs", {screen: "Appointments",}),
          },
          {
            text: 'Go Home',
            onPress: () => navigation.navigate("Tabs", {  screen: "Home",}),
          },
        ]
      );
    } else {
      Alert.alert('Booking Failed', result.message || 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Provider Summary */}
        <View style={styles.providerSummary}>
          <Image source={{ uri: provider.image }} style={styles.providerAvatar} />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.providerCategory}>{provider.category}</Text>
            <Text style={styles.providerFee}>Consultation: {provider.fee}</Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
            {dates.map((date) => {
              const isSelected = formatDateKey(date) === formatDateKey(selectedDate);
              const isToday = formatDateKey(date) === formatDateKey(new Date());
              return (
                <TouchableOpacity
                  key={formatDateKey(date)}
                  style={[styles.dateCard, isSelected && styles.dateCardActive]}
                  onPress={() => { setSelectedDate(date); setSelectedSlot(null); }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dateDayName, isSelected && styles.dateTextActive]}>
                    {isToday ? 'Today' : dayNames[date.getDay()]}
                  </Text>
                  <Text style={[styles.dateNum, isSelected && styles.dateTextActive]}>
                    {date.getDate()}
                  </Text>
                  <Text style={[styles.dateMonth, isSelected && styles.dateTextActive]}>
                    {monthNames[date.getMonth()]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Slot Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>

          <Text style={styles.slotPeriodLabel}>Morning</Text>
          <View style={styles.slotsGrid}>
            {provider.availableSlots
              .filter((s) => s.includes('AM'))
              .map((slot) => {
                const booked = isSlotBooked(provider.id, slot, formatDateKey(selectedDate));
                const isSelected = selectedSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotBtn,
                      isSelected && styles.slotBtnActive,
                      booked && styles.slotBtnBooked,
                    ]}
                    onPress={() => !booked && setSelectedSlot(slot)}
                    disabled={booked}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        isSelected && styles.slotTextActive,
                        booked && styles.slotTextBooked,
                      ]}
                    >
                      {slot}
                    </Text>
                    {booked && <Text style={styles.bookedLabel}>Booked</Text>}
                  </TouchableOpacity>
                );
              })}
          </View>

          <Text style={styles.slotPeriodLabel}>Afternoon & Evening</Text>
          <View style={styles.slotsGrid}>
            {provider.availableSlots
              .filter((s) => s.includes('PM'))
              .map((slot) => {
                const booked = isSlotBooked(provider.id, slot, formatDateKey(selectedDate));
                const isSelected = selectedSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotBtn,
                      isSelected && styles.slotBtnActive,
                      booked && styles.slotBtnBooked,
                    ]}
                    onPress={() => !booked && setSelectedSlot(slot)}
                    disabled={booked}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        isSelected && styles.slotTextActive,
                        booked && styles.slotTextBooked,
                      ]}
                    >
                      {slot}
                    </Text>
                    {booked && <Text style={styles.bookedLabel}>Booked</Text>}
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        {/* Booking Summary */}
        {selectedSlot && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Doctor</Text>
              <Text style={styles.summaryValue}>{provider.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>
                {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{selectedSlot}</Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Fee</Text>
              <Text style={[styles.summaryValue, styles.summaryFee]}>{provider.fee}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookBtn, (!selectedSlot || loading) && styles.bookBtnDisabled]}
          onPress={handleBook}
          disabled={!selectedSlot || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.bookBtnText}>
              {selectedSlot ? `Confirm Booking · ${provider.fee}` : 'Select a Time Slot'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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

  providerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  providerAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E8E6FF' },
  providerInfo: { marginLeft: 14 },
  providerName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  providerCategory: { fontSize: 13, color: '#6C63FF', fontWeight: '600', marginTop: 2 },
  providerFee: { fontSize: 12, color: '#64748B', marginTop: 4 },

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
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 14 },
  dateList: { paddingRight: 4, gap: 10 },
  dateCard: {
    alignItems: 'center',
    backgroundColor: '#F8F7FF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minWidth: 60,
  },
  dateCardActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  dateDayName: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginBottom: 4 },
  dateNum: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', lineHeight: 24 },
  dateMonth: { fontSize: 10, fontWeight: '600', color: '#94A3B8', marginTop: 2 },
  dateTextActive: { color: '#FFFFFF' },

  slotPeriodLabel: { fontSize: 13, fontWeight: '700', color: '#94A3B8', marginBottom: 10, marginTop: 4 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  slotBtn: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F7FF',
    alignItems: 'center',
  },
  slotBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  slotBtnBooked: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', opacity: 0.5 },
  slotText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  slotTextActive: { color: '#FFFFFF' },
  slotTextBooked: { color: '#CBD5E1', textDecorationLine: 'line-through' },
  bookedLabel: { fontSize: 9, color: '#EF4444', marginTop: 2, fontWeight: '600' },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#EDE9FF',
  },
  summaryTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 12 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  summaryValue: { fontSize: 13, color: '#1A1A2E', fontWeight: '600' },
  summaryFee: { color: '#6C63FF', fontWeight: '700' },

  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#F8F7FF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
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
  bookBtnDisabled: { backgroundColor: '#C7C4FF', elevation: 0, shadowOpacity: 0 },
  bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});

export default BookingScreen;
