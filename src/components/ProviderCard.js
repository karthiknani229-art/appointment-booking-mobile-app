import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ProviderCard = ({ provider, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: provider.image }} style={styles.avatar} />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>{provider.rating}</Text>
          </View>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{provider.category}</Text>
        </View>
        <Text style={styles.specialty} numberOfLines={1}>{provider.specialty}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.location}>📍 {provider.location}</Text>
          <Text style={styles.fee}>{provider.fee}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8E6FF',
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingStar: {
    fontSize: 11,
    color: '#F59E0B',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6C63FF',
  },
  specialty: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  location: {
    fontSize: 11,
    color: '#94A3B8',
    flex: 1,
  },
  fee: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C63FF',
  },
});

export default ProviderCard;
