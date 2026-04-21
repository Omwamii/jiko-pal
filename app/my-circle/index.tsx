import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useCircleList } from '@/hooks/circle';
import { MonitoringCircle } from '@/types';

const PRIMARY_COLOR = '#3629B7';

export default function MyCircleScreen() {
  const router = useRouter();
  const { circles, isLoading, fetchCircles } = useCircleList();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCircles();
  }, [fetchCircles]);

  const filteredCircles = circles.filter((circle: MonitoringCircle) =>
    circle.circle_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Circle</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by Name...."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* New Circle Card */}
        <AppCard style={styles.newCircleCard} onPress={() => router.push('/my-circle/create' as Href)}>
          <View style={[styles.iconBadge, { backgroundColor: '#E0E7FF' }]}>
            <MaterialCommunityIcons name="account-multiple-plus-outline" size={24} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.newCircleText}>New Circle</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </AppCard>

        <Text style={styles.sectionTitle}>Active Monitors</Text>

        {/* Active Monitors List */}
        {isLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
        ) : filteredCircles.length === 0 ? (
          <Text style={styles.emptyText}>No circles yet. Create one to get started!</Text>
        ) : (
          filteredCircles.map((circle: MonitoringCircle) => (
            <AppCard
              key={circle.id}
              style={styles.monitorCard}
              onPress={() =>
                router.push({
                  pathname: '/my-circle/circle',
                  params: { circleId: circle.id, circleName: circle.circle_name, members: String(circle.member_count) },
                } as Href)
              }
            >
              <View style={[styles.iconBadge, { backgroundColor: '#E0E7FF' }]}>
                <MaterialCommunityIcons name="account-group" size={24} color={PRIMARY_COLOR} />
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.monitorTitle}>{circle.circle_name}</Text>
                <Text style={styles.monitorSubtitle}>{circle.member_count} members</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </AppCard>
          ))
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    padding: 24,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  newCircleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  newCircleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  monitorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  monitorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  monitorSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 20,
  },
});
