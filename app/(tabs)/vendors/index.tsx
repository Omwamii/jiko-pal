import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';

const PRIMARY_COLOR = '#3629B7';

const VENDORS = [
  { id: 'quickgas', name: 'QuickGas Ltd', rating: 4.8, reviews: 234, active: 3.2, price: 1500, subscribed: true },
  { id: 'gaspro', name: 'GasPro Services', rating: 4.3, reviews: 199, active: 2.8, price: 1500, subscribed: true },
  { id: 'citygas', name: 'CityGas Express', rating: 4.3, reviews: 212, active: 2.9, price: 1500, subscribed: false },
  { id: 'citygas-plus', name: 'CityGas Express', rating: 4.3, reviews: 212, active: 2.9, price: 1500, subscribed: false },
];

export default function VendorsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ preselectedCylinderName?: string; preselectedCylinderLevel?: string }>();
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [query, setQuery] = useState('');
  const preselectedCylinderName = useMemo(
    () => (Array.isArray(params.preselectedCylinderName) ? params.preselectedCylinderName[0] : params.preselectedCylinderName),
    [params.preselectedCylinderName]
  );
  const preselectedCylinderLevel = useMemo(
    () => (Array.isArray(params.preselectedCylinderLevel) ? params.preselectedCylinderLevel[0] : params.preselectedCylinderLevel),
    [params.preselectedCylinderLevel]
  );
  const isRefillVendorSelection = Boolean(preselectedCylinderName);

  const filtered = useMemo(() => {
    return VENDORS.filter((vendor) => {
      const tabOk = activeTab === 'all' ? true : vendor.subscribed;
      const queryOk = vendor.name.toLowerCase().includes(query.toLowerCase().trim());
      return tabOk && queryOk;
    });
  }, [activeTab, query]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gas Vendors</Text>
          </View>

          <View style={styles.tabSwitch}>
            <TouchableOpacity
              style={[styles.switchBtn, activeTab === 'all' && styles.switchBtnActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.switchText, activeTab === 'all' && styles.switchTextActive]}>All Vendors</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchBtn, activeTab === 'mine' && styles.switchBtnActive]}
              onPress={() => setActiveTab('mine')}
            >
              <Text style={[styles.switchText, activeTab === 'mine' && styles.switchTextActive]}>My Vendors</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Vendors....."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />

        {filtered.map((vendor) => (
          <AppCard key={vendor.id} style={styles.vendorCard}>
            <View style={styles.vendorHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{vendor.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.vendorMeta}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <View style={styles.ratingRow}>
                  <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>
                    {vendor.rating} ({vendor.reviews} reviews)
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <MaterialCommunityIcons name="fire-circle" size={12} color="#9CA3AF" />
                  <Text style={styles.metaText}>{vendor.active} km</Text>
                </View>
              </View>
              {vendor.subscribed ? (
                <View style={styles.subscribedBadge}>
                  <Text style={styles.subscribedText}>Subscribed</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.divider} />

            <View style={styles.vendorFooter}>
              <View>
                <Text style={styles.priceLabel}>Price per cylinder</Text>
                <Text style={styles.priceValue}>Ksh. {vendor.price}</Text>
              </View>
              <AppButton
                title={isRefillVendorSelection ? 'Select Vendor' : 'View Details'}
                onPress={() => {
                  if (isRefillVendorSelection) {
                    router.setParams({
                      preselectedCylinderName: undefined,
                      preselectedCylinderLevel: undefined,
                    });
                    router.push({
                      pathname: '/(tabs)/vendors/refill-date',
                      params: {
                        vendorName: vendor.name,
                        cylinderName: preselectedCylinderName,
                        cylinderLevel: preselectedCylinderLevel || '65',
                      },
                    } as Href);
                    return;
                  }

                  router.push({
                    pathname: '/(tabs)/vendors/detail',
                    params: { vendorId: vendor.id, vendorName: vendor.name },
                  } as Href);
                }}
                style={styles.detailsBtn}
                textStyle={styles.detailsBtnText}
              />
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingTop: 8, paddingBottom: 14 },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  tabSwitch: {
    marginTop: 16,
    marginHorizontal: 18,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: 2,
  },
  switchBtn: { flex: 1, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  switchBtnActive: { backgroundColor: '#FFFFFF' },
  switchText: { color: '#D1D5DB', fontWeight: '600', fontSize: 16 },
  switchTextActive: { color: PRIMARY_COLOR },
  scrollContent: { padding: 14, paddingBottom: 34 },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#11181C',
    marginBottom: 12,
  },
  vendorCard: { marginBottom: 12, padding: 12, borderRadius: 10 },
  vendorHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  vendorMeta: { flex: 1 },
  vendorName: { color: '#11181C', fontSize: 14, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  ratingText: { marginLeft: 4, color: '#6B7280', fontSize: 9 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  metaText: { marginLeft: 4, color: '#9CA3AF', fontSize: 9 },
  subscribedBadge: { backgroundColor: '#D1FAE5', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  subscribedText: { color: '#10B981', fontSize: 9, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  vendorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: '#9CA3AF', fontSize: 9 },
  priceValue: { color: '#11181C', fontSize: 16, fontWeight: '700', marginTop: 2 },
  detailsBtn: { height: 28, borderRadius: 14, paddingHorizontal: 14 },
  detailsBtnText: { fontSize: 10 },
});
