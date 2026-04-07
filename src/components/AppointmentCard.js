import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';

const AppointmentCard = ({ appointment }) => {
  const { cancelAppointment } = useApp();

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${appointment.providerName}?`,
      [
        { text: 'No, Keep It', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await cancelAppointment(appointment.id);
          },
        },
      ]
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isCancelled = appointment.status === 'cancelled';

  return (
    <View style={[styles.card, isCancelled && styles.cardCancelled]}>
      <Image source={{ uri: appointment.providerImage }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.providerName} numberOfLines={1}>
            {appointment.providerName}
          </Text>
          <View style={[styles.statusBadge, isCancelled ? styles.statusCancelled : styles.statusUpcoming]}>
            <Text style={[styles.statusText, isCancelled ? styles.statusTextCancelled : styles.statusTextUpcoming]}>
              {isCancelled ? 'Cancelled' : 'Upcoming'}
            </Text>
          </View>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{appointment.providerCategory}</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>{formatDate(appointment.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🕐</Text>
            <Text style={styles.detailText}>{appointment.slot}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>{appointment.providerLocation}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>💰</Text>
            <Text style={styles.detailText}>{appointment.providerFee}</Text>
          </View>
        </View>

        {!isCancelled && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 7,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  cardCancelled: {
    opacity: 0.6,
    borderLeftColor: '#CBD5E1',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E8E6FF',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusUpcoming: {
    backgroundColor: '#DCFCE7',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextUpcoming: {
    color: '#166534',
  },
  statusTextCancelled: {
    color: '#991B1B',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FF',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 4,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6C63FF',
  },
  detailsGrid: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 12,
    marginRight: 5,
    width: 18,
  },
  detailText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  cancelBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default AppointmentCard;
