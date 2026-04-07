import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';
import { type Href, useRouter } from 'expo-router';

const PRIMARY_COLOR = '#3629B7';
const { width } = Dimensions.get('window');

// SVG Circle properties
const size = 160;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;
const progress = 0.65;
const strokeDashoffset = circumference - (circumference * progress);

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Blue Header Section */}
        <View style={styles.headerBackground}>
          <SafeAreaView>
            <View style={styles.headerTop}>
              <View style={styles.profileSection}>
                <View style={[styles.profileImage, { backgroundColor: '#F472B6', justifyContent: 'center', alignItems: 'center' }]}>
                  <MaterialCommunityIcons name="account" size={24} color="#FFF" />
                </View>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greetingText}>Good Morning</Text>
                  <Text style={styles.nameText}>John Doe</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('./notifications')}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Main Content Area (Overlapping the header) */}
        <View style={styles.mainContent}>
          
          {/* Main Cylinder Card */}
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cylinderLabel}>Main Cylinder</Text>
                <Text style={styles.cylinderName}>Kitchen Gas</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Good</Text>
              </View>
            </View>

            {/* SVG Circular Progress */}
            <View style={styles.progressContainer}>
              <Svg width={size} height={size}>
                {/* Background Track */}
                <Circle
                  stroke="#E5E7EB"
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                />
                {/* Progress Track */}
                <Circle
                  stroke="#10B981"
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={`${strokeDashoffset}`}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </Svg>
              <View style={styles.progressCenter}>
                <MaterialCommunityIcons name="fire" size={36} color="#F59E0B" />
                <Text style={styles.percentageText}>65%</Text>
                <Text style={styles.remainingText}>Remaining</Text>
              </View>
            </View>

            {/* Metrics Row */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Used Today</Text>
                <Text style={styles.metricValue}>2.3 kg</Text>
              </View>
              <View style={styles.metricItemRight}>
                <Text style={styles.metricLabel}>Est. Days Left</Text>
                <Text style={styles.metricValue}>12 days</Text>
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.refillButton}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/vendors',
                  params: {
                    preselectedCylinderName: 'Kitchen Gas',
                    preselectedCylinderLevel: '65',
                  },
                } as Href)
              }
            >
              <Text style={styles.refillButtonText}>Request Refill</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity style={styles.quickActionBox} onPress={() => router.push('/add-monitor')}>
                <View style={[styles.iconCircle, { backgroundColor: '#E0E7FF' }]}>
                  <MaterialCommunityIcons name="plus" size={24} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.quickActionText}>Add monitor</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionBox} onPress={() => router.push('/invite-users')}>
                <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="account-plus-outline" size={22} color="#10B981" />
                </View>
                <Text style={styles.quickActionText}>Invite Users</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionBox} onPress={() => router.push('/my-circle')}>
                <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="account-group-outline" size={22} color="#F59E0B" />
                </View>
                <Text style={styles.quickActionText}>My Circle</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => router.push('./recent-activity')}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityCard}>
              {[1, 2, 3].map((item, index) => (
                <View key={index}>
                  <View style={styles.activityItem}>
                    <View style={styles.activityIconContainer}>
                      <MaterialCommunityIcons name="check-circle-outline" size={20} color="#10B981" />
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityTitle}>Refill Completed</Text>
                      <Text style={styles.activitySubtitle}>Kitchen Gas</Text>
                    </View>
                    <View style={styles.activityRight}>
                      <Text style={styles.activityAmount}>Ksh. 1500</Text>
                      <Text style={styles.activityDate}>Jan 15</Text>
                    </View>
                  </View>
                  {index < 2 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Other Monitor */}
          <View style={[styles.sectionContainer, styles.lastSection]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Other Monitor</Text>
              <TouchableOpacity onPress={() => router.push('/monitors' as Href)}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.otherMonitorItem}
              onPress={() =>
                router.push({
                  pathname: '/my-circle/cylinder',
                  params: { name: 'Office Gas', location: 'Office - Main Floor', fill: '85' },
                } as Href)
              }
            >
              <View style={[styles.monitorIconBadge, { backgroundColor: '#D1FAE5' }]}> 
                <MaterialCommunityIcons name="water" size={16} color="#10B981" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Office Gas</Text>
                <Text style={styles.activitySubtitle}>85% remaining</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.otherMonitorItem}
              onPress={() =>
                router.push({
                  pathname: '/my-circle/cylinder',
                  params: { name: 'Back Up Cylinder', location: 'Home - Garage', fill: '35' },
                } as Href)
              }
            >
              <View style={[styles.monitorIconBadge, { backgroundColor: '#FEF3C7' }]}> 
                <MaterialCommunityIcons name="fire" size={16} color="#F59E0B" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Back Up Cylinder</Text>
                <Text style={styles.activitySubtitle}>35% remaining</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBackground: {
    backgroundColor: PRIMARY_COLOR,
    height: 240,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 50, // accommodate status bar roughly if SafeAreaView fails
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingContainer: {
    marginLeft: 12,
  },
  greetingText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 4,
    backgroundColor: '#EF4444',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  mainContent: {
    paddingHorizontal: 24,
    marginTop: -100, // Brings the content up over the header curve
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cylinderLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  cylinderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
    height: size,
  },
  progressCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
  },
  remainingText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'flex-start',
  },
  metricItemRight: {
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  refillButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refillButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContainer: {
    marginTop: 32,
  },
  lastSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  viewAllText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 44, // Align with text
  },
  otherMonitorItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  monitorIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
});
