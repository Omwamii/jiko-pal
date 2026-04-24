import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { useCircleDetails, useCircleDevices, useDeleteCircle } from '@/hooks/circle';
import { authService } from '@/lib/auth';
import { User, CircleMember } from '@/types';

const PRIMARY_COLOR = '#3629B7';

export default function CircleIndexScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ circleId?: string; circleName?: string; members?: string }>();
  const [activeTab, setActiveTab] = useState<'cylinders' | 'members'>('cylinders');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const { circle, fetchCircle } = useCircleDetails();
  const { deleteCircle } = useDeleteCircle();
  const { devices, isLoading: isLoadingDevices, fetchCircleDevices } = useCircleDevices();

  const circleName = useMemo(() => params.circleName || 'Family Home', [params.circleName]);
  const circleId = useMemo(() => params.circleId || 'family-home', [params.circleId]);
  const memberCount = useMemo(() => circle?.member_count || Number(params.members || 0), [circle, params.members]);

  const isCreator = useMemo(() => {
    if (!currentUser) return false;
    if (!circle) return true;
    return circle.creator.id === currentUser.id;
  }, [circle, currentUser]);

  const showDeleteButton = isCreator || !circle;

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (circleId) {
      fetchCircle(circleId);
    }
  }, [circleId, fetchCircle]);

  useEffect(() => {
    if (circleId) {
      fetchCircleDevices(circleId).catch((err) => {
        console.error('Failed to load circle devices:', err);
      });
    }
  }, [circleId, fetchCircleDevices]);

  const handleDeleteCircle = () => {
    Alert.alert(
      'Delete Circle',
      `Are you sure you want to delete "${circleName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCircle(circleId);
              router.replace({
                pathname: './delete-success',
                params: { name: circleName },
              });
            } catch {
              Alert.alert('Error', 'Failed to delete circle. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {activeTab === 'cylinders' ? 'Cylinders Monitored' : `${circleName} Members`}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.actionRow}>
          <AppButton
            title="Add Cylinder"
            onPress={() =>
              router.push({
                pathname: '/add-monitor',
                params: {
                  fromCircle: '1',
                  circleId,
                  circleName,
                  members: String(memberCount),
                },
              } as Href)
            }
            style={styles.addButton}
            textStyle={styles.addButtonText}
          />
          <AppButton
            title="Invite User"
            onPress={() =>
              router.push({
                pathname: '/invite-users/method',
                params: {
                  fromCircle: '1',
                  circleId,
                  circleName,
                  members: String(memberCount),
                },
              } as Href)
            }
            style={styles.inviteButton}
            textStyle={styles.inviteButtonText}
          />
          {(isCreator || showDeleteButton) && (
            <AppButton
            title="Delete Circle"
            onPress={handleDeleteCircle}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
          )}
          
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'cylinders' && styles.activeTabButton]}
            onPress={() => setActiveTab('cylinders')}
          >
            <Text style={[styles.tabText, activeTab === 'cylinders' && styles.activeTabText]}>
              Cylinders({devices.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'members' && styles.activeTabButton]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>Members({memberCount})</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'cylinders'
          ? isLoadingDevices ? (
              <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
            ) : devices.length === 0 ? (
              <Text style={styles.emptyText}>No cylinders in this circle yet.</Text>
            ) : (
              devices.map((device) => (
                <AppCard
                  key={device.id}
                  style={styles.listCard}
                  onPress={() =>
                    router.push({
                      pathname: '/my-circle/cylinder',
                      params: {
                        name: device.device_id,
                        location: device.owner_name ? device.owner_name : 'Unknown',
                        fill: String(device.current_level),
                      },
                    } as Href)
                  }
                >
                  <View style={[styles.itemIcon, { backgroundColor: '#D1FAE5' }]}>
                    <MaterialCommunityIcons name="fire" size={18} color="#10B981" />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{device.device_id}</Text>
                    <Text style={styles.itemSubtitle}>{device.owner_name || 'Unassigned'}</Text>
                    <View style={styles.progressRow}>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${device.current_level}%`,
                              backgroundColor: device.current_level < 20 ? '#EF4444' : device.current_level < 50 ? '#F59E0B' : '#10B981',
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{device.current_level}%</Text>
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
                </AppCard>
              ))
            )
          : circle?.members?.map((member: CircleMember) => {
              const memberUser = member.user;
              const initials = memberUser?.username?.slice(0, 2).toUpperCase() || 'U';
              return (
                <AppCard key={member.id} style={styles.listCard}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberInitials}>{initials}</Text>
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{memberUser?.username || 'Unknown'}</Text>
                    <Text style={styles.itemSubtitle}>{memberUser?.email || ''}</Text>
                    <Text style={styles.memberMeta}>
                      {circle?.creator?.id === memberUser?.id ? 'Owner' : 'Member'}
                    </Text>
                  </View>
                  <View style={styles.memberRight}>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: '/my-circle/member',
                          params: {
                            memberId: member.id,
                            memberName: memberUser?.username || 'Unknown',
                            memberEmail: memberUser?.email || '',
                            memberRole: circle?.creator?.id === memberUser?.id ? 'Owner' : 'Member',
                            joined: member.joined_at,
                            circleName,
                          },
                        } as Href)
                      }
                    >
                      <MaterialCommunityIcons name="cog-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeText}>Active</Text>
                    </View>
                  </View>
                </AppCard>
              );
            })}
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#a6b6d4',
    borderRadius: 8,
    backgroundColor: '#E0E7FF',
  },
  addButtonText: {
    fontSize: 11,
    color: PRIMARY_COLOR,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#a6b6d4',
    borderRadius: 8,
    backgroundColor: '#E0E7FF',
  },
  inviteButtonText: {
    fontSize: 11,
    color: PRIMARY_COLOR,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#6D5DD3',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listCard: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  progressRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    width: 90,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  memberAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  memberInitials: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  memberMeta: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 6,
  },
  memberRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 42,
  },
  activeBadge: {
    marginTop: 8,
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 11,
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
