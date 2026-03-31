import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

const faqs = [
  'How Do I add new Gas monitor',
  'How Do I add new Gas monitor',
  'How Do I add new Gas monitor',
  'How Do I add new Gas monitor',
];

export default function VendorHelpScreen() {
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

            <View>
              <Text style={styles.headerTitle}>Help Center</Text>
              <Text style={styles.headerSub}>We're here to help</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Quick Help</Text>

          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} activeOpacity={0.85}>
              <View style={styles.quickIconCircle}>
                <MaterialCommunityIcons name="email-outline" size={18} color="#7C3AED" />
              </View>
              <Text style={styles.quickLabel}>Email Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickCard} activeOpacity={0.85}>
              <View style={styles.quickIconCircle}>
                <MaterialCommunityIcons name="phone" size={18} color="#7C3AED" />
              </View>
              <Text style={styles.quickLabel}>Call us</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {faqs.map((item, index) => (
            <TouchableOpacity key={`${item}-${index}`} style={styles.faqCard} activeOpacity={0.85}>
              <Text style={styles.faqText}>{item}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color="#4F46E5" />
            </TouchableOpacity>
          ))}

          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>Still need help?</Text>
            <Text style={styles.supportSub}>Our support team is available 24/7</Text>

            <View style={styles.supportMetaRow}>
              <MaterialCommunityIcons name="email-outline" size={12} color="#D9D8FF" />
              <Text style={styles.supportMeta}>support@gasmonitor.com</Text>
            </View>
            <View style={styles.supportMetaRow}>
              <MaterialCommunityIcons name="phone-outline" size={12} color="#D9D8FF" />
              <Text style={styles.supportMeta}>+254 712134735346</Text>
            </View>

            <TouchableOpacity style={styles.contactButton} activeOpacity={0.85}>
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <VendorBottomNav active="help" />
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
  headerTitle: { color: '#FFFFFF', fontSize: 31, fontWeight: '700' },
  headerSub: { color: '#D8D6FB', fontSize: 9, marginTop: 1 },
  sheet: { flex: 1, backgroundColor: '#F3F3F7' },
  content: { padding: 14, paddingBottom: 22 },
  sectionTitle: { marginBottom: 8, marginTop: 6, color: '#151620', fontSize: 28, fontWeight: '700' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  quickCard: {
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 14,
  },
  quickIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickLabel: { color: '#1F2937', fontSize: 12, fontWeight: '500' },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECECF3',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqText: { color: '#1F2937', fontSize: 12, fontWeight: '500' },
  supportCard: {
    marginTop: 12,
    backgroundColor: '#3B30B6',
    borderRadius: 8,
    padding: 12,
  },
  supportTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  supportSub: { color: '#DCD9FF', fontSize: 10, marginTop: 3 },
  supportMetaRow: { marginTop: 7, flexDirection: 'row', alignItems: 'center', gap: 5 },
  supportMeta: { color: '#E3E2FF', fontSize: 11 },
  contactButton: {
    marginTop: 10,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: { color: '#3629B7', fontSize: 12, fontWeight: '500' },
});
