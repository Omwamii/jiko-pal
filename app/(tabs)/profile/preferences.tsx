import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useRequestAccountDeletion, useUpdateUserSettings, useUserSettings } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export default function PreferencesScreen() {
  const router = useRouter();
  const { data, isLoading, refetch } = useUserSettings();
  const { mutateAsync: updateSettings, isPending: saving } = useUpdateUserSettings();
  const { mutateAsync: requestDeletion, isPending: deleting } = useRequestAccountDeletion();

  const [thresholdText, setThresholdText] = useState('');

  useEffect(() => {
    if (!data) return;
    setThresholdText((prev) => (prev.trim() ? prev : String(data.cylinder_level_alert_threshold ?? 20)));
  }, [data]);

  const thresholdValue = useMemo(() => {
    const raw = thresholdText.trim();
    if (!raw) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return clampPercent(Math.round(parsed));
  }, [thresholdText]);

  const applyToggle = async (field: 'email_notifications' | 'push_notifications' | 'sms_notifications', value: boolean) => {
    if (!data) return;
    try {
      await updateSettings({ [field]: value } as any);
    } catch {
      Alert.alert('Error', 'Failed to update settings');
    }
  };

  const applyThreshold = async () => {
    if (thresholdValue === null) {
      Alert.alert('Invalid value', 'Enter a number between 0 and 100');
      return;
    }
    try {
      await updateSettings({ cylinder_level_alert_threshold: thresholdValue });
      Alert.alert('Saved', 'Cylinder alert threshold updated');
    } catch {
      Alert.alert('Error', 'Failed to update threshold');
    }
  };

  const handleRequestDeletion = () => {
    Alert.alert(
      'Request Account Deletion',
      'This will submit a deletion request for review. You may be contacted to confirm.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Deletion',
          style: 'destructive',
          onPress: async () => {
            try {
              await requestDeletion();
              await refetch();
              Alert.alert('Request received', 'Your account deletion request has been submitted');
            } catch {
              Alert.alert('Error', 'Failed to submit deletion request');
            }
          },
        },
      ]
    );
  };

  const currentThreshold = data?.cylinder_level_alert_threshold ?? 20;
  const deletionRequestedAt = data?.deletion_requested_at;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Preferences</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>CYLINDER MONITORING</Text>
            <AppCard style={styles.card}>
              <View style={styles.rowTop}>
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name="gas-cylinder" size={18} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.body}>
                  <Text style={styles.title}>Low Cylinder Level Alert</Text>
                  <Text style={styles.sub}>Notify me when my cylinder level drops below this percentage</Text>
                </View>
              </View>

              <View style={styles.thresholdRow}>
                <View style={styles.thresholdInputWrap}>
                  <TextInput
                    value={thresholdText}
                    onChangeText={setThresholdText}
                    placeholder={`${currentThreshold}`}
                    keyboardType="number-pad"
                    style={styles.thresholdInput}
                    editable={!saving}
                  />
                  <Text style={styles.percent}>%</Text>
                </View>
                <TouchableOpacity style={[styles.saveBtn, saving && styles.disabled]} onPress={applyThreshold} disabled={saving}>
                  <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </AppCard>

            <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
            <AppCard style={styles.card}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <MaterialCommunityIcons name="email-outline" size={18} color="#11181C" />
                  <View style={styles.toggleText}>
                    <Text style={styles.title}>Email Notifications</Text>
                    <Text style={styles.sub}>Receive alerts and updates via email</Text>
                  </View>
                </View>
                <Switch
                  value={!!data?.email_notifications}
                  onValueChange={(v) => applyToggle('email_notifications', v)}
                  disabled={saving}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <MaterialCommunityIcons name="bell-outline" size={18} color="#11181C" />
                  <View style={styles.toggleText}>
                    <Text style={styles.title}>Push Notifications</Text>
                    <Text style={styles.sub}>Receive alerts on your device</Text>
                  </View>
                </View>
                <Switch
                  value={!!data?.push_notifications}
                  onValueChange={(v) => applyToggle('push_notifications', v)}
                  disabled={saving}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <MaterialCommunityIcons name="message-text-outline" size={18} color="#11181C" />
                  <View style={styles.toggleText}>
                    <Text style={styles.title}>SMS Notifications</Text>
                    <Text style={styles.sub}>Receive alerts via SMS (if available)</Text>
                  </View>
                </View>
                <Switch
                  value={!!data?.sms_notifications}
                  onValueChange={(v) => applyToggle('sms_notifications', v)}
                  disabled={saving}
                />
              </View>
            </AppCard>

            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <AppCard style={styles.dangerCard} onPress={handleRequestDeletion} disabled={deleting || !!deletionRequestedAt}>
              <View style={styles.dangerRow}>
                <View style={[styles.iconWrap, { backgroundColor: '#FEE2E2' }]}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
                </View>
                <View style={styles.body}>
                  <Text style={styles.dangerTitle}>
                    {deletionRequestedAt ? 'Deletion Requested' : 'Request Account Deletion'}
                  </Text>
                  <Text style={styles.sub}>
                    {deletionRequestedAt ? `Requested on ${new Date(deletionRequestedAt).toLocaleDateString()}` : 'Submit a deletion request for review'}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#EF4444" />
              </View>
            </AppCard>
          </>
        )}
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
  loadingContainer: { paddingVertical: 24 },
  sectionTitle: { color: '#374151', fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 6 },
  card: { borderRadius: 10, padding: 12, marginBottom: 12 },
  dangerCard: { borderRadius: 10, padding: 12, marginBottom: 20 },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#E0E7FF',
  },
  body: { flex: 1 },
  title: { color: '#11181C', fontSize: 13, fontWeight: '700' },
  dangerTitle: { color: '#EF4444', fontSize: 13, fontWeight: '700' },
  sub: { color: '#6B7280', fontSize: 10, marginTop: 2 },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  thresholdInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    flex: 1,
    marginRight: 10,
  },
  thresholdInput: { flex: 1, color: '#11181C', fontSize: 14, fontWeight: '600' },
  percent: { color: '#6B7280', fontWeight: '700' },
  saveBtn: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  disabled: { opacity: 0.6 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  toggleText: { marginLeft: 10, flex: 1 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  dangerRow: { flexDirection: 'row', alignItems: 'center' },
});
