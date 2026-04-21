import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';

const PRIMARY_COLOR = '#3629B7';

export default function AccountTypeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'client' | 'vendor'>('client');

  const handleContinue = () => {
    console.log('Selected Account Type:', selectedType);
    if (selectedType === 'vendor') {
      router.push('/vendor-dashboard' as Href);
      return;
    }

    router.push({ pathname: '/signup', params: { accountType: 'client' } } as Href);
  };

  const isClient = selectedType === 'client';
  const isVendor = selectedType === 'vendor';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Select Account{'\n'}Type</Text>

        {/* Client Account Card */}
        <TouchableOpacity
          style={[
            styles.card,
            isClient ? styles.cardActive : styles.cardInactive,
          ]}
          onPress={() => setSelectedType('client')}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <View style={styles.illustrationContainer}>
               <MaterialCommunityIcons 
                 name="account" 
                 size={64} 
                 color={isClient ? '#FFFFFF' : PRIMARY_COLOR} 
                 style={{ opacity: 0.8 }}
               />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, { color: isClient ? '#FFFFFF' : '#1F2937' }]}>
                Client Account
              </Text>
              <Text style={[styles.cardSubtitle, { color: isClient ? '#E2E8F0' : '#6B7280' }]}>
                Start monitoring your gas today
              </Text>

              <View style={styles.featureList}>
                <FeatureItem text="Track Gas Levels" isSelected={isClient} />
                <FeatureItem text="Request Refills" isSelected={isClient} />
                <FeatureItem text="Share With Family" isSelected={isClient} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Vendor Account Card */}
        <TouchableOpacity
          style={[
            styles.card,
            isVendor ? styles.cardActive : styles.cardInactive,
          ]}
          onPress={() => setSelectedType('vendor')}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <View style={styles.illustrationContainer}>
               <MaterialCommunityIcons 
                 name="storefront" 
                 size={64} 
                 color={isVendor ? '#FFFFFF' : PRIMARY_COLOR} 
                 style={{ opacity: 0.8 }}
               />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, { color: isVendor ? '#FFFFFF' : '#1F2937' }]}>
                Vendor Account
              </Text>
              <Text style={[styles.cardSubtitle, { color: isVendor ? '#E2E8F0' : '#6B7280' }]}>
                Manage orders & serve customers
              </Text>

              <View style={styles.featureList}>
                <FeatureItem text="Receive Orders" isSelected={isVendor} />
                <FeatureItem text="Manage deliveries" isSelected={isVendor} />
                <FeatureItem text="Track Revenue" isSelected={isVendor} />
              </View>
            </View>
          </View>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ text, isSelected }: { text: string; isSelected: boolean }) {
  return (
    <View style={styles.featureItem}>
      <MaterialCommunityIcons 
        name="check-circle-outline" 
        size={16} 
        color={isSelected ? '#10B981' : '#10B981'} 
        style={styles.featureIcon} 
      />
      <Text style={[styles.featureText, { color: isSelected ? '#E2E8F0' : '#4B5563' }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 32,
    lineHeight: 36,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardActive: {
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardInactive: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardContent: {
    flexDirection: 'row',
  },
  illustrationContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  featureList: {
    marginTop: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureIcon: {
    marginRight: 6,
  },
  featureText: {
    fontSize: 12,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
