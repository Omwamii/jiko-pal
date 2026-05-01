import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useCatalogueByVendor } from '@/hooks/queries';
import { useDevices } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

export default function RefillSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vendorId?: string; vendorName?: string }>();
  const vendorId = params.vendorId || '';
  const vendorName = useMemo(() => params.vendorName || 'QuickGas Ltd', [params.vendorName]);
  
  const { data: catalogue = [], isLoading: catalogueLoading } = useCatalogueByVendor(vendorId);
  const { data: devicesData, isLoading: devicesLoading } = useDevices();

  const [selectedType, setSelectedType] = useState<'catalogue' | 'device' | null>(null);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleContinue = () => {
    if (!selectedType || !selectedItem) return;
    
    const navParams: Record<string, string> = {
      vendorId: params.vendorId || '',
      vendorName,
    };
    
    if (selectedType === 'catalogue') {
      navParams.catalogueId = selectedItem;
    } else {
      const device = devicesData?.results?.find(d => d.id === selectedItem);
      if (device) {
        navParams.cylinderName = device.device_id;
        navParams.cylinderLevel = device.current_level.toString();
      }
    }
    
    router.push({
      pathname: '/(tabs)/vendors/refill-date',
      params: navParams,
    } as Href);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Request Refill</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Which cylinder needs refilling?</Text>
        
        <TouchableOpacity
          style={[styles.optionCard, selectedType === 'catalogue' && styles.optionCardActive]}
          onPress={() => {
            setSelectedType('catalogue');
            setSelectedItem('');
          }}
        >
          <View style={[styles.optionIconWrap, { backgroundColor: '#DBEAFE' }]}>
            <MaterialCommunityIcons name="gas-cylinder" size={18} color="#3B82F6" />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.optionTitle}>Select from Vendor Catalogue</Text>
            <Text style={styles.optionSub}>Choose from available cylinders in stock</Text>
          </View>
          {selectedType === 'catalogue' && (
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, selectedType === 'device' && styles.optionCardActive]}
          onPress={() => {
            setSelectedType('device');
            setSelectedItem('');
          }}
        >
          <View style={[styles.optionIconWrap, { backgroundColor: '#D1FAE5' }]}>
            <MaterialCommunityIcons name="fire" size={18} color="#10B981" />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.optionTitle}>Select from My Devices</Text>
            <Text style={styles.optionSub}>Choose from your registered gas cylinders</Text>
          </View>
          {selectedType === 'device' && (
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
          )}
        </TouchableOpacity>

        {selectedType === 'catalogue' && (
          <>
            <Text style={styles.subTitle}>Available Cylinders</Text>
            {catalogueLoading ? (
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            ) : catalogue.length === 0 ? (
              <Text style={styles.emptyText}>No cylinders available in catalogue</Text>
            ) : (
              catalogue.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, selectedItem === item.id && styles.itemCardActive]}
                  onPress={() => setSelectedItem(item.id)}
                >
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.cylinder_company} {item.size}</Text>
                    <Text style={styles.itemPrice}>KES {item.price}</Text>
                    {!item.is_available && (
                      <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>Out of Stock</Text>
                      </View>
                    )}
                  </View>
                  {selectedItem === item.id && (
                    <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {selectedType === 'device' && (
          <>
            <Text style={styles.subTitle}>Your Devices</Text>
            {devicesLoading ? (
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            ) : !devicesData?.results || devicesData.results.length === 0 ? (
              <Text style={styles.emptyText}>No devices registered</Text>
            ) : (
              devicesData.results.map((device) => (
                <TouchableOpacity
                  key={device.id}
                  style={[styles.itemCard, selectedItem === device.id && styles.itemCardActive]}
                  onPress={() => setSelectedItem(device.id)}
                >
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{device.device_id}</Text>
                    <Text style={styles.itemSub}>Level: {device.current_level}%</Text>
                  </View>
                  {selectedItem === device.id && (
                    <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        <TouchableOpacity
          style={[styles.continueBtn, (!selectedType || !selectedItem) && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!selectedType || !selectedItem}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingTop: 8, paddingBottom: 12 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 10 },
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
  scrollContent: { padding: 14, paddingBottom: 30 },
  sectionTitle: { color: '#11181C', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  subTitle: { color: '#11181C', fontSize: 12, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  optionCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  optionCardActive: {
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  optionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionBody: { flex: 1 },
  optionTitle: { color: '#11181C', fontSize: 13, fontWeight: '700' },
  optionSub: { color: '#6B7280', fontSize: 10, marginTop: 1 },
  itemCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  itemCardActive: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  itemContent: { flex: 1 },
  itemTitle: { color: '#11181C', fontSize: 14, fontWeight: '600' },
  itemPrice: { color: '#2563EB', fontSize: 12, fontWeight: '600', marginTop: 2 },
  itemSub: { color: '#6B7280', fontSize: 10, marginTop: 2 },
  outOfStockBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  outOfStockText: { color: '#EF4444', fontSize: 10, fontWeight: '500' },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    paddingVertical: 20,
  },
  continueBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
