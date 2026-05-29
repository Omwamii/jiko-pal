import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { useQuery } from '@tanstack/react-query';
import { invitesApi } from '@/lib/invites';

const PRIMARY_COLOR = '#3629B7';

const getInviteRecipientLabel = (invite: { recipient_email?: string | null; recipient_phone?: string | null }) => {
  if (invite.recipient_email) return invite.recipient_email;
  if (invite.recipient_phone) return invite.recipient_phone;
  return 'Link invite';
};

const getInviteStatusLabel = (invite: { revoked_at: string | null; expires_at: string | null; uses_count: number }) => {
  if (invite.revoked_at) return { label: 'Revoked', bg: '#FEE2E2', color: '#EF4444' };

  if (invite.expires_at) {
    const expiresMs = Date.parse(invite.expires_at);
    if (!Number.isNaN(expiresMs) && expiresMs < Date.now()) {
      return { label: 'Expired', bg: '#FEF3C7', color: '#D08B17' };
    }
  }

  if (invite.uses_count > 0) return { label: 'Joined', bg: '#D1FAE5', color: '#10B981' };
  return { label: 'Pending', bg: '#E5E7EB', color: '#6B7280' };
};

export default function InviteMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    monitorId?: string;
    fromCircle?: string;
    circleId?: string;
    circleName?: string;
    members?: string;
  }>();
  const [showLink, setShowLink] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [isLoadingLink, setIsLoadingLink] = useState(false);

  const circleId = useMemo(() => (Array.isArray(params.circleId) ? params.circleId[0] : params.circleId), [params.circleId]);

  const inviteType = useMemo(() => (params.circleId ? 'circle' : 'platform'), [params.circleId]);

  const {
    data: invitesData,
    isLoading: isLoadingInvites,
    isError: isInvitesError,
    refetch: refetchInvites,
  } = useQuery({
    queryKey: ['myInvites', inviteType, circleId],
    queryFn: () => invitesApi.listMine({ type: inviteType, circle_id: circleId }),
  });

  const invitedPeople = useMemo(() => {
    const results = invitesData?.results ?? [];
    return results.filter((i) => i.recipient_email || i.recipient_phone);
  }, [invitesData]);

  const generateInviteLink = async () => {
    if (isLoadingLink || inviteLink) return;
    setIsLoadingLink(true);
    try {
      const invite = await invitesApi.create({
        type: inviteType,
        circle_id: circleId
      });
      setInviteLink(invite.invite_url);
    } catch (err: any) {
      console.error('Failed to create invite:', err);
      Alert.alert('Error', 'Failed to create invite link. Please try again.');
    } finally {
      setIsLoadingLink(false);
    }
  };

  const handleCopy = () => {
    if (!inviteLink) {
      generateInviteLink();
      return;
    }
    Clipboard.setStringAsync(inviteLink);
    Alert.alert('Link Copied', 'The invitation link has been copied to your clipboard.');
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
              <Text style={styles.infoTitle}>Shared Access</Text>
              <Text style={styles.infoDescription}>
                Invite family members or team members to monitor your gas cylinders. You can set different permission levels for each user.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Invite Via</Text>

        {/* Invite Methods Container */}
        <View style={styles.methodsContainer}>
          <TouchableOpacity
            style={styles.methodListCard}
            onPress={() =>
              router.push({
                pathname: '/invite-users/email',
                params: { ...params, inviteLink },
              } as Href)
            }
          >
            <View style={[styles.iconBadge, { backgroundColor: '#E0E7FF' }]}>
              <MaterialCommunityIcons name="email-outline" size={24} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Email Invitation</Text>
              <Text style={styles.methodSubtitle}>Send invite via Email</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.methodListCard}
            onPress={() =>
              router.push({
                pathname: '/invite-users/sms',
                params: { ...params, inviteLink },
              } as Href)
            }
          >
            <View style={[styles.iconBadge, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="message-text-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>SMS Invitation</Text>
              <Text style={styles.methodSubtitle}>Send invite via text message</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          {/* <View style={styles.divider} />

          <TouchableOpacity style={styles.methodListCard} onPress={() => setShowLink(!showLink)}>
            <View style={[styles.iconBadge, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="share-variant" size={24} color="#10B981" />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Share link</Text>
              <Text style={styles.methodSubtitle}>Copy and share link</Text>
            </View>
          </TouchableOpacity> */}

          {showLink && (
            <View style={styles.linkShareContainer}>
              <TextInput 
                style={styles.linkInput} 
                value={isLoadingLink ? 'Generating link…' : inviteLink}
                editable={false}
              />
              <TouchableOpacity style={[styles.copyButton, (!inviteLink || isLoadingLink) && { opacity: 0.6 }]} onPress={handleCopy} disabled={!inviteLink || isLoadingLink}>
                {isLoadingLink ? (
                  <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 4 }} />
                ) : (
                  <MaterialCommunityIcons name="content-copy" size={16} color="#FFF" style={{ marginRight: 4 }} />
                )}
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        {/* Shared With Section */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Shared With</Text>

        {isLoadingInvites ? (
          <View style={styles.sharedEmpty}>
            <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            <Text style={styles.sharedEmptyText}>Loading invited users…</Text>
          </View>
        ) : isInvitesError ? (
          <View style={styles.sharedEmpty}>
            <Text style={styles.sharedEmptyText}>Couldn’t load invited users.</Text>
            <TouchableOpacity onPress={() => refetchInvites()} activeOpacity={0.85}>
              <Text style={styles.sharedRetryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : invitedPeople.length === 0 ? (
          <View style={styles.sharedEmpty}>
            <Text style={styles.sharedEmptyText}>No invited users yet.</Text>
          </View>
        ) : (
          invitedPeople.map((invite) => {
            const statusMeta = getInviteStatusLabel(invite);
            const label = getInviteRecipientLabel(invite);
            const initials = (label[0] || 'U').toUpperCase();

            return (
              <View key={invite.id} style={styles.sharedUserCard}>
                <View style={styles.sharedUserHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <View style={styles.sharedUserDetails}>
                    <Text style={styles.sharedUserName}>{label}</Text>
                    <Text style={styles.sharedUserEmail}>{invite.circle_name ? invite.circle_name : 'JikoPal invite'}</Text>
                  </View>
                </View>

                <View style={styles.sharedUserFooter}>
                  <Text style={styles.permissionText}>{invite.type === 'circle' ? 'Circle invite' : 'Platform invite'}</Text>
                  <View style={[styles.activeTag, { backgroundColor: statusMeta.bg }]}>
                    <Text style={[styles.activeTagText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
                  </View>
                </View>
              </View>
            );
          })
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
  methodsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  methodListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodDetails: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  linkShareContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  linkInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#4B5563',
    marginRight: 8,
  },
  copyButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_COLOR,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sharedUserCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  sharedUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sharedUserDetails: {
    flex: 1,
  },
  sharedUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sharedUserEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sharedUserFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  permissionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTagText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  sharedEmpty: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharedEmptyText: { color: '#6B7280', fontSize: 12, fontWeight: '500' },
  sharedRetryText: { marginTop: 8, color: PRIMARY_COLOR, fontSize: 12, fontWeight: '700' },
});
