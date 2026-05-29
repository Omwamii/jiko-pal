import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';

const PRIMARY_COLOR = '#3629B7';

const faqs = [
  {
    q: "I don’t receive any gas alerts or notifications",
    a: "Go to Profile → Preferences/Notifications and enable the notification types you want (Push/SMS/Email).",
  },
  {
    q: "My cylinder readings show 0% despite it being new",
    a: "Re-attach the sensor firmly at the bottom of the cylinder (clean, flat surface). Then check the recent signal strength on the cylinder details page — it should be above 1300.",
  },
  {
    q: "I can't see how far the vendor is after ordering",
    a: "The vendor may have turned off location sharing. Distance/location updates are usually shown when the vendor marks the order as arrived.",
  },
  {
    q: "Cylinder reading level seems to be off",
    a: "Confirm you set either Cylinder size or Custom height during setup. You can update this later by tapping the cylinder sensor card to open the details page, then editing the cylinder size/custom height. Contact support if you still need help.",
  },
  {
    q: "How do I add a level sensor?",
    a: [
      "Tap + Level sensor.",
      "Turn on your sensor.",
      "Choose the first option (Wi‑Fi setup), select the sensor Wi‑Fi, and allow connection.",
      "Enter your home Wi‑Fi / hotspot name and password, then tap Send.",
      "Fill in the cylinder details, then tap Add Cylinder.",
    ].join('\n'),
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Help Center</Text>
              <Text style={styles.headerSub}>We{"'"}re here to help</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Quick Help</Text>
        <View style={styles.quickRow}>
          <AppCard style={styles.quickCard}>
            <View style={styles.quickIconWrap}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickText}>Email Support</Text>
          </AppCard>

          <AppCard style={styles.quickCard}>
            <View style={styles.quickIconWrap}>
              <MaterialCommunityIcons name="phone-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.quickText}>Call us</Text>
          </AppCard>
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <TouchableOpacity
              key={`${faq.q}-${index}`}
              activeOpacity={0.85}
              onPress={() => setOpenIndex((prev) => (prev === index ? null : index))}
            >
              <AppCard style={styles.faqCard}>
                <View style={styles.faqTopRow}>
                  <Text style={styles.faqText}>{faq.q}</Text>
                  <MaterialCommunityIcons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={PRIMARY_COLOR} />
                </View>
                {isOpen ? <Text style={styles.faqAnswer}>{faq.a}</Text> : null}
              </AppCard>
            </TouchableOpacity>
          );
        })}

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportSub}>Our support team is available 24/7</Text>

          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="email-outline" size={13} color="#E0E7FF" />
            <Text style={styles.contactText}>support@gasmonitor.com</Text>
          </View>
          <View style={[styles.contactRow, { marginBottom: 12 }]}>
            <MaterialCommunityIcons name="phone-outline" size={13} color="#E0E7FF" />
            <Text style={styles.contactText}>+254 712134735346</Text>
          </View>

          <AppButton title="Contact Support" onPress={() => {}} variant="inverted" style={styles.supportBtn} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingTop: 8, paddingBottom: 14 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 10 },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
  headerSub: { color: '#D1D5DB', fontSize: 10, marginTop: 2 },
  scrollContent: { padding: 14, paddingBottom: 30 },
  sectionTitle: { color: '#11181C', fontSize: 10, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  quickCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 92,
  },
  quickIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6D46E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickText: { color: '#11181C', fontSize: 13, fontWeight: '600' },
  faqCard: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  faqTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  faqText: { color: '#11181C', fontSize: 13, fontWeight: '500' },
  faqAnswer: { marginTop: 10, color: '#6B7280', fontSize: 12, lineHeight: 16 },
  supportCard: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  supportTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  supportSub: { color: '#D1D5DB', fontSize: 12, marginTop: 3, marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  contactText: { marginLeft: 6, color: '#E0E7FF', fontSize: 11 },
  supportBtn: { height: 36, borderRadius: 18 },
});
