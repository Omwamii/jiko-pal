import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

const PRIMARY_COLOR = '#3629B7';

const stats = [
  { label: 'Revenue', value: 'KSh 45,800', hint: '+ 3 from yesterday' },
  { label: 'Orders', value: '12', hint: '+ 3 from yesterday' },
  { label: 'Avg. Time', value: '32 min', hint: 'Delivery time' },
  { label: '4.3 Rating', value: '4.8', hint: 'From 389 reviews', icon: 'star' as const },
];

const quickActions = [
  { label: 'Orders', icon: 'clipboard-text-outline' as const },
  { label: 'Subscribers', icon: 'account-group-outline' as const },
  { label: 'Analytics', icon: 'chart-line' as const },
];

export default function VendorDashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <Text style={styles.welcomeText}>Welcome back, vendor!</Text>
          <View style={styles.headerRow}>
            <Text style={styles.brandTitle}>QuickGas Distributors</Text>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.statsGrid}>
            {stats.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <View style={styles.statLabelRow}>
                  {item.icon ? <MaterialCommunityIcons name={item.icon} size={12} color="#F59E0B" /> : null}
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statHint}>{item.hint}</Text>
              </View>
            ))}
          </View>

          <View style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <MaterialCommunityIcons name="tag-outline" size={12} color="#E19B0B" />
            </View>
            <Text style={styles.offerTitle}>2 Pending Offers</Text>
            <Text style={styles.offerSubtitle}>You have new delivery requests waiting for your response</Text>
            <TouchableOpacity
              style={styles.offerButton}
              activeOpacity={0.8}
              onPress={() => router.push('/vendor-orders' as Href)}
            >
              <Text style={styles.offerButtonText}>View Orders</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickActionCard}
                activeOpacity={0.8}
                onPress={() => {
                  if (action.label === 'Orders') {
                    router.push('/vendor-orders' as Href);
                    return;
                  }

                  if (action.label === 'Subscribers') {
                    router.push('/vendor-subscribers' as Href);
                    return;
                  }

                  if (action.label === 'Analytics') {
                    router.push('/vendor-analytics' as Href);
                  }
                }}
              >
                <View style={styles.quickIcon}>
                  <MaterialCommunityIcons name={action.icon} size={18} color="#3629B7" />
                </View>
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/vendor-orders' as Href)}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <View style={[styles.filterPill, styles.filterPillActive]}>
              <Text style={styles.filterTextActive}>Active (2)</Text>
            </View>
            <View style={styles.filterPill}>
              <Text style={styles.filterText}>Pending (5)</Text>
            </View>
            <View style={styles.filterPill}>
              <Text style={styles.filterText}>Completed (2)</Text>
            </View>
          </View>

          <View style={styles.orderCard}>
            <View style={styles.orderTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>SP</Text>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.customerName}>Sarah Anderson</Text>
                <View style={styles.distanceRow}>
                  <MaterialCommunityIcons name="map-marker-outline" size={12} color="#9CA3AF" />
                  <Text style={styles.distanceText}>2.3 Km Away</Text>
                </View>
              </View>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>8%</Text>
          </View>
        </ScrollView>

        <VendorBottomNav active="home" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
  },
  safeHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  welcomeText: {
    color: '#DAD7FF',
    fontSize: 10,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  sheet: {
    flex: 1,
    backgroundColor: '#F5F6FB',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    width: '48.7%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statLabel: {
    color: '#78708E',
    fontSize: 11,
    fontWeight: '500',
  },
  statValue: {
    color: '#101012',
    fontSize: 34,
    fontWeight: '700',
    marginTop: 5,
  },
  statHint: {
    color: '#2EA75C',
    fontSize: 9,
    marginTop: 3,
  },
  offerCard: {
    marginTop: 14,
    backgroundColor: '#F4E6D2',
    borderWidth: 1,
    borderColor: '#EAD4B7',
    borderRadius: 12,
    padding: 12,
  },
  offerIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E9C89A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerTitle: {
    marginTop: 6,
    color: '#99620E',
    fontSize: 11,
    fontWeight: '600',
  },
  offerSubtitle: {
    marginTop: 5,
    color: '#C58720',
    fontSize: 9,
  },
  offerButton: {
    marginTop: 9,
    alignSelf: 'flex-start',
    backgroundColor: '#E8C48F',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  offerButtonText: {
    color: '#94610E',
    fontSize: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 16,
    color: '#151521',
    fontSize: 27,
    fontWeight: '700',
  },
  quickRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '31.7%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  quickIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    color: '#2A2A32',
    fontSize: 10,
    fontWeight: '500',
  },
  sectionHeader: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllText: {
    color: PRIMARY_COLOR,
    fontSize: 11,
    fontWeight: '600',
  },
  filterRow: {
    marginTop: 9,
    flexDirection: 'row',
    gap: 5,
  },
  filterPill: {
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E4E2EF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  filterText: {
    color: '#8A849A',
    fontSize: 9,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  orderCard: {
    marginTop: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
    marginBottom: 20,
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  orderInfo: {
    flex: 1,
    marginLeft: 8,
  },
  customerName: {
    color: '#11131A',
    fontSize: 14,
    fontWeight: '600',
  },
  distanceRow: {
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distanceText: {
    color: '#8E8FA1',
    fontSize: 9,
  },
  pendingBadge: {
    backgroundColor: '#F4E4C3',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingText: {
    color: '#D08B17',
    fontSize: 9,
    fontWeight: '600',
  },
  progressTrack: {
    marginTop: 11,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    width: '8%',
    height: '100%',
    backgroundColor: '#EF4444',
  },
  progressText: {
    marginTop: 3,
    color: '#71717F',
    fontSize: 9,
    textAlign: 'right',
  },
});
