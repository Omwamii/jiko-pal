import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useMyCatalogue, useCreateCatalogueItem, useUpdateCatalogueItem, useDeleteCatalogueItem } from '@/hooks/queries';
import { VendorCatalogue } from '@/types';

const PRIMARY_COLOR = '#3629B7';

export default function VendorCatalogueScreen() {
  const router = useRouter();
  const { data: catalogue = [], isLoading, refetch } = useMyCatalogue();
  const createMutation = useCreateCatalogueItem();
  const updateMutation = useUpdateCatalogueItem();
  const deleteMutation = useDeleteCatalogueItem();

  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorCatalogue | null>(null);
  const [form, setForm] = useState({
    cylinder_company: '',
    size: '',
    price: '',
    is_available: true,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [togglingItemId, setTogglingItemId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ cylinder_company: '', size: '', price: '', is_available: true });
    setSelectedImage(null);
    setEditingItem(null);
    setIsAdding(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAdd = () => {
    setForm({ cylinder_company: '', size: '', price: '', is_available: true });
    setSelectedImage(null);
    setEditingItem(null);
    setIsAdding(true);
  };

  const handleEdit = (item: VendorCatalogue) => {
    setEditingItem(item);
    setForm({
      cylinder_company: item.cylinder_company,
      size: item.size.toString(),
      price: item.price.toString(),
      is_available: item.is_available,
    });
    setSelectedImage(item.picture_url);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!form.cylinder_company || !form.size || !form.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const size = parseFloat(form.size);
    const price = parseFloat(form.price);
    
    if (isNaN(size) || size <= 0) {
      Alert.alert('Error', 'Please enter a valid size');
      return;
    }
    
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          data: {
            cylinder_company: form.cylinder_company,
            size,
            price,
            picture: selectedImage,
            is_available: form.is_available,
          },
        });
        Alert.alert('Success', 'Catalogue item updated successfully');
      } else {
        await createMutation.mutateAsync({
          cylinder_company: form.cylinder_company,
          size,
          price,
          picture: selectedImage,
          is_available: form.is_available,
        });
        Alert.alert('Success', 'Catalogue item added successfully');
      }
      resetForm();
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save catalogue item');
    }
  };

  const handleDelete = (item: VendorCatalogue) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${item.cylinder_company} ${item.size}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(item.id);
              Alert.alert('Success', 'Catalogue item deleted successfully');
              refetch();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (item: VendorCatalogue) => {
    setTogglingItemId(item.id);
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        data: { is_available: !item.is_available },
      });
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update availability');
    } finally {
      setTogglingItemId(null);
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
              <Text style={styles.headerTitle}>Catalogue Management</Text>
            </View>
          </SafeAreaView>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
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
            <Text style={styles.headerTitle}>Catalogue Management</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {!isAdding && (
          <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.8}>
            <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Item</Text>
          </TouchableOpacity>
        )}

        {isAdding && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editingItem ? 'Edit Item' : 'Add New Item'}</Text>
            
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Cylinder Company *</Text>
              <TextInput
                style={styles.input}
                value={form.cylinder_company}
                onChangeText={(text) => setForm({ ...form, cylinder_company: text })}
                placeholder="e.g., Total, KGas, Pro Gas"
              />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Size (kg) *</Text>
              <TextInput
                style={styles.input}
                value={form.size}
                onChangeText={(text) => setForm({ ...form, size: text })}
                keyboardType="numeric"
                placeholder="e.g., 6, 13, 50"
              />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Price (KES) *</Text>
              <TextInput
                style={styles.input}
                value={form.price}
                onChangeText={(text) => setForm({ ...form, price: text })}
                keyboardType="numeric"
                placeholder="e.g., 2500"
              />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Cylinder Image (Optional)</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <MaterialCommunityIcons name="camera-plus" size={32} color="#9CA3AF" />
                    <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.fieldLabel}>Available in Stock</Text>
              <TouchableOpacity
                style={[styles.switch, form.is_available && styles.switchActive]}
                onPress={() => setForm({ ...form, is_available: !form.is_available })}
              >
                <View style={[styles.switchKnob, form.is_available && styles.switchKnobActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm} activeOpacity={0.8}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, (createMutation.isPending || updateMutation.isPending) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                activeOpacity={0.8}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>{editingItem ? 'Update' : 'Add'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Your Catalogue Items ({catalogue.length})</Text>

        {catalogue.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="gas-cylinder" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No catalogue items yet</Text>
            <Text style={styles.emptySubtext}>Add your first gas cylinder to the catalogue</Text>
          </View>
        ) : (
          catalogue.map((item) => (
            <View key={item.id} style={styles.catalogueItem}>
              {item.picture_url && (
                <Image source={{ uri: item.picture_url }} style={styles.itemImage} />
              )}
              <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.cylinder_company} {item.size}kg</Text>
                <View style={[styles.availabilityBadge, item.is_available ? styles.availableBadge : styles.unavailableBadge]}>
                    <Text style={styles.availabilityText}>{item.is_available ? 'In Stock' : 'Out of Stock'}</Text>
                  </View>
                </View>
                <Text style={styles.itemPrice}>KES {item.price}</Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleToggleAvailability(item)}
                    activeOpacity={0.8}
                    disabled={togglingItemId === item.id}
                  >
                    {togglingItemId === item.id ? (
                      <ActivityIndicator size="small" color="#6B7280" />
                    ) : (
                      <MaterialCommunityIcons
                        name={item.is_available ? 'eye-off' : 'eye'}
                        size={16}
                        color="#6B7280"
                      />
                    )}
                    <Text style={styles.actionButtonText}>{item.is_available ? 'Mark Unavailable' : 'Mark Available'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(item)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="pencil" size={16} color="#2563EB" />
                    <Text style={[styles.actionButtonText, { color: '#2563EB' }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="delete" size={16} color="#EF4444" />
                    <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingBottom: 16,
  },
  safeHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  fieldWrap: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#2563EB',
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  switchKnobActive: {
    transform: [{ translateX: 20 }],
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  catalogueItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#D1FAE5',
  },
  unavailableBadge: {
    backgroundColor: '#FEE2E2',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 12,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
