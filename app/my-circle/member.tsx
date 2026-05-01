import React, { useMemo } from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useAuth } from '@/providers/AuthProvider';

const PRIMARY_COLOR = '#3629B7';

export default function MemberProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    memberId?: string;
    memberUserId?: string;
    memberName?: string;
    memberEmail?: string;
    memberRole?: string;
    phone?: string;
    altPhone?: string;
    joined?: string;
    circleName?: string;
  }>();

  const memberName = useMemo(() => params.memberName || 'John Doe', [params.memberName]);
  const memberEmail = useMemo(() => params.memberEmail || 'john.doe@email.com', [params.memberEmail]);
  const phone = useMemo(() => params.phone || '', [params.phone]);
  const joined = useMemo(() => params.joined || 'Joined 2 months ago', [params.joined]);
  const role = useMemo(() => params.memberRole || 'Member', [params.memberRole]);
  const memberUserId = useMemo(() => params.memberUserId || '', [params.memberUserId]);

  const isSelf = !!user?.id && !!memberUserId && user.id === memberUserId;

  const initials = useMemo(() => {
    const parts = memberName.split(' ').filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [memberName]);

  const handleCall = async () => {
    if (isSelf) return;
    if (!phone) {
      Alert.alert('No phone number', 'This member has no phone number on file.');
      return;
    }
    const phoneUrl = `tel:${phone}`;
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (!supported) {
        Alert.alert('Call unavailable', `Your device cannot place calls to ${phone}.`);
        return;
      }
      await Linking.openURL(phoneUrl);
    } catch {
      Alert.alert('Call failed', 'Unable to open phone app right now. Please try again.');
    }
  };

  const handleMessage = async () => {
    if (isSelf) return;
    if (!memberUserId) {
      Alert.alert('Missing member', 'Unable to start chat with this member right now.');
      return;
    }
    router.push(
      {
        pathname: '/member-chat',
        params: {
          memberUserId,
          memberName,
        },
      } as unknown as Href
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
            <Text style={styles.headerTitle}>Member Profile</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials || 'JD'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.memberName}>{memberName}</Text>
            <Text style={styles.memberEmail}>{memberEmail}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{isSelf ? 'Your account' : role}</Text>
            </View>
          </View>
        </AppCard>

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <AppCard style={styles.contactCard}>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="phone-outline" size={14} color="#4B5563" />
            <Text style={styles.contactText}>{phone || 'Not provided'}</Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="calendar-month-outline" size={14} color="#4B5563" />
            <Text style={styles.contactText}>{joined}</Text>
          </View>
        </AppCard>

        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, styles.callButton]} activeOpacity={0.85} onPress={handleCall}>
            <MaterialCommunityIcons name="phone-outline" size={16} color="#16A34A" />
            <Text style={[styles.actionText, styles.callText]}>{isSelf ? 'Your account' : 'Call'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.messageButton]} activeOpacity={0.85} onPress={handleMessage}>
            <MaterialCommunityIcons name="message-outline" size={16} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.messageText]}>{isSelf ? 'Your account' : 'Message'}</Text>
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarInitials: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  memberEmail: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  roleBadgeText: {
    color: '#6D5DD3',
    fontSize: 9,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 6,
    color: '#11181C',
    fontSize: 13,
    fontWeight: '700',
  },
  contactCard: {
    paddingVertical: 10,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 11,
    color: '#4B5563',
  },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
  },
  callButton: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#BBF7D0' },
  messageButton: { backgroundColor: PRIMARY_COLOR },
  actionText: { fontSize: 12, fontWeight: '700' },
  callText: { color: '#16A34A' },
  messageText: { color: '#FFFFFF' },
});
