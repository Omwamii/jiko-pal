import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';
import { type Href, useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useDevices, useRefillRequests, useUnreadNotificationCount, useCurrentUser, useActivityLogs } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';
const SECONDARY_COLOR = '#14B27A';
const { width } = Dimensions.get('window');

const size = 160;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

export default function DashboardScreen() {
  const router = useRouter();
  const { user, clientProfile, logout } = useAuth();
  const { data: devicesData, isLoading: devicesLoading, refetch: refetchDevices } = useDevices();
  const { data: refillRequestsData } = useRefillRequests({ limit: '5' });
  const { data: notificationCount } = useUnreadNotificationCount();
  const { data: currentUser } = useCurrentUser();
  const { data: activityLogs } = useActivityLogs(10);
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchDevices(),
    ]);
    setRefreshing(false);
  }, [refetchDevices]);

  const devices = devicesData?.results || [];
  const mainDevice = devices[0];
  const progress = mainDevice ? mainDevice.current_level / 100 : 0.65;
  const strokeDashoffset = circumference - (circumference * progress);
  
  const unreadCount = notificationCount?.unread_count || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (level: number) => {
    if (level >= 50) return '#10B981';
    if (level >= 20) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusText = (level: number) => {
    if (level >= 50) return 'Good';
    if (level >= 20) return 'Low';
    return 'Critical';
  };

  const displayName = clientProfile?.full_name || user?.username || user?.email?.split('@')[0] || 'User';

  if (devicesLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY_COLOR]} />
        }
      >
        
        <View style={styles.headerBackground}>
          <SafeAreaView>
            <View style={styles.headerTop}>
              <View style={styles.profileSection}>
                <View style={[styles.profileImage, { backgroundColor: '#F472B6', justifyContent: 'center', alignItems: 'center' }]}>
                  <MaterialCommunityIcons name="account" size={24} color="#FFF" />
                </View>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greetingText}>{getGreeting()}</Text>
                  <Text style={styles.nameText}>{displayName}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('./notifications')}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#FFFFFF" />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.mainContent}>
          
          {devices.length > 0 ? (
            <View style={styles.mainCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cylinderLabel}>Main Cylinder</Text>
                  <Text style={styles.cylinderName}>{mainDevice?.device_id || 'Gas Monitor'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(mainDevice?.current_level || 0) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(mainDevice?.current_level || 0) }]}>
                    {getStatusText(mainDevice?.current_level || 0)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <Svg width={size} height={size}>
                  <Circle
                    stroke="#E5E7EB"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                  />
                  <Circle
                    stroke={getStatusColor(mainDevice?.current_level || 0)}
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
                  <MaterialCommunityIcons 
                    name="fire" 
                    size={36} 
                    color={getStatusColor(mainDevice?.current_level || 0)} 
                  />
                  <Text style={styles.percentageText}>{mainDevice?.current_level || 0}%</Text>
                  <Text style={styles.remainingText}>Remaining</Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Battery</Text>
                  <Text style={styles.metricValue}>{mainDevice?.battery_level || 0}%</Text>
                </View>
                <View style={styles.metricItemRight}>
                  <Text style={styles.metricLabel}>Last Seen</Text>
                  <Text style={styles.metricValue}>
                    {mainDevice?.last_seen 
                      ? new Date(mainDevice.last_seen).toLocaleDateString() 
                      : 'N/A'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.refillButton}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/vendors',
                    params: {
                      preselectedCylinderName: mainDevice?.device_id,
                      preselectedCylinderLevel: String(mainDevice?.current_level || 0),
                    },
                  } as Href)
                }
              >
                <Text style={styles.refillButtonText}>Request Refill</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mainCard}>
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="gas-cylinder" size={64} color="#E5E7EB" />
                <Text style={styles.emptyTitle}>No Gas Monitors</Text>
                <Text style={styles.emptyText}>
                  Connect a gas sensor to start monitoring your gas levels
                </Text>
                <TouchableOpacity
                  style={styles.addMonitorButton}
                  onPress={() => router.push('/add-monitor')}
                >
                  <Text style={styles.addMonitorButtonText}>Add Monitor</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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

          {refillRequestsData?.results && refillRequestsData.results.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <TouchableOpacity onPress={() => router.push('/client-orders')}>
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>

              {refillRequestsData.results.slice(0, 3).map((order: any) => {
                const statusColors: Record<string, { bg: string; text: string }> = {
                  pending: { bg: '#F6E6C9', text: '#D48C18' },
                  accepted: { bg: '#E9E6FF', text: '#6B5DD9' },
                  in_transit: { bg: '#E9E6FF', text: '#6B5DD9' },
                  completed: { bg: '#D1FAE5', text: '#10B981' },
                  cancelled: { bg: '#F9CDD4', text: '#E44A69' },
                };
                const status = statusColors[order.status] || statusColors.pending;
                return (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.orderItemCard}
                    onPress={() => router.push({
                      pathname: '/client-order-detail',
                      params: {
                        orderId: order.id,
                        vendorName: order.provider?.company_name || 'Unknown',
                        status: order.status,
                        scheduledDate: order.scheduled_date || '',
                        completedDate: order.completed_at || '',
                        notes: order.notes || '',
                      },
                    })}
                  >
                    <View style={styles.orderItemLeft}>
                      <MaterialCommunityIcons name="package-variant" size={20} color={PRIMARY_COLOR} />
                    </View>
                    <View style={styles.orderItemContent}>
                      <Text style={styles.orderItemTitle}>{order.provider?.company_name || 'Unknown Vendor'}</Text>
                      <Text style={styles.orderItemSubtitle}>
                        {order.scheduled_date 
                          ? new Date(order.scheduled_date).toLocaleDateString() 
                          : 'Not scheduled'}
                      </Text>
                    </View>
                    <View style={[styles.orderStatusBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.orderStatusText, { color: status.text }]}>
                        {order.status === 'in_transit' ? 'In progress' : order.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activityLogs && activityLogs.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity onPress={() => router.push('./recent-activity')}>
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.activityCard}>
                {activityLogs.slice(0, 3).map((item, index) => {
                  const getActivityIcon = (action: string) => {
                    switch (action) {
                      case 'refill_requested':
                        return <MaterialCommunityIcons name="truck-delivery-outline" size={20} color={PRIMARY_COLOR} />;
                      case 'refill_status_changed':
                        return <MaterialCommunityIcons name="swap-horizontal-circle-outline" size={20} color="#10B981" />;
                      case 'cylinder_connected':
                        return <MaterialCommunityIcons name="link-variant-plus" size={20} color="#10B981" />;
                      case 'cylinder_disconnected':
                        return <MaterialCommunityIcons name="link-variant-remove" size={20} color="#EF4444" />;
                      case 'circle_created':
                        return <MaterialCommunityIcons name="account-group" size={20} color="#F59E0B" />;
                      case 'circle_joined':
                        return <MaterialCommunityIcons name="account-plus" size={20} color="#F59E0B" />;
                      case 'vendor_subscribed':
                        return <MaterialCommunityIcons name="store" size={20} color="#10B981" />;
                      case 'password_changed':
                        return <MaterialCommunityIcons name="lock-reset" size={20} color="#6B7280" />;
                      case 'profile_updated':
                        return <MaterialCommunityIcons name="account-edit" size={20} color="#6B7280" />;
                      default:
                        return <MaterialCommunityIcons name="information-outline" size={20} color="#9CA3AF" />;
                    }
                  };
                  
                  const getActivityColor = (action: string) => {
                    switch (action) {
                      case 'refill_requested':
                        return '#E0E7FF';
                      case 'refill_status_changed':
                        return '#D1FAE5';
                      case 'cylinder_connected':
                        return '#D1FAE5';
                      case 'cylinder_disconnected':
                        return '#FEE2E2';
                      case 'circle_created':
                      case 'circle_joined':
                        return '#FEF3C7';
                      case 'vendor_subscribed':
                        return '#D1FAE5';
                      default:
                        return '#F3F4F6';
                    }
                  };
                  
                  return (
                    <View key={item.id}>
                      <View style={styles.activityItem}>
                        <View style={[styles.activityIconContainer, { backgroundColor: getActivityColor(item.action) }]}>
                          {getActivityIcon(item.action)}
                        </View>
                        <View style={styles.activityDetails}>
                          <Text style={styles.activityTitle}>{item.title}</Text>
                          <Text style={styles.activitySubtitle}>
                            {item.subtitle || item.description || new Date(item.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                        <View style={styles.activityRight}>
                          <Text style={styles.activityDate}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      {index < Math.min(activityLogs.length, 3) - 1 && <View style={styles.divider} />}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {devices.length > 1 && (
            <View style={[styles.sectionContainer, styles.lastSection]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Other Monitors</Text>
                <TouchableOpacity onPress={() => router.push('/monitors' as Href)}>
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>

              {devices.slice(1).map((device) => (
                <TouchableOpacity
                  key={device.id}
                  style={styles.otherMonitorItem}
                  onPress={() =>
                    router.push({
                      pathname: '/my-circle/cylinder',
                      params: { name: device.device_id, fill: String(device.current_level) },
                    } as Href)
                  }
                >
                  <View style={[styles.monitorIconBadge, { 
                    backgroundColor: device.current_level >= 50 ? '#D1FAE5' : 
                      device.current_level >= 20 ? '#FEF3C7' : '#FEE2E2'
                  }]}> 
                    <MaterialCommunityIcons 
                      name="fire" 
                      size={16} 
                      color={device.current_level >= 50 ? '#10B981' : 
                        device.current_level >= 20 ? '#F59E0B' : '#EF4444'} 
                    />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>{device.device_id}</Text>
                    <Text style={styles.activitySubtitle}>{device.current_level}% remaining</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBackground: {
    backgroundColor: PRIMARY_COLOR,
    height: 240,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 50,
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
    minWidth: 16,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  mainContent: {
    paddingHorizontal: 24,
    marginTop: -100,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addMonitorButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addMonitorButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    gap: 10,
  },
  quickActionBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    color: '#11181C',
    fontSize: 10,
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityDetails: { flex: 1 },
  activityTitle: { color: '#11181C', fontSize: 12, fontWeight: '700' },
  activitySubtitle: { color: '#6B7280', fontSize: 10 },
  activityRight: {},
  activityDate: { color: '#9CA3AF', fontSize: 9 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  otherMonitorItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  orderItemLeft: {
    marginRight: 12,
  },
  orderItemContent: {
    flex: 1,
  },
  orderItemTitle: {
    color: '#11181C',
    fontSize: 13,
    fontWeight: '700',
  },
  orderItemSubtitle: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 2,
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  orderStatusText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  monitorIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 6,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
