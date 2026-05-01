import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useAuth } from '@/providers/AuthProvider';
import { useRequestAccountDeletion, useDeactivateAccount } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

export default function AccountActionsScreen() {
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
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Account Actions</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>

        <AppCard style={styles.optionCard} onPress={handleDeactivateAccount}>
          <View style={[styles.optionIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <MaterialCommunityIcons name="account-off" size={18} color="#F59E0B" />
          </View>
          <View style={styles.optionBody}>
            <Text style={[styles.optionTitle, { color: '#F59E0B' }]}>Deactivate Account</Text>
            <Text style={styles.optionSub}>Temporarily disable your account</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#F59E0B" />
        </AppCard>

        <AppCard style={styles.optionCard} onPress={handleDeleteAccount}>
          <View style={[styles.optionIconWrap, { backgroundColor: '#FEE2E2' }]}>
            <MaterialCommunityIcons name="delete" size={18} color="#EF4444" />
          </View>
          <View style={styles.optionBody}>
            <Text style={[styles.optionTitle, { color: '#EF4444' }]}>Delete Account</Text>
            <Text style={styles.optionSub}>Permanently delete your account</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#EF4444" />
        </AppCard>

        <Text style={styles.note}>
          Deactivation hides your profile but preserves your data. Deletion permanently removes all your data after admin approval.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingTop: 8, paddingBottom: 14 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 10 },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  scrollContent: { padding: 14, paddingBottom: 30 },
  sectionTitle: { color: '#374151', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  optionCard: {
    borderRadius: 10,
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
