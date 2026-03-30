import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

const MEMBERS = [
  { id: 'sarah-1', name: 'Sarah Johnson', email: 'Sarahjones@gmail.com' },
  { id: 'sarah-2', name: 'Sarah Johnson', email: 'Sarahjones@gmail.com' },
  { id: 'sarah-3', name: 'Sarah Johnson', email: 'Sarahjones@gmail.com' },
  { id: 'sarah-4', name: 'Sarah Johnson', email: 'Sarahjones@gmail.com' },
];

export default function InviteMembersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; type?: string }>();
  const [selectedMember, setSelectedMember] = useState('sarah-3');
  const [isCreating, setIsCreating] = useState(false);

  const circleName = useMemo(() => params.name || 'Kitchen Gas', [params.name]);
  const circleType = useMemo(() => params.type || 'Rental Property', [params.type]);

  const handleCreateCircle = async () => {
    setIsCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    router.replace({
      pathname: './success',
      params: { name: circleName, type: circleType },
    });
    setIsCreating(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Circle</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppCard style={styles.circleCard}>
          <View style={styles.circleIcon}>
            <MaterialCommunityIcons name="account-group" size={22} color={PRIMARY_COLOR} />
          </View>
          <View>
            <Text style={styles.circleName}>{circleName}</Text>
            <Text style={styles.circleType}>{circleType}</Text>
          </View>
        </AppCard>

        <Text style={styles.sectionTitle}>Invite Members (Optional)</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email or phone"
          placeholderTextColor="#9CA3AF"
        />

        {MEMBERS.map((member) => {
          const isSelected = selectedMember === member.id;
          return (
            <AppCard
              key={member.id}
              style={[styles.memberRow, isSelected && styles.memberRowSelected]}
              onPress={() => setSelectedMember(member.id)}
            >
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitials}>SJ</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberEmail}>{member.email}</Text>
              </View>
              <View style={styles.radioOuter}>
                {isSelected ? (
                  <View style={styles.radioSelected}>
                    <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                  </View>
                ) : null}
              </View>
            </AppCard>
          );
        })}

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => router.push('/invite-users/method')}
        >
          <MaterialCommunityIcons name="plus" size={18} color={PRIMARY_COLOR} />
          <Text style={styles.inviteButtonText}>Invite by Email or Phone</Text>
        </TouchableOpacity>

        <View style={styles.footerActions}>
          <AppButton title="Back" variant="secondary" style={styles.actionButton} onPress={() => router.back()} />
          <AppButton
            title="Create Circle"
            style={styles.actionButton}
            onPress={handleCreateCircle}
            loading={isCreating}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  circleType: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 14,
    shadowOpacity: 0,
    elevation: 0,
  },
  memberRowSelected: {
    backgroundColor: '#E0E7FF',
    borderColor: '#C7D2FE',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  memberEmail: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioSelected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  inviteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
