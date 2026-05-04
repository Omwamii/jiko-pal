import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { invitesApi } from '@/lib/invites';
import { useAuth } from '@/providers/AuthProvider';

const PRIMARY_COLOR = '#3629B7';
const PENDING_INVITE_KEY = 'pendingInviteCode';

export default function InviteLandingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ code?: string }>();
  const code = typeof params.code === 'string' ? params.code : '';

  useEffect(() => {
    if (!code) return;

    const run = async () => {
      try {
        if (!user) {
          await AsyncStorage.setItem(PENDING_INVITE_KEY, code);
          router.replace('/login');
          return;
        }  

        console.log(`In invite, received the user: `, user);

        const result = await invitesApi.accept(code);
        if (result.circle_id) {
          router.replace({ pathname: '/my-circle/circle', params: { circleId: result.circle_id } } as any);
          return;
        }
        router.replace('/(tabs)');
      } catch (err: any) {
        Alert.alert('Invite error', err?.message || 'Unable to accept this invite.');
        router.replace('/(tabs)');
      }
    };

    run();
  }, [code, router, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      <Text style={styles.text}>Opening invite…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  text: { marginTop: 10, color: '#6B7280', fontSize: 12 },
});

