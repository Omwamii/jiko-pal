import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCircles } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

export default function InviteUsersSelectMonitorScreen() {
  const router = useRouter();
  const { data: circlesData, isLoading: isLoadingCircles, isError: isCirclesError, refetch } = useCircles();

  const handleSelect = (circleId?: string, circleName?: string) => {
    router.push({
      pathname: '/invite-users/method',
      params: {
        circleId,
        circleName,
      },
    });
  };

  const circles = circlesData?.results || [];

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
            <Text style={styles.headerTitle}>Invite Users to a circle</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoContent}>
            <MaterialCommunityIcons name="shield-account-outline" size={24} color={PRIMARY_COLOR} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Share Access</Text>
              <Text style={styles.infoDescription}>
                Choose which gas circle you want to invite the user to. Users will only see the circles they are invited to.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Circle</Text>

        {/* Circles list */}
        {isLoadingCircles ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={styles.loadingText}>Loading circles…</Text>
          </View>
        ) : isCirclesError ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="alert-circle-outline" size={34} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Couldn’t load circles</Text>
            <Text style={styles.emptySubtitle}>Check your connection and try again.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.85}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : circles.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={34} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No circles found</Text>
            <Text style={styles.emptySubtitle}>Create or join a circle, then invite users.</Text>
          </View>
        ) : (
          circles.map((circle) => (
            <TouchableOpacity key={circle.id} style={styles.monitorCard} onPress={() => handleSelect(circle.id, circle.circle_name)}>
              <View style={[styles.iconBadge, { backgroundColor: '#E0E7FF' }]}>
                <MaterialCommunityIcons name="account-group" size={24} color={PRIMARY_COLOR} />
              </View>
              <View style={styles.monitorDetails}>
                <Text style={styles.monitorTitle}>{circle.circle_name}</Text>
                <Text style={styles.monitorSubtitle}>
                  {circle.member_count} member{circle.member_count === 1 ? '' : 's'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={styles.monitorCard} onPress={() => handleSelect()}>
          <View style={[styles.iconBadge, { backgroundColor: '#E0E7FF' }]}>
            <MaterialCommunityIcons name="earth" size={24} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.monitorDetails}>
            <Text style={styles.monitorTitle}>No particular circle</Text>
            <Text style={styles.monitorSubtitle}>Invite without assigning a circle</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  infoCard: {
    backgroundColor: '#E0E7FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  monitorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  monitorDetails: {
    flex: 1,
  },
  loadingWrap: { paddingVertical: 18, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#6B7280', fontSize: 12, fontWeight: '600' },
  emptyState: { paddingVertical: 18, alignItems: 'center', paddingHorizontal: 10 },
  emptyTitle: { marginTop: 10, color: '#11181C', fontSize: 14, fontWeight: '700' },
  emptySubtitle: { marginTop: 4, color: '#6B7280', fontSize: 12, textAlign: 'center' },
  retryBtn: { marginTop: 12, backgroundColor: PRIMARY_COLOR, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  retryBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  monitorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  monitorSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
});
