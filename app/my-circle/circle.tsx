import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

const members = Array.from({ length: 5 }).map((_, index) => ({
  id: `member-${index + 1}`,
  name: 'Sarah Johnson',
  email: 'Sarahjones@gmail.com',
  role: index === 0 ? 'Member' : 'Viewer',
  status: 'Active',
  phone: '+254 712 345 678',
  altPhone: '+254 712 345 679',
  joined: 'Joined 2 months ago',
}));

const cylinders = [
  {
    id: 'office-gas',
    name: 'Office Gas',
    location: 'Office - Main Floor',
    fill: 85,
    fillColor: '#10B981',
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
  },
  {
    id: 'backup-cylinder',
    name: 'Backup Cylinder',
    location: 'Home - Garage',
    fill: 35,
    fillColor: '#F59E0B',
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
  },
];

export default function CircleIndexScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ circleId?: string; circleName?: string; members?: string }>();
  const [activeTab, setActiveTab] = useState<'cylinders' | 'members'>('cylinders');

  const circleName = useMemo(() => params.circleName || 'Family Home', [params.circleName]);
  const circleId = useMemo(() => params.circleId || 'family-home', [params.circleId]);
  const memberCount = useMemo(() => Number(params.members || members.length), [params.members]);

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
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'cylinders' && styles.activeTabButton]}
            onPress={() => setActiveTab('cylinders')}
          >
            <Text style={[styles.tabText, activeTab === 'cylinders' && styles.activeTabText]}>
              Cylinders({cylinders.length})
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
          ? cylinders.map((cylinder) => (
              <AppCard
                key={cylinder.id}
                style={styles.listCard}
                onPress={() =>
                  router.push({
                    pathname: '/my-circle/cylinder',
                    params: {
                      name: cylinder.name,
                      location: cylinder.location,
                      fill: String(cylinder.fill),
                    },
                  } as Href)
                }
              >
                <View style={[styles.itemIcon, { backgroundColor: cylinder.iconBg }]}>
                  <MaterialCommunityIcons name="fire" size={18} color={cylinder.iconColor} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{cylinder.name}</Text>
                  <Text style={styles.itemSubtitle}>{cylinder.location}</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${cylinder.fill}%`,
                            backgroundColor: cylinder.fillColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{cylinder.fill}%</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
              </AppCard>
            ))
          : members.map((member) => (
              <AppCard key={member.id} style={styles.listCard}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitials}>SJ</Text>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{member.name}</Text>
                  <Text style={styles.itemSubtitle}>{member.email}</Text>
                  <Text style={styles.memberMeta}>Permission: {member.role === 'Member' ? 'Can edit' : 'View only'}</Text>
                </View>
                <View style={styles.memberRight}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/my-circle/member',
                        params: {
                          memberId: member.id,
                          memberName: member.name,
                          memberEmail: member.email,
                          memberRole: member.role,
                          phone: member.phone,
                          altPhone: member.altPhone,
                          joined: member.joined,
                          circleName,
                        },
                      } as Href)
                    }
                  >
                    <MaterialCommunityIcons name="cog-outline" size={18} color="#6B7280" />
                  </TouchableOpacity>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>{member.status}</Text>
                  </View>
                </View>
              </AppCard>
            ))}
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
    height: 32,
    borderRadius: 4,
    paddingHorizontal: 14,
  },
  addButtonText: {
    fontSize: 11,
  },
  inviteButton: {
    height: 32,
    borderRadius: 4,
    paddingHorizontal: 14,
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
});
