import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#3629B7';

export default function InviteUsersSelectMonitorScreen() {
  const router = useRouter();

  const handleSelect = (monitorId: string) => {
    router.push({
      pathname: '/invite-users/method',
      params: { monitorId }
    });
  };

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
            <Text style={styles.headerTitle}>Invite Users</Text>
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
                Choose which gas cylinder you want to share. Users will only see the monitors you give them access to.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Monitor</Text>

        {/* Monitor List */}
        <TouchableOpacity style={styles.monitorCard} onPress={() => handleSelect('kitchen')}>
          <View style={[styles.iconBadge, { backgroundColor: '#D1FAE5' }]}>
            <MaterialCommunityIcons name="fire" size={24} color="#10B981" />
          </View>
          <View style={styles.monitorDetails}>
            <Text style={styles.monitorTitle}>Kitchen Gas</Text>
            <Text style={styles.monitorSubtitle}>Home - Kitchen</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: '65%', backgroundColor: '#10B981' }]} />
              </View>
              <Text style={styles.progressText}>65%</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.monitorCard} onPress={() => handleSelect('office')}>
          <View style={[styles.iconBadge, { backgroundColor: '#D1FAE5' }]}>
            <MaterialCommunityIcons name="fire" size={24} color="#10B981" />
          </View>
          <View style={styles.monitorDetails}>
            <Text style={styles.monitorTitle}>Office Gas</Text>
            <Text style={styles.monitorSubtitle}>Office - Main Floor</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: '85%', backgroundColor: '#10B981' }]} />
              </View>
              <Text style={styles.progressText}>85%</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.monitorCard} onPress={() => handleSelect('backup')}>
          <View style={[styles.iconBadge, { backgroundColor: '#FEF3C7' }]}>
            <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
          </View>
          <View style={styles.monitorDetails}>
            <Text style={styles.monitorTitle}>Backup Cylinder</Text>
            <Text style={styles.monitorSubtitle}>Home - Garage</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: '35%', backgroundColor: '#F59E0B' }]} />
              </View>
              <Text style={styles.progressText}>35%</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.monitorCard} onPress={() => handleSelect('global')}>
          <View style={[styles.iconBadge, { backgroundColor: '#E0E7FF' }]}>
            <MaterialCommunityIcons name="earth" size={24} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.monitorDetails}>
            <Text style={styles.monitorTitle}>No particular circle</Text>
            <Text style={styles.monitorSubtitle}>Invite without assigning a monitor</Text>
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
