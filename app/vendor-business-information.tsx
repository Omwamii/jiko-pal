import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVendorProfile, VendorProfile } from '@/hooks/vendor';

const initialForm: Partial<VendorProfile> = {
  business_registration_number: '',
  tax_pin: '',
  business_description: '',
  primary_phone: '',
  alternate_phone: '',
  website: '',
  street_address: '',
  city: '',
  county: '',
  postal_code: '',
  delivery_radius: 15,
};

function Field({ label, value, onChangeText, editable = false, multiline = false, keyboardType = 'default' }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  editable?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
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
        keyboardType={keyboardType}
      />
    </View>
  );
}

export default function VendorBusinessInformationScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { profile, isLoading, fetchProfile, updateProfile } = useVendorProfile();
  const [form, setForm] = useState<Partial<VendorProfile>>(initialForm);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setForm({
        business_registration_number: profile.business_registration_number || '',
        tax_pin: profile.tax_pin || '',
        business_description: profile.business_description || '',
        primary_phone: profile.primary_phone || '',
        alternate_phone: profile.alternate_phone || '',
        website: profile.website || '',
        street_address: profile.street_address || '',
        city: profile.city || '',
        county: profile.county || '',
        postal_code: profile.postal_code || '',
        delivery_radius: profile.delivery_radius || 15,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    console.log('Saving profile:', form);
    try {
      await updateProfile(form);
      Alert.alert('Success', 'Business information updated successfully');
    } catch (err: any) {
      console.error('Save error:', err);
      Alert.alert('Error', err?.message || 'Failed to update business information');
    }
  };

  if (isLoading) {
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
            </View>
          </SafeAreaView>
        </View>
        <View style={[styles.sheet, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#3629B7" />
        </View>
      </View>
    );
  }

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

      {isLoading ? (
        <View style={[styles.sheet, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#3629B7" />
        </View>
      ) : (
        <ScrollView style={styles.sheet} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.companyRow}>
            <View style={styles.companyAvatar}>
              <Text style={styles.companyAvatarText}>
                {profile?.company_name ? profile.company_name.slice(0, 2).toUpperCase() : 'VC'}
              </Text>
            </View>
            <View>
              <Text style={styles.companyName}>{profile?.company_name || 'Your Company'}</Text>
              <Text style={styles.companyType}>Distributor</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Basic information</Text>

          <Field
            label="Business Registration Number"
            value={form.business_registration_number || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, business_registration_number: v }))}
            editable={isEditing}
          />

          <Field
            label="Tax ID / PIN Number"
            value={form.tax_pin || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, tax_pin: v }))}
            editable={isEditing}
          />

          <Field
            label="Business Description"
            value={form.business_description || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, business_description: v }))}
            editable={isEditing}
            multiline
          />

          <Text style={styles.sectionTitle}>Contact Information</Text>

          <Field
            label="Primary Phone Number"
            value={form.primary_phone || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, primary_phone: v }))}
            editable={isEditing}
            keyboardType="phone-pad"
          />

          <Field
            label="Alternate Phone Number"
            value={form.alternate_phone || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, alternate_phone: v }))}
            editable={isEditing}
            keyboardType="phone-pad"
          />

          <Field
            label="Website (Optional)"
            value={form.website || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, website: v }))}
            editable={isEditing}
          />

          <Text style={styles.sectionTitle}>Business Address</Text>

          <Field
            label="Street Address"
            value={form.street_address || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, street_address: v }))}
            editable={isEditing}
          />

          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <Field
                label="City"
                value={form.city || ''}
                onChangeText={(v) => setForm((prev) => ({ ...prev, city: v }))}
                editable={isEditing}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="County"
                value={form.county || ''}
                onChangeText={(v) => setForm((prev) => ({ ...prev, county: v }))}
                editable={isEditing}
              />
            </View>
          </View>

          <Field
            label="Postal Code"
            value={form.postal_code || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, postal_code: v }))}
            editable={isEditing}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Service Areas</Text>
          <View style={styles.tagsRow}>
            {form.city ? <View style={styles.tag}><Text style={styles.tagText}>{form.city}</Text></View> : null}
          </View>

          <Field
            label="Delivery Radius (km)"
            value={String(form.delivery_radius || 15)}
            onChangeText={(v) => setForm((prev) => ({ ...prev, delivery_radius: parseInt(v) || 15 }))}
            editable={isEditing}
            keyboardType="numeric"
          />

          {isEditing ? (
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  sectionTitle: { marginTop: 12, marginBottom: 8, color: '#11131A', fontSize: 22, fontWeight: '700' },
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