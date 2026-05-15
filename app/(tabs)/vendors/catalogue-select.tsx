import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCatalogueByVendor } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

export default function CatalogueSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    vendorId?: string; 
    vendorName?: string;
    cylinderName?: string;
    cylinderLevel?: string;
  }>();
  
  const vendorId = params.vendorId || '';
  const vendorName = params.vendorName || 'Vendor';
  const cylinderName = params.cylinderName;
  const cylinderLevel = params.cylinderLevel;
  
  const { data: catalogue = [], isLoading } = useCatalogueByVendor(vendorId);
  const [selectedCatalogueId, setSelectedCatalogueId] = useState<string>('');

  const handleSelectCylinder = () => {
    if (!selectedCatalogueId) return;
    
    router.push({
      pathname: '/(tabs)/vendors/refill-date',
      params: {
        vendorId,
        vendorName,
        catalogueId: selectedCatalogueId,
        cylinderName: cylinderName || '',
        cylinderLevel: cylinderLevel || '',
      },
    } as Href);
  };

  const handleSkipAndChat = () => {
    router.push({
      pathname: '/(tabs)/vendors/refill-date',
      params: {
        vendorId,
        vendorName,
        cylinderName: cylinderName || '',
        cylinderLevel: cylinderLevel || '',
      },
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
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Select Cylinder</Text>
              <Text style={styles.headerSubtitle}>{vendorName}</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Available Cylinders</Text>
        <Text style={styles.sectionSubtitle}>
          Select a cylinder from the catalogue, or continue without selecting and share details via chat after placing your request.
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
        ) : catalogue.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="gas-cylinder" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No cylinders in catalogue</Text>
            <Text style={styles.emptySubtext}>This vendor has not added any cylinders yet</Text>
          </View>
        ) : (
          catalogue.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.cylinderCard, selectedCatalogueId === item.id && styles.cylinderCardActive]}
              onPress={() => setSelectedCatalogueId(item.id)}
              disabled={!item.is_available}
            >
              {item.picture_url && (
                <Image source={{ uri: item.picture_url }} style={styles.cylinderImage} />
              )}
              <View style={styles.cylinderContent}>
                <Text style={styles.cylinderTitle}>{item.cylinder_company} {item.size}kg</Text>
                <Text style={styles.cylinderPrice}>KES {item.price}</Text>
                {!item.is_available && (
                  <View style={styles.outOfStockBadge}>
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                  </View>
                )}
              </View>
              {selectedCatalogueId === item.id && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
              )}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={[styles.selectButton, !selectedCatalogueId && styles.selectButtonDisabled]}
          onPress={handleSelectCylinder}
          disabled={!selectedCatalogueId}
        >
          <Text style={styles.selectButtonText}>Continue with Selected Cylinder</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.chatButton} onPress={handleSkipAndChat}>
          <MaterialCommunityIcons name="chat-outline" size={20} color={PRIMARY_COLOR} />
          <View style={styles.chatButtonTextWrap}>
            <Text style={styles.chatButtonText}>Continue without selecting an item</Text>
            <Text style={styles.chatButtonNote}>Note: Chat the vendor to provide order details.</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingTop: 8, paddingBottom: 16 },
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
  headerTextWrap: { flex: 1 },
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 30 },
  sectionTitle: { color: '#11181C', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sectionSubtitle: { color: '#6B7280', fontSize: 14, marginBottom: 16 },
  loader: { marginTop: 40 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#374151', fontSize: 16, fontWeight: '600', marginTop: 12 },
  emptySubtext: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  cylinderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cylinderCardActive: { borderColor: PRIMARY_COLOR },
  cylinderImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  cylinderContent: { flex: 1 },
  cylinderTitle: { color: '#11181C', fontSize: 16, fontWeight: '600' },
  cylinderPrice: { color: '#2563EB', fontSize: 14, fontWeight: '600', marginTop: 2 },
  outOfStockBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  outOfStockText: { color: '#EF4444', fontSize: 12, fontWeight: '500' },
  selectButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  selectButtonDisabled: { backgroundColor: '#D1D5DB' },
  selectButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#D1D5DB' },
  dividerText: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginHorizontal: 10 },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    gap: 8,
  },
  chatButtonTextWrap: { alignItems: 'center' },
  chatButtonText: { color: PRIMARY_COLOR, fontSize: 16, fontWeight: '600' },
  chatButtonNote: { color: '#6B7280', fontSize: 11, marginTop: 2, fontWeight: '500' },
});
