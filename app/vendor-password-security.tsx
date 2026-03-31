import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

export default function VendorPasswordSecurityScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.formWrap}>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Current Password</Text>
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
            <Text style={styles.fieldLabel}>New Password</Text>
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
            <Text style={styles.fieldLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter New Password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} activeOpacity={0.85} onPress={() => router.back()}>
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipTitleRow}>
              <MaterialCommunityIcons name="shield-key-outline" size={12} color="#3629B7" />
              <Text style={styles.tipTitle}>Security Tips</Text>
            </View>
            <Text style={styles.tipItem}>- Use a unique password you don't use elsewhere</Text>
            <Text style={styles.tipItem}>- Enable two-factor authentication for extra security</Text>
            <Text style={styles.tipItem}>- Never share your password with anyone</Text>
          </View>
        </View>
      </View>

      <VendorBottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3629B7' },
  header: { backgroundColor: '#3629B7' },
  safeHeader: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
  sheet: {
    flex: 1,
    backgroundColor: '#F3F3F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 2,
    borderTopColor: '#0EA5E9',
  },
  formWrap: { padding: 14, paddingTop: 46 },
  fieldWrap: { marginBottom: 10 },
  fieldLabel: { color: '#11131A', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  input: {
    height: 34,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D6D8E4',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    fontSize: 11,
    color: '#374151',
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelButton: {
    width: '45%',
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelText: { color: '#6B7280', fontSize: 11, fontWeight: '500' },
  updateButton: {
    width: '45%',
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3629B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  tipCard: {
    marginTop: 34,
    backgroundColor: '#E8E8FA',
    borderRadius: 10,
    padding: 12,
  },
  tipTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 5 },
  tipTitle: { color: '#3629B7', fontSize: 11, fontWeight: '700' },
  tipItem: { color: '#5B61A8', fontSize: 8, marginBottom: 5 },
});
