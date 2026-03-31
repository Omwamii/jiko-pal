import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

export default function VendorSettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar}><Text style={styles.avatarText}>GC</Text></View>
            <View>
              <Text style={styles.name}>Gas Connect Ltd.</Text>
              <Text style={styles.email}>john.doe@mail.com</Text>
              <View style={styles.tag}><Text style={styles.tagText}>Verified Vendor</Text></View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8}>
            <MaterialCommunityIcons name="pencil-outline" size={17} color="#11131A" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.85}
            onPress={() => router.push('/vendor-business-information' as Href)}
          >
            <View style={[styles.optionIconWrap, { backgroundColor: '#E8E7FF' }]}>
              <MaterialCommunityIcons name="account" size={18} color="#3629B7" />
            </View>
            <View style={styles.optionMeta}>
              <Text style={styles.optionTitle}>Business Information</Text>
              <Text style={styles.optionSub}>Update details</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.85}
            onPress={() => router.push('/vendor-password-security' as Href)}
          >
            <View style={[styles.optionIconWrap, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="lock" size={18} color="#10B981" />
            </View>
            <View style={styles.optionMeta}>
              <Text style={styles.optionTitle}>Password & Security</Text>
              <Text style={styles.optionSub}>Change your password</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutCard}
          activeOpacity={0.85}
          onPress={() => router.replace('/login' as Href)}
        >
          <View style={[styles.optionIconWrap, { backgroundColor: '#FEE2E2' }]}>
            <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
          </View>
          <View style={styles.optionMeta}>
            <Text style={styles.logoutTitle}>Log Out</Text>
            <Text style={styles.optionSub}>Sign Out of your account</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <VendorBottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3629B7' },
  header: { backgroundColor: '#3629B7' },
  safeHeader: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12 },
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
  headerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  sheet: {
    flex: 1,
    backgroundColor: '#F3F3F7',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 12,
  },
  profileCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  name: { color: '#13141E', fontSize: 26, fontWeight: '700' },
  email: { color: '#8D8EA0', fontSize: 9, marginTop: 2 },
  tag: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { color: '#10B981', fontSize: 8, fontWeight: '700' },
  sectionTitle: { marginTop: 16, color: '#1F2937', fontSize: 25, fontWeight: '700', marginBottom: 8 },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    paddingHorizontal: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  optionMeta: { flex: 1 },
  optionTitle: { color: '#11131A', fontSize: 13, fontWeight: '700' },
  optionSub: { color: '#9CA3AF', fontSize: 10, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#ECECF3' },
  logoutCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutTitle: { color: '#EF4444', fontSize: 13, fontWeight: '700' },
});
