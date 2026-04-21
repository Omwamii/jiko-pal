import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#3629B7';

const conversation = [
  { id: 'm1', sender: 'vendor', text: "Did the order form hit your inbox?", time: '09:25 AM' },
  {
    id: 'm2',
    sender: 'user',
    text: "Got it, Mike! Just saw the notification. You're losing at 20 units of the 13kg cylinders",
    time: '09:26 AM',
  },
  { id: 'm3', sender: 'vendor', text: 'Exactly', time: '09:26 AM' },
  {
    id: 'm4',
    sender: 'user',
    text: "I'll make sure your order is at the front of the bed so offloading is quick\n\nsay 8:00 AM?",
    time: '09:26 AM',
  },
  { id: 'm5', sender: 'vendor', text: '8:00 AM works for me', time: '09:25 AM' },
];

export default function VendorChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vendorId?: string; vendorName?: string }>();
  const vendorName = useMemo(() => params.vendorName || 'Vendor', [params.vendorName]);
  const vendorId = useMemo(() => params.vendorId || '', [params.vendorId]);
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#11181C" />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SJ</Text>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.vendorName}>{vendorName}</Text>
              <Text style={styles.onlineText}>Active now</Text>
            </View>
          </View>
          <View style={styles.rightHeader}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons name="phone-outline" size={20} color="#11181C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialCommunityIcons name="video-outline" size={20} color="#11181C" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.chatBody} showsVerticalScrollIndicator={false}>
          {conversation.map((item) => {
            const mine = item.sender === 'vendor';
            return (
              <View key={item.id} style={[styles.msgRow, mine ? styles.msgRight : styles.msgLeft]}>
                {!mine ? (
                  <View style={styles.smallAvatar}>
                    <Text style={styles.smallAvatarText}>SJ</Text>
                  </View>
                ) : null}
                <View style={styles.msgWrap}>
                  {!mine ? <Text style={styles.senderName}>Jhon Abraham</Text> : null}
                  <View style={[styles.msgBubble, mine ? styles.msgBubbleRight : styles.msgBubbleLeft]}>
                    <Text style={[styles.msgText, mine ? styles.msgTextRight : styles.msgTextLeft]}>{item.text}</Text>
                  </View>
                  <Text style={[styles.msgTime, mine ? styles.msgTimeRight : styles.msgTimeLeft]}>{item.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputIcon}>
            <MaterialCommunityIcons name="paperclip" size={18} color="#6B7280" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Write your message"
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.inputIcon}>
            <MaterialCommunityIcons name="sticker-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputIcon}>
            <MaterialCommunityIcons name="camera-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputIcon}>
            <MaterialCommunityIcons name="microphone-outline" size={18} color="#11181C" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  safe: { flex: 1 },
  header: {
    height: 68,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftHeader: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { padding: 6, marginRight: 4 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  vendorName: { color: '#11181C', fontWeight: '700', fontSize: 15 },
  onlineText: { color: '#9CA3AF', fontSize: 10 },
  rightHeader: { flexDirection: 'row' },
  iconBtn: { padding: 6, marginLeft: 6 },
  chatBody: { padding: 12, paddingBottom: 20 },
  msgRow: { flexDirection: 'row', marginBottom: 14 },
  msgLeft: { justifyContent: 'flex-start' },
  msgRight: { justifyContent: 'flex-end' },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 18,
  },
  smallAvatarText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  senderName: { color: '#11181C', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  msgWrap: { maxWidth: '82%' },
  msgBubble: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9 },
  msgBubbleLeft: { backgroundColor: '#FFFFFF' },
  msgBubbleRight: { backgroundColor: PRIMARY_COLOR, alignSelf: 'flex-end' },
  msgText: { fontSize: 11, lineHeight: 15 },
  msgTextLeft: { color: '#4B5563' },
  msgTextRight: { color: '#FFFFFF' },
  msgTime: { fontSize: 9, color: '#9CA3AF', marginTop: 4 },
  msgTimeLeft: { alignSelf: 'flex-start' },
  msgTimeRight: { alignSelf: 'flex-end' },
  inputBar: {
    height: 52,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  inputIcon: { padding: 6 },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 12,
    color: '#11181C',
    fontSize: 12,
    marginHorizontal: 6,
  },
});
