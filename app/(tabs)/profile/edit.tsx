import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

export default function EditProfileScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('Jogn.doe@gmail.com');
  const [phone, setPhone] = useState('+254 741734257053756');
  const [address, setAddress] = useState('123 Main Street , Apt 4B, Nairobi, NB 10001');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.formCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.cameraBadge}>
              <MaterialCommunityIcons name="camera-outline" size={10} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Default Address</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={address}
              onChangeText={setAddress}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.actions}>
            <AppButton title="Cancel" variant="secondary" style={styles.actionBtn} onPress={() => router.back()} />
            <AppButton title="Update" style={styles.actionBtn} onPress={() => router.back()} />
          </View>
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
  avatarWrap: { alignSelf: 'center', marginBottom: 12 },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F472B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldWrap: { marginBottom: 8 },
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
  addressInput: { height: 60, paddingTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  actionBtn: { flex: 1, height: 40, borderRadius: 20 },
});
