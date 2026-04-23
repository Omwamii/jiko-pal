import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#3629B7';

export default function SelectDeviceTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ fromCircle?: string; circleId?: string; circleName?: string; members?: string }>();

  const nextParams = {
    fromCircle: params.fromCircle,
    circleId: params.circleId,
    circleName: params.circleName,
    members: params.members,
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Add Monitor</Text>
              <Text style={styles.headerSubtitle}>Step 1: Choose device type</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="target-variant" size={20} color={PRIMARY_COLOR} />
          <View style={styles.infoBoxTextContainer}>
            <Text style={styles.infoBoxTitle}>Connect Your Device</Text>
            <Text style={styles.infoBoxDescription}>
              Select the type of gas monitoring device you want to connect to your account.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Device Type</Text>

        {/* Option: Smart IoT Sensor */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push({ pathname: '/add-monitor/wifi-setup', params: nextParams } as Href)}
        >
          <View style={[styles.iconContainer, { backgroundColor: PRIMARY_COLOR }]}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFF" />
          </View>
          <View style={styles.optionDetails}>
            <Text style={styles.optionTitle}>Smart IoT Sensor</Text>
            <Text style={styles.optionDescription}>Bluetooth or WIFI Enabled gas Sensor</Text>
            <Text style={styles.optionBadgeText}>Real-Time Monitoring</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Option: Manual Entry */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push({ pathname: '/add-monitor/details', params: nextParams } as Href)}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#8B5CF6' }]}>
            <MaterialCommunityIcons name="pencil" size={24} color="#FFF" />
          </View>
          <View style={styles.optionDetails}>
            <Text style={styles.optionTitle}>Manual Entry</Text>
            <Text style={styles.optionDescription}>Track cylinder IoT Device</Text>
            <Text style={styles.optionBadgeText}>Real-Time Monitoring</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Option: NFC Tag */}
        <View style={[styles.optionCard, { opacity: 0.6 }]}>
          <View style={[styles.iconContainer, { backgroundColor: '#E5E7EB' }]}>
            <MaterialCommunityIcons name="nfc" size={24} color="#9CA3AF" />
          </View>
          <View style={styles.optionDetails}>
            <Text style={styles.optionTitle}>NFC Tag</Text>
            <Text style={styles.optionDescription}>Tap phone to cylinder tag</Text>
            <Text style={[styles.optionBadgeText, { color: '#6B7280' }]}>Coming Soon</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>

        {/* Need Help Box */}
        <View style={styles.helpBox}>
          <MaterialCommunityIcons name="help-circle-outline" size={20} color={PRIMARY_COLOR} />
          <View style={styles.helpBoxContent}>
            <Text style={styles.helpBoxTitle}>Need Help?</Text>
            <Text style={styles.helpBoxDescription}>
              Not sure which option to choose? Contact our support team for guidance.
            </Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Support</Text>
              <MaterialCommunityIcons name="arrow-right" size={16} color={PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>
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
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#ECEBFA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoBoxTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoBoxTitle: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  infoBoxDescription: {
    color: '#4B5563',
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionDetails: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  optionBadgeText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  helpBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  helpBoxContent: {
    flex: 1,
    marginLeft: 12,
  },
  helpBoxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  helpBoxDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
});
