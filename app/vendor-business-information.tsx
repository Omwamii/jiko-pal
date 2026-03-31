import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const initialForm = {
  businessRegistrationNumber: 'BN/2024/12345',
  taxPin: 'A123456789X',
  businessDescription: 'Leading gas cylinder distributor serving Nairobi and surrounding areas since 2015. Fast, reliable, and professional service.',
  primaryPhone: '+254 712 345 678',
  alternatePhone: '+254 723 456 789',
  email: 'info@quickgas.co.ke',
  website: 'www.quickgas.co.ke',
  streetAddress: '123 Industrial Area, Nairobi',
  city: 'Nairobi',
  county: 'Nairobi County',
  postalCode: '00100',
  deliveryRadius: '15 km',
};

function Field({ label, value, onChangeText, editable = false, multiline = false }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  editable?: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

export default function VendorBusinessInformationScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initialForm);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Manage your business details</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing((prev) => !prev)} activeOpacity={0.85}>
              <MaterialCommunityIcons name="pencil-outline" size={12} color="#3629B7" />
              <Text style={styles.editText}>{isEditing ? 'Done' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.sheet} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.companyRow}>
          <View style={styles.companyAvatar}><Text style={styles.companyAvatarText}>SJ</Text></View>
          <View>
            <Text style={styles.companyName}>QuickGas Ltd</Text>
            <Text style={styles.companyType}>Distributor</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Basic information</Text>

        <Field
          label="Business Registration Number"
          value={form.businessRegistrationNumber}
          onChangeText={(businessRegistrationNumber) => setForm((prev) => ({ ...prev, businessRegistrationNumber }))}
          editable={isEditing}
        />

        <Field
          label="Tax ID / PIN Number"
          value={form.taxPin}
          onChangeText={(taxPin) => setForm((prev) => ({ ...prev, taxPin }))}
          editable={isEditing}
        />

        <Field
          label="Business Description"
          value={form.businessDescription}
          onChangeText={(businessDescription) => setForm((prev) => ({ ...prev, businessDescription }))}
          editable={isEditing}
          multiline
        />

        <Text style={styles.sectionTitle}>Contact Information</Text>

        <Field
          label="Primary Phone Number"
          value={form.primaryPhone}
          onChangeText={(primaryPhone) => setForm((prev) => ({ ...prev, primaryPhone }))}
          editable={isEditing}
        />

        <Field
          label="Alternate Phone Number"
          value={form.alternatePhone}
          onChangeText={(alternatePhone) => setForm((prev) => ({ ...prev, alternatePhone }))}
          editable={isEditing}
        />

        <Field
          label="Email Address"
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          editable={isEditing}
        />

        <Field
          label="Website (Optional)"
          value={form.website}
          onChangeText={(website) => setForm((prev) => ({ ...prev, website }))}
          editable={isEditing}
        />

        <Text style={styles.sectionTitle}>Business Address</Text>

        <Field
          label="Street Address"
          value={form.streetAddress}
          onChangeText={(streetAddress) => setForm((prev) => ({ ...prev, streetAddress }))}
          editable={isEditing}
        />

        <View style={styles.row2}>
          <View style={{ flex: 1 }}>
            <Field
              label="City"
              value={form.city}
              onChangeText={(city) => setForm((prev) => ({ ...prev, city }))}
              editable={isEditing}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="County"
              value={form.county}
              onChangeText={(county) => setForm((prev) => ({ ...prev, county }))}
              editable={isEditing}
            />
          </View>
        </View>

        <Field
          label="Postal Code"
          value={form.postalCode}
          onChangeText={(postalCode) => setForm((prev) => ({ ...prev, postalCode }))}
          editable={isEditing}
        />

        <Text style={styles.sectionTitle}>Service Areas</Text>
        <View style={styles.tagsRow}>
          {['Nairobi CBD', 'Westlands', 'Kilimani', 'Karen'].map((item) => (
            <View key={item} style={styles.tag}><Text style={styles.tagText}>{item}</Text></View>
          ))}
        </View>

        <Field
          label="Delivery Radius (km)"
          value={form.deliveryRadius}
          onChangeText={(deliveryRadius) => setForm((prev) => ({ ...prev, deliveryRadius }))}
          editable={isEditing}
        />

        {isEditing ? (
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={() => setIsEditing(false)}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3629B7' },
  header: { backgroundColor: '#3629B7' },
  safeHeader: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12 },
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
  headerTitle: { flex: 1, color: '#FFFFFF', fontSize: 32, fontWeight: '700', maxWidth: '68%' },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 10,
    height: 28,
  },
  editText: { color: '#3629B7', fontSize: 10, fontWeight: '700' },
  sheet: {
    flex: 1,
    backgroundColor: '#F3F3F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: { padding: 12, paddingBottom: 24 },
  companyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  companyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  companyAvatarText: { color: '#1F2937', fontSize: 16, fontWeight: '700' },
  companyName: { color: '#11131A', fontSize: 34, fontWeight: '700' },
  companyType: { color: '#8D8EA0', fontSize: 10, marginTop: 1 },
  sectionTitle: { marginTop: 12, marginBottom: 8, color: '#11131A', fontSize: 28, fontWeight: '700' },
  fieldWrap: { marginBottom: 8 },
  fieldLabel: { color: '#11131A', fontSize: 11, fontWeight: '600', marginBottom: 5 },
  input: {
    minHeight: 34,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ECECF3',
    backgroundColor: '#ECEFF3',
    color: '#6B7280',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textArea: { minHeight: 62 },
  row2: { flexDirection: 'row', gap: 8 },
  tagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    borderRadius: 4,
    backgroundColor: '#E2D8FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tagText: { color: '#6B46C1', fontSize: 8, fontWeight: '600' },
  saveButton: {
    marginTop: 14,
    backgroundColor: '#3629B7',
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});
