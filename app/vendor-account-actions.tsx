import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/providers/AuthProvider';
import { useRequestAccountDeletion, useDeactivateAccount } from '@/hooks/queries';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

const PRIMARY_COLOR = '#3629B7';

export default function VendorAccountActionsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const deleteAccountMutation = useRequestAccountDeletion();
  const deactivateAccountMutation = useDeactivateAccount();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccountMutation.mutateAsync();
              Alert.alert('Request Sent', 'Account deletion request has been submitted.');
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to request account deletion');
            }
          },
        },
      ]
    );
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      'Deactivate Account',
      'Are you sure you want to deactivate your account? You can reactivate by contacting support.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await deactivateAccountMutation.mutateAsync();
              Alert.alert('Account Deactivated', 'Your account has been deactivated.');
              await logout();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to deactivate account');
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
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Account Actions</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>

          <TouchableOpacity style={styles.optionCard} onPress={handleDeactivateAccount} activeOpacity={0.85}>
            <View style={[styles.optionIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="account-off" size={18} color="#F59E0B" />
            </View>
            <View style={styles.optionBody}>
              <Text style={[styles.optionTitle, { color: '#F59E0B' }]}>Deactivate Account</Text>
              <Text style={styles.optionSub}>Temporarily disable your account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#F59E0B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleDeleteAccount} activeOpacity={0.85}>
            <View style={[styles.optionIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <MaterialCommunityIcons name="delete" size={18} color="#EF4444" />
            </View>
            <View style={styles.optionBody}>
              <Text style={[styles.optionTitle, { color: '#EF4444' }]}>Delete Account</Text>
              <Text style={styles.optionSub}>Permanently delete your account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#EF4444" />
          </TouchableOpacity>

          <Text style={styles.note}>
            Deactivation hides your profile but preserves your data. Deletion permanently removes all your data after admin approval.
          </Text>
        </ScrollView>
      </View>

      <VendorBottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY_COLOR },
  header: { backgroundColor: PRIMARY_COLOR },
  safeHeader: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  sheet: {
    flex: 1,
    backgroundColor: '#F3F3F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: { padding: 14, paddingBottom: 30 },
  sectionTitle: { color: '#374151', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionBody: { flex: 1 },
  optionTitle: { color: '#11181C', fontSize: 13, fontWeight: '700' },
  optionSub: { color: '#6B7280', fontSize: 10, marginTop: 2 },
  note: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 16,
  },
});
