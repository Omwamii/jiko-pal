import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.formCard}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Current Password"
              placeholderTextColor="#9CA3AF"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter New Password"
              placeholderTextColor="#9CA3AF"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter New Password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.actions}>
            <AppButton title="Cancel" variant="secondary" style={styles.actionBtn} onPress={() => router.back()} />
            <AppButton title="Update" style={styles.actionBtn} onPress={() => router.back()} />
          </View>

          <AppCard style={styles.tipCard}>
            <View style={styles.tipTitleRow}>
              <MaterialCommunityIcons name="shield-key-outline" size={12} color={PRIMARY_COLOR} />
              <Text style={styles.tipTitle}>Security Tips</Text>
            </View>
            <Text style={styles.tipItem}>Use a unique password you don't use elsewhere</Text>
            <Text style={styles.tipItem}>Enable two-factor authentication for extra security</Text>
            <Text style={styles.tipItem}>Never share your password with anyone</Text>
          </AppCard>
        </AppCard>
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
  formCard: { borderRadius: 10, padding: 12 },
  fieldWrap: { marginBottom: 10 },
  label: { color: '#11181C', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 3,
    height: 34,
    paddingHorizontal: 8,
    color: '#374151',
    fontSize: 12,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 14 },
  actionBtn: { flex: 1, height: 40, borderRadius: 20 },
  tipCard: {
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    shadowOpacity: 0,
    elevation: 0,
  },
  tipTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tipTitle: { color: PRIMARY_COLOR, fontSize: 11, fontWeight: '700', marginLeft: 6 },
  tipItem: { color: PRIMARY_COLOR, fontSize: 9, marginBottom: 5 },
});
