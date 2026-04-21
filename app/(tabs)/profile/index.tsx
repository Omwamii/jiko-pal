import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useAuth } from '@/providers/AuthProvider';

const PRIMARY_COLOR = '#3629B7';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user, clientProfile, vendorProfile, logout } = useAuth();

  const displayName = clientProfile?.full_name || vendorProfile?.company_name || user?.username || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';
  const accountType = user?.role === 'vendor' ? 'Vendor Account' : 'Client Account';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
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
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{displayEmail}</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{accountType}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile/edit' as Href)}>
            <MaterialCommunityIcons name="pencil-outline" size={18} color="#11181C" />
          </TouchableOpacity>
        </AppCard>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <AppCard style={styles.optionCard} onPress={() => router.push('/(tabs)/profile/edit' as Href)}>
          <View style={[styles.optionIconWrap, { backgroundColor: '#E0E7FF' }]}>
            <MaterialCommunityIcons name="account" size={18} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.optionTitle}>Personal Information</Text>
            <Text style={styles.optionSub}>Update your details</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
        </AppCard>

        <AppCard style={styles.optionCard} onPress={() => router.push('/(tabs)/profile/password' as Href)}>
          <View style={[styles.optionIconWrap, { backgroundColor: '#D1FAE5' }]}>
            <MaterialCommunityIcons name="lock" size={18} color="#10B981" />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.optionTitle}>Password & Security</Text>
            <Text style={styles.optionSub}>Change your password</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
        </AppCard>

        <AppCard style={styles.logoutCard} onPress={handleLogout}>
          <View style={[styles.optionIconWrap, { backgroundColor: '#FEE2E2' }]}>
            <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
          </View>
          <View style={styles.optionBody}>
            <Text style={styles.logoutTitle}>Log Out</Text>
            <Text style={styles.optionSub}>Sign Out of your account</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#EF4444" />
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
  profileCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F472B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  name: { color: '#11181C', fontSize: 14, fontWeight: '700' },
  email: { color: '#9CA3AF', fontSize: 10, marginTop: 2 },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 5,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { color: '#10B981', fontSize: 9, fontWeight: '700' },
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
  logoutCard: {
    borderRadius: 10,
    padding: 12,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutTitle: { color: '#EF4444', fontSize: 13, fontWeight: '700' },
});
