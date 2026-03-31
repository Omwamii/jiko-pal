import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

type FilterKey = 'all' | 'active' | 'low' | 'critical';

type Subscriber = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'low' | 'critical';
};

const subscribers: Subscriber[] = [
  { id: 'sub-1', name: 'Sarah Johnson', email: 'Sara.je@mail.com', status: 'active' },
  { id: 'sub-2', name: 'Sarah Johnson', email: 'Sara.je@mail.com', status: 'active' },
  { id: 'sub-3', name: 'Sarah Johnson', email: 'Sara.je@mail.com', status: 'low' },
  { id: 'sub-4', name: 'Sarah Johnson', email: 'Sara.je@mail.com', status: 'critical' },
  { id: 'sub-5', name: 'Sarah Johnson', email: 'Sara.je@mail.com', status: 'active' },
];

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All Subscribers' },
  { key: 'active', label: 'Active' },
  { key: 'low', label: 'Low Gas' },
  { key: 'critical', label: 'Critical' },
];

export default function VendorSubscribersScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('all');

  const visible = useMemo(() => {
    if (filter === 'all') {
      return subscribers;
    }

    return subscribers.filter((subscriber) => subscriber.status === filter);
  }, [filter]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Subscribers</Text>
              <Text style={styles.headerSub}>Customers monitoring gas with you</Text>
            </View>

            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
              <View style={styles.notificationBadge}><Text style={styles.badgeText}>3</Text></View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E8E7FF' }]}>
              <MaterialCommunityIcons name="account-group" size={13} color="#3629B7" />
            </View>
            <Text style={styles.statLabel}>Total Subscribers</Text>
            <Text style={styles.statValue}>42</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#D8F6EA' }]}>
              <MaterialCommunityIcons name="check-circle-outline" size={13} color="#18A875" />
            </View>
            <Text style={styles.statLabel}>Total Subscribers</Text>
            <Text style={styles.statValue}>42</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF2D8' }]}>
              <MaterialCommunityIcons name="gas-cylinder" size={13} color="#D48C18" />
            </View>
            <Text style={styles.statLabel}>Low Cylinders</Text>
            <Text style={styles.statValue}>8</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFE1E6' }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={13} color="#E44A69" />
            </View>
            <Text style={styles.statLabel}>Critical</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {filters.map((item) => {
            const active = item.key === filter;

            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterPill, active && styles.filterPillActive]}
                activeOpacity={0.85}
                onPress={() => setFilter(item.key)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {visible.map((subscriber) => (
            <TouchableOpacity
              key={subscriber.id}
              style={styles.subscriberCard}
              activeOpacity={0.85}
              onPress={() => {
                const name = encodeURIComponent(subscriber.name);
                const email = encodeURIComponent(subscriber.email);
                router.push((`/vendor-customer-detail?name=${name}&email=${email}`) as Href);
              }}
            >
              <View style={styles.subscriberTop}>
                <View style={styles.avatar}><Text style={styles.avatarText}>SJ</Text></View>
                <View style={styles.subMeta}>
                  <Text style={styles.name}>{subscriber.name}</Text>
                  <Text style={styles.email}>{subscriber.email}</Text>
                </View>
                <MaterialCommunityIcons name="cog-outline" size={16} color="#7E7F91" />
              </View>

              <View style={styles.subBottom}>
                <Text style={styles.permission}>Permission: View only</Text>
                <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>Active</Text></View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <VendorBottomNav active="monitors" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3629B7' },
  header: { backgroundColor: '#3629B7' },
  safeHeader: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  headerSub: { color: '#CFCBF9', fontSize: 9, marginTop: 1 },
  notificationButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 4,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F04438',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  sheet: {
    flex: 1,
    backgroundColor: '#F3F3F7',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
  },
  statIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: { marginTop: 5, color: '#8E8FA1', fontSize: 8 },
  statValue: { marginTop: 3, color: '#151620', fontSize: 30, fontWeight: '700' },
  filterRow: { marginTop: 10, flexDirection: 'row', gap: 5 },
  filterPill: {
    flex: 1,
    height: 25,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D8D9E4',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: { backgroundColor: '#6E63D9', borderColor: '#6E63D9' },
  filterText: { color: '#7A7B8D', fontSize: 8, fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },
  scrollContent: { paddingTop: 8, paddingBottom: 16 },
  subscriberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
    marginBottom: 8,
  },
  subscriberTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  subMeta: { flex: 1, marginLeft: 8 },
  name: { color: '#161721', fontSize: 13, fontWeight: '700' },
  email: { color: '#8D8EA0', fontSize: 9, marginTop: 1 },
  subBottom: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  permission: { color: '#9C9DAD', fontSize: 8 },
  activeBadge: { backgroundColor: '#CFF2E4', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  activeBadgeText: { color: '#18A875', fontSize: 8, fontWeight: '600' },
});
