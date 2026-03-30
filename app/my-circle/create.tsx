import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

const CIRCLE_TYPES = [
  {
    id: 'home',
    title: 'Home',
    subtitle: 'Family Residence',
    icon: 'home-variant',
    iconBg: '#E0E7FF',
    iconColor: PRIMARY_COLOR,
  },
  {
    id: 'business',
    title: 'Business',
    subtitle: 'Office or workspace',
    icon: 'briefcase-outline',
    iconBg: '#FEF3C7',
    iconColor: '#F59E0B',
  },
  {
    id: 'restaurant',
    title: 'Restaurant',
    subtitle: 'Food Service',
    icon: 'silverware-fork-knife',
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
  },
  {
    id: 'retail',
    title: 'Retail Store',
    subtitle: 'Shop or Store',
    icon: 'storefront-outline',
    iconBg: '#E0E7FF',
    iconColor: PRIMARY_COLOR,
  },
  {
    id: 'rental',
    title: 'Rental Property',
    subtitle: 'Rental Unit',
    icon: 'home-city-outline',
    iconBg: '#E5E7EB',
    iconColor: '#6B7280',
  },
  {
    id: 'other',
    title: 'Other',
    subtitle: 'Custom Location',
    icon: 'map-marker-radius-outline',
    iconBg: '#E5E7EB',
    iconColor: '#6B7280',
  },
];

export default function CreateCircleScreen() {
  const router = useRouter();
  const [circleName, setCircleName] = useState('');
  const [selectedType, setSelectedType] = useState<(typeof CIRCLE_TYPES)[number] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canContinue = circleName.trim().length > 0 && !!selectedType;

  const continueParams = useMemo(() => {
    return {
      name: circleName.trim() || 'Kitchen Gas',
      type: selectedType?.title || 'Rental Property',
    };
  }, [circleName, selectedType]);

  const handleContinue = async () => {
    if (!canContinue) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push({ pathname: './invite', params: continueParams });
    setIsSubmitting(false);
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
        <Text style={styles.label}>Circle Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Eg. ...Family Name, Restaurant Downtown"
          placeholderTextColor="#9CA3AF"
          value={circleName}
          onChangeText={setCircleName}
        />
        <Text style={styles.helperText}>Give your circle a memorable name</Text>

        <Text style={styles.label}>Circle Type *</Text>
        <View style={styles.grid}>
          {CIRCLE_TYPES.map((type) => {
            const isSelected = selectedType?.id === type.id;
            return (
              <AppCard
                key={type.id}
                style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                onPress={() => setSelectedType(type)}
              >
                <View style={[styles.typeIcon, { backgroundColor: type.iconBg }]}>
                  <MaterialCommunityIcons name={type.icon as any} size={26} color={type.iconColor} />
                </View>
                <Text style={styles.typeTitle}>{type.title}</Text>
                <Text style={styles.typeSubtitle}>{type.subtitle}</Text>
              </AppCard>
            );
          })}
        </View>

        {!canContinue ? <Text style={styles.errorText}>Enter circle name and select type to continue.</Text> : null}

        <AppButton title="Continue" onPress={handleContinue} disabled={!canContinue} loading={isSubmitting} />
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  helperText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowOpacity: 0,
    elevation: 0,
  },
  typeCardSelected: {
    borderColor: '#34D399',
    backgroundColor: '#ECFDF5',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#11181C',
  },
  typeSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  errorText: {
    marginBottom: 8,
    color: '#DC2626',
    fontSize: 12,
  },
});
