import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

const activities = [
  {
    id: 'a1',
    title: 'Refill Completed',
    subtitle: 'Kitchen Gas • Ksh. 1500',
    time: '10 minutes ago',
    day: 'today',
    icon: 'check-circle-outline',
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
  },
  {
    id: 'a2',
    title: 'Order Confirmed',
    subtitle: 'Backup Cylinder • Ksh. 1500',
    time: '30 minutes ago',
    day: 'today',
    icon: 'clipboard-check-outline',
    iconColor: '#6D5DD3',
    iconBg: '#EDE9FE',
  },
  {
    id: 'a3',
    title: 'Low Gas Alert',
    subtitle: 'Kitchen Gas at 35%',
    time: '1 hour ago',
    day: 'today',
    icon: 'alert-circle-outline',
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
  },
  {
    id: 'a4',
    title: 'Delivery Completed',
    subtitle: 'Office Gas • Ksh. 1500',
    time: 'Yesterday',
    day: 'earlier',
    icon: 'truck-check-outline',
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
  },
  {
    id: 'a5',
    title: 'Order Confirmed',
    subtitle: 'Kitchen Gas • Ksh. 1500',
    time: '2 days ago',
    day: 'earlier',
    icon: 'clipboard-check-outline',
    iconColor: '#6D5DD3',
    iconBg: '#EDE9FE',
  },
  {
    id: 'a6',
    title: 'Refill Completed',
    subtitle: 'Backup Cylinder • Ksh. 1500',
    time: '3 days ago',
    day: 'earlier',
    icon: 'check-circle-outline',
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
  },
];

export default function RecentActivityScreen() {
  const router = useRouter();
  const today = activities.filter((a) => a.day === 'today');
  const earlier = activities.filter((a) => a.day === 'earlier');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Recent Activity</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>TODAY</Text>
        {today.map((activity) => (
          <AppCard key={activity.id} style={styles.itemCard}>
            <View style={[styles.iconWrap, { backgroundColor: activity.iconBg }]}>
              <MaterialCommunityIcons name={activity.icon as any} size={16} color={activity.iconColor} />
            </View>
            <View style={styles.itemBody}>
              <Text style={styles.itemTitle}>{activity.title}</Text>
              <Text style={styles.itemSubtitle}>{activity.subtitle}</Text>
              <Text style={styles.itemTime}>{activity.time}</Text>
            </View>
          </AppCard>
        ))}

        <Text style={styles.sectionTitle}>EARLIER</Text>
        {earlier.map((activity) => (
          <AppCard key={activity.id} style={styles.itemCard}>
            <View style={[styles.iconWrap, { backgroundColor: activity.iconBg }]}>
              <MaterialCommunityIcons name={activity.icon as any} size={16} color={activity.iconColor} />
            </View>
            <View style={styles.itemBody}>
              <Text style={styles.itemTitle}>{activity.title}</Text>
              <Text style={styles.itemSubtitle}>{activity.subtitle}</Text>
              <Text style={styles.itemTime}>{activity.time}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingTop: 8, paddingBottom: 12 },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
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
  sectionTitle: { color: '#6B7280', fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 6 },
  itemCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  itemBody: { flex: 1 },
  itemTitle: { color: '#11181C', fontSize: 13, fontWeight: '700' },
  itemSubtitle: { color: '#6B7280', fontSize: 10, marginTop: 2 },
  itemTime: { color: '#9CA3AF', fontSize: 9, marginTop: 4 },
});
