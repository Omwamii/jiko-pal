import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';
import { useVendorSubscribers } from '@/hooks/vendor';
import { useDevices } from '@/hooks/queries';

type FilterKey = 'all' | 'active' | 'low' | 'critical';

export default function VendorSubscribersScreen() {
  const router = useRouter();
  const { subscribers, isLoading, fetchSubscribers } = useVendorSubscribers();
  const { data: devicesData } = useDevices();
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

const subscribersWithStatus = useMemo(() => {
    if (!subscribers || !devicesData) return [];
    
    return subscribers.map(sub => {
      const clientId = sub.client?.id || '';
      const clientDevices = devicesData.results.filter(d => d.owner_id === clientId);
      const avgLevel = clientDevices.length > 0 
        ? clientDevices.reduce((sum, d) => sum + (d.current_level || 0), 0) / clientDevices.length
        : 0;
      
      let status: 'active' | 'low' | 'critical' = 'active';
      if (avgLevel < 20) status = 'critical';
      else if (avgLevel < 40) status = 'low';
      
      return {
        id: sub.id,
        clientId,
        name: sub.client?.full_name || 'Unknown',
        email: (sub.client as any).email || (sub.client as any)?.phone_number || '',
        status,
        subscribedAt: sub.subscribed_at || '',
        deviceCount: clientDevices.length,
      };
    });
  }, [subscribers, devicesData]);

  const visible = useMemo(() => {
    if (filter === 'all') return subscribersWithStatus;
    return subscribersWithStatus.filter((s) => s.status === filter);
  }, [filter, subscribersWithStatus]);

  const stats = useMemo(() => ({
    total: subscribersWithStatus.length,
    activeCount: subscribersWithStatus.filter(s => s.status === 'active').length,
    lowCount: subscribersWithStatus.filter(s => s.status === 'low').length,
    criticalCount: subscribersWithStatus.filter(s => s.status === 'critical').length,
  }), [subscribersWithStatus]);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    if (status === 'critical') return { bg: '#FFE1E6', color: '#E44A69', text: 'Critical' };
    if (status === 'low') return { bg: '#FFF2D8', color: '#D48C18', text: 'Low' };
    return { bg: '#CFF2E4', color: '#18A875', text: 'Active' };
  };

  const filters: Array<{ key: FilterKey; label: string }> = [
    { key: 'all', label: 'All Subscribers' },
    { key: 'active', label: 'Active' },
    { key: 'low', label: 'Low Gas' },
    { key: 'critical', label: 'Critical' },
  ];

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
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#3629B7" style={styles.loader} />
        ) : (
          <>
            <View style={styles.statGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#E8E7FF' }]}>
                  <MaterialCommunityIcons name="account-group" size={13} color="#3629B7" />
                </View>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{stats.total}</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#D8F6EA' }]}>
                  <MaterialCommunityIcons name="check-circle-outline" size={13} color="#18A875" />
                </View>
                <Text style={styles.statLabel}>Active</Text>
                <Text style={styles.statValue}>{stats.activeCount}</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#FFF2D8' }]}>
                  <MaterialCommunityIcons name="gas-cylinder" size={13} color="#D48C18" />
                </View>
                <Text style={styles.statLabel}>Low</Text>
                <Text style={styles.statValue}>{stats.lowCount}</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#FFE1E6' }]}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={13} color="#E44A69" />
                </View>
                <Text style={styles.statLabel}>Critical</Text>
                <Text style={styles.statValue}>{stats.criticalCount}</Text>
              </View>
            </View>

            <View style={styles.filterRow}>
              {filters.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.filterPill, item.key === filter && styles.filterPillActive]}
                  activeOpacity={0.85}
                  onPress={() => setFilter(item.key)}
                >
                  <Text style={[styles.filterText, item.key === filter && styles.filterTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {visible.map((subscriber) => {
                const badge = getStatusBadge(subscriber.status);
                return (
                  <TouchableOpacity
                    key={subscriber.id}
                    style={styles.subscriberCard}
                    activeOpacity={0.85}
                    onPress={() => router.push((`/vendor-customer-detail?name=${encodeURIComponent(subscriber.name)}&email=${encodeURIComponent(subscriber.email)}`) as Href)}
                  >
                    <View style={styles.subscriberTop}>
                      <View style={styles.avatar}><Text style={styles.avatarText}>{getInitials(subscriber.name)}</Text></View>
                      <View style={styles.subMeta}>
                        <Text style={styles.name}>{subscriber.name}</Text>
                        <Text style={styles.email}>{subscriber.email}</Text>
                      </View>
                      <MaterialCommunityIcons name="cog-outline" size={16} color="#7E7F91" />
                    </View>
                    <View style={styles.subBottom}>
                      <Text style={styles.permission}>{subscriber.deviceCount} device(s)</Text>
                      <View style={[styles.activeBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.activeBadgeText, { color: badge.color }]}>{badge.text}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}
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
  backButton: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)', marginRight: 8 },
  headerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  headerSub: { color: '#CFCBF9', fontSize: 9, marginTop: 1 },
  notificationButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sheet: { flex: 1, backgroundColor: '#F3F3F7', paddingHorizontal: 14, paddingTop: 10 },
  loader: { marginTop: 40 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#ECECF3', padding: 10 },
  statIcon: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statLabel: { marginTop: 5, color: '#8E8FA1', fontSize: 8 },
  statValue: { marginTop: 3, color: '#151620', fontSize: 30, fontWeight: '700' },
  filterRow: { marginTop: 10, flexDirection: 'row', gap: 5 },
  filterPill: { flex: 1, height: 25, borderRadius: 6, borderWidth: 1, borderColor: '#D8D9E4', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  filterPillActive: { backgroundColor: '#6E63D9', borderColor: '#6E63D9' },
  filterText: { color: '#7A7B8D', fontSize: 8, fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },
  scrollContent: { paddingTop: 8, paddingBottom: 16 },
  subscriberCard: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#ECECF3', padding: 10, marginBottom: 8 },
  subscriberTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#4338CA', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  subMeta: { flex: 1, marginLeft: 8 },
  name: { color: '#161721', fontSize: 13, fontWeight: '700' },
  email: { color: '#8D8EA0', fontSize: 9, marginTop: 1 },
  subBottom: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  permission: { color: '#9C9DAD', fontSize: 8 },
  activeBadge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  activeBadgeText: { fontSize: 8, fontWeight: '600' },
});