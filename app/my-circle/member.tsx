import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

type RoleType = 'Member' | 'Viewer';

export default function MemberProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    memberId?: string;
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
  const phone = useMemo(() => params.phone || '+254 712 345 678', [params.phone]);
  const altPhone = useMemo(() => params.altPhone || '+254 712 345 679', [params.altPhone]);
  const joined = useMemo(() => params.joined || 'Joined 2 months ago', [params.joined]);
  const [role, setRole] = useState<RoleType>(params.memberRole === 'Member' ? 'Member' : 'Viewer');
  const [draftRole, setDraftRole] = useState<RoleType>(params.memberRole === 'Member' ? 'Member' : 'Viewer');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const initials = useMemo(() => {
    const parts = memberName.split(' ').filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [memberName]);

  const openRoleModal = () => {
    setDraftRole(role);
    setShowRoleModal(true);
  };

  const updateRole = () => {
    setRole(draftRole);
    setShowRoleModal(false);
  };

  const removeMember = () => {
    if (!confirmRemove) {
      return;
    }
    setShowRemoveModal(false);
    router.back();
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
              <Text style={styles.roleBadgeText}>{role}</Text>
            </View>
          </View>
        </AppCard>

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <AppCard style={styles.contactCard}>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="phone-outline" size={14} color="#4B5563" />
            <Text style={styles.contactText}>{phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="phone-classic" size={14} color="#4B5563" />
            <Text style={styles.contactText}>{altPhone}</Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="calendar-month-outline" size={14} color="#4B5563" />
            <Text style={styles.contactText}>{joined}</Text>
          </View>
        </AppCard>

        <Text style={styles.sectionTitle}>Actions</Text>
        <AppButton
          title="Change Role"
          onPress={openRoleModal}
          style={styles.changeRoleButton}
          textStyle={styles.changeRoleText}
        />
        <AppButton
          title="Remove from Circle"
          onPress={() => {
            setConfirmRemove(false);
            setShowRemoveModal(true);
          }}
          style={styles.removeButton}
          textStyle={styles.removeText}
        />
      </ScrollView>

      <Modal transparent animationType="fade" visible={showRemoveModal} onRequestClose={() => setShowRemoveModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Remove Member</Text>
            <Text style={styles.modalSubtitle}>This action cannot be undone</Text>

            <AppCard style={styles.modalMemberCard}>
              <View style={styles.modalMemberAvatar}>
                <Text style={styles.modalMemberInitials}>{initials || 'SJ'}</Text>
              </View>
              <View>
                <Text style={styles.modalMemberName}>{memberName}</Text>
                <Text style={styles.modalMemberEmail}>{memberEmail}</Text>
              </View>
            </AppCard>

            <View style={styles.warningCard}>
              <View style={styles.warningRow}>
                <MaterialCommunityIcons name="trash-can-outline" size={13} color="#EF4444" />
                <Text style={styles.warningTitle}>Security Tips</Text>
              </View>
              <Text style={styles.warningText}>Use a unique password you do not use elsewhere</Text>
              <Text style={styles.warningText}>Enable two-factor authentication for extra security</Text>
              <Text style={styles.warningText}>Never share your password with anyone</Text>
            </View>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setConfirmRemove((value) => !value)}>
              <View style={[styles.checkbox, confirmRemove && styles.checkboxChecked]}>
                {confirmRemove ? <MaterialCommunityIcons name="check" size={11} color="#FFFFFF" /> : null}
              </View>
              <Text style={styles.checkboxText}>
                I understand that {memberName} will lose access to this circle and all its cylinders
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <AppButton title="Cancel" variant="secondary" style={styles.modalActionButton} onPress={() => setShowRemoveModal(false)} />
              <AppButton
                title="Remove"
                onPress={removeMember}
                disabled={!confirmRemove}
                style={[styles.modalActionButton, styles.confirmRemoveButton]}
                textStyle={styles.confirmRemoveText}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={showRoleModal} onRequestClose={() => setShowRoleModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Member Role</Text>
            <Text style={styles.modalSubtitle}>Update permissions for {memberName}</Text>

            <AppCard style={styles.currentRoleCard}>
              <Text style={styles.currentRoleLabel}>Current Role</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{role}</Text>
              </View>
            </AppCard>

            <TouchableOpacity
              style={[styles.roleOptionCard, draftRole === 'Member' && styles.roleOptionSelected]}
              onPress={() => setDraftRole('Member')}
            >
              <View style={styles.roleOptionHeader}>
                <View style={styles.roleIconWrap}>
                  <MaterialCommunityIcons name="account-group-outline" size={14} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.roleTextWrap}>
                  <Text style={styles.roleTitle}>Member</Text>
                  <Text style={styles.roleSubtitle}>Can Add and monitor Cylinders</Text>
                </View>
                <View style={styles.radioOuter}>
                  {draftRole === 'Member' ? <View style={styles.radioInner} /> : null}
                </View>
              </View>
              <Text style={styles.roleBullet}>Add or remove members</Text>
              <Text style={styles.roleBullet}>Add or remove Cylinders</Text>
              <Text style={styles.roleBullet}>Track Revenue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOptionCard, draftRole === 'Viewer' && styles.roleOptionSelected]}
              onPress={() => setDraftRole('Viewer')}
            >
              <View style={styles.roleOptionHeader}>
                <View style={styles.roleIconWrap}>
                  <MaterialCommunityIcons name="eye-outline" size={14} color="#6B7280" />
                </View>
                <View style={styles.roleTextWrap}>
                  <Text style={styles.roleTitle}>Viewer</Text>
                  <Text style={styles.roleSubtitle}>Can view all access</Text>
                </View>
                <View style={styles.radioOuter}>
                  {draftRole === 'Viewer' ? <View style={styles.radioInner} /> : null}
                </View>
              </View>
              <Text style={styles.roleBullet}>View Cylinder Levels</Text>
              <Text style={styles.roleBullet}>See circle Activity</Text>
              <Text style={styles.roleBullet}>Cannot add or modify</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <AppButton title="Cancel" variant="secondary" style={styles.modalActionButton} onPress={() => setShowRoleModal(false)} />
              <AppButton title="Update Role" style={styles.modalActionButton} onPress={updateRole} />
            </View>
          </View>
        </View>
      </Modal>
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
  changeRoleButton: {
    backgroundColor: '#C7C3F3',
    marginBottom: 10,
    height: 40,
  },
  changeRoleText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
  },
  removeButton: {
    backgroundColor: '#F8D7DC',
    height: 40,
  },
  removeText: {
    color: '#EF4444',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(54,41,183,0.72)',
    justifyContent: 'center',
    padding: 14,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
  },
  modalTitle: {
    fontSize: 23,
    color: '#1F2937',
    fontWeight: '700',
  },
  modalSubtitle: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: 10,
    color: '#9CA3AF',
  },
  modalMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: '#F3F4F6',
  },
  modalMemberAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalMemberInitials: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  modalMemberName: {
    color: '#11181C',
    fontSize: 13,
    fontWeight: '700',
  },
  modalMemberEmail: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  warningCard: {
    borderWidth: 1,
    borderColor: '#F5C2C7',
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
    padding: 10,
    marginBottom: 10,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningTitle: {
    marginLeft: 6,
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  warningText: {
    color: '#EF4444',
    fontSize: 9,
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 13,
    height: 13,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    marginTop: 2,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  checkboxText: {
    flex: 1,
    fontSize: 10,
    color: '#6B7280',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActionButton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
  },
  confirmRemoveButton: {
    backgroundColor: '#EF4444',
  },
  confirmRemoveText: {
    color: '#FFFFFF',
  },
  currentRoleCard: {
    marginBottom: 10,
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: '#F8FAFC',
  },
  currentRoleLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  roleOptionCard: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  roleOptionSelected: {
    borderColor: '#6D5DD3',
    backgroundColor: '#F4F3FF',
  },
  roleOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  roleTextWrap: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '700',
  },
  roleSubtitle: {
    fontSize: 10,
    color: '#6B7280',
  },
  roleBullet: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 28,
    marginBottom: 4,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_COLOR,
  },
});
