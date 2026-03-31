import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#3629B7';

export default function InviteMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    monitorId?: string;
    fromCircle?: string;
    circleId?: string;
    circleName?: string;
    members?: string;
  }>();
  const [showLink, setShowLink] = useState(false);

  const inviteLink = "https://gasmonitor.app/invite/abcde124";

  const handleCopy = () => {
    // Basic clipboard feedback
    Alert.alert("Link Copied", "The invitation link has been copied to your clipboard.");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Invite Users</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoContent}>
            <MaterialCommunityIcons name="shield-account-outline" size={24} color={PRIMARY_COLOR} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Shared Access</Text>
              <Text style={styles.infoDescription}>
                Invite family members or team members to monitor your gas cylinders. You can set different permission levels for each user.
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Invite Via</Text>

        {/* Invite Methods Container */}
        <View style={styles.methodsContainer}>
          <TouchableOpacity
            style={styles.methodListCard}
            onPress={() =>
              router.push({
                pathname: '/invite-users/email',
                params,
              } as Href)
            }
          >
            <View style={[styles.iconBadge, { backgroundColor: '#E0E7FF' }]}>
              <MaterialCommunityIcons name="email-outline" size={24} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Email Invitation</Text>
              <Text style={styles.methodSubtitle}>Send invite via Email</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.methodListCard}
            onPress={() =>
              router.push({
                pathname: '/invite-users/sms',
                params,
              } as Href)
            }
          >
            <View style={[styles.iconBadge, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="message-text-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>SMS Invitation</Text>
              <Text style={styles.methodSubtitle}>Send invite via text message</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.methodListCard} onPress={() => setShowLink(!showLink)}>
            <View style={[styles.iconBadge, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="share-variant" size={24} color="#10B981" />
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Share link</Text>
              <Text style={styles.methodSubtitle}>Copy and share link</Text>
            </View>
          </TouchableOpacity>

          {showLink && (
            <View style={styles.linkShareContainer}>
              <TextInput 
                style={styles.linkInput} 
                value={inviteLink}
                editable={false}
              />
              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <MaterialCommunityIcons name="content-copy" size={16} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        {/* Shared With Section */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Shared With</Text>
        
        <View style={styles.sharedUserCard}>
          <View style={styles.sharedUserHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SJ</Text>
            </View>
            <View style={styles.sharedUserDetails}>
              <Text style={styles.sharedUserName}>Sarah Johnson</Text>
              <Text style={styles.sharedUserEmail}>sarae.j@email.com</Text>
            </View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialCommunityIcons name="cog-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sharedUserFooter}>
            <Text style={styles.permissionText}>Permission: View only</Text>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Active</Text>
            </View>
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
    paddingTop: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    padding: 24,
  },
  infoCard: {
    backgroundColor: '#E0E7FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  methodsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  methodListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodDetails: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  linkShareContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  linkInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#4B5563',
    marginRight: 8,
  },
  copyButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_COLOR,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sharedUserCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  sharedUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sharedUserDetails: {
    flex: 1,
  },
  sharedUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sharedUserEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sharedUserFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  permissionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTagText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
});
