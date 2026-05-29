import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Conversation, Message, PaginatedResponse } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { formatDate } from '@/lib/utils';

const PRIMARY_COLOR = '#3629B7';

const getConversation = async (vendorId: string) => {
  const conversations = await api.get<{ results: Conversation[] }>('/conversations/');
  const existing = conversations.data.results.find((conv: any) => conv.vendor?.id === vendorId || conv.vendor === vendorId);
  if (existing) return existing;

  const res = await api.post<Conversation>('/conversations/', { vendor_id: vendorId });
  return res.data;
};

const getMessages = async (conversationId: string) => {
  const res = await api.get<PaginatedResponse<Message>>(`/conversations/${conversationId}/messages/`);
  return res.data;
};

const sendMessageApi = async ({ conversationId, content }: { conversationId: string; content: string }) => {
  const res = await api.post<Message>(`/conversations/${conversationId}/send_message/`, { content });
  return res.data;
};

export default function VendorChatScreen() {
  const router = useRouter();
  const { vendorId, vendorName } = useLocalSearchParams<{ vendorId?: string; vendorName?: string }>();
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();
  const { user, tokens } = useAuth();

  const { data: messagesData, isLoading: msgLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
  });

  const { mutate: sendMessage, isPending: sending } = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      setMessage('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    },
  });

  useEffect(() => {
    if (vendorId && !conversationId) {
      getConversation(vendorId).then((data) => setConversationId(data.id));
    }
  }, [vendorId, conversationId]);

  useEffect(() => {
    if (conversationId && tokens?.access) {
      const baseUrl = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:8000';
      const wsBase = baseUrl.replace(/^http/, 'ws');
      const ws = new WebSocket(`${wsBase}/ws/chat/${conversationId}/?token=${tokens.access}`);

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const messageData = data.message || data;
        if (messageData.conversation === conversationId || messageData.conversation_id === conversationId) {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      };

      return () => ws.close();
    }
  }, [conversationId, tokens?.access, queryClient]);

  const handleSend = () => {
    if (!message.trim() || !conversationId) return;
    sendMessage({ conversationId, content: message });
  };

  const messages = messagesData?.results || [];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#11181C" />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(vendorName || 'V').charAt(0)}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.vendorName}>{vendorName || 'Vendor'}</Text>
              <Text style={styles.onlineText}>Active now</Text>
            </View>
          </View>
        </View>

        {msgLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.chatBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((item: Message) => {
              const mine = item.sender.id === user?.id;
              return (
                <View key={item.id} style={[styles.msgRow, mine ? styles.msgRight : styles.msgLeft]}>
                  {!mine ? (
                    <View style={styles.smallAvatar}>
                      <Text style={styles.smallAvatarText}>{item.sender.email.charAt(0).toUpperCase()}</Text>
                    </View>
                  ) : null}
                  <View style={styles.msgWrap}>
                    {!mine ? <Text style={styles.senderName}>{item.sender.email}</Text> : null}
                    <View style={[styles.msgBubble, mine ? styles.msgBubbleRight : styles.msgBubbleLeft]}>
                      <Text style={[styles.msgText, mine ? styles.msgTextRight : styles.msgTextLeft]}>{item.content}</Text>
                    </View>
                    <Text style={[styles.msgTime, mine ? styles.msgTimeRight : styles.msgTimeLeft]}>
                      {/* {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
                      {formatDate(item.created_at, true)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Write your message"
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending || !message.trim()}>
            <MaterialCommunityIcons name="send" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  safe: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  },
  smallAvatarText: { color: '#FFF', fontWeight: '700', fontSize: 11 },
  msgWrap: { maxWidth: '80%' },
  senderName: { color: '#6B7280', fontSize: 10, marginBottom: 4 },
  msgBubble: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  msgBubbleLeft: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  msgBubbleRight: { backgroundColor: PRIMARY_COLOR },
  msgText: { fontSize: 13, lineHeight: 18 },
  msgTextLeft: { color: '#11181C' },
  msgTextRight: { color: '#FFFFFF' },
  msgTime: { fontSize: 9, marginTop: 4 },
  msgTimeLeft: { color: '#9CA3AF' },
  msgTimeRight: { color: '#D1D5DB', textAlign: 'right' },
  inputBar: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    color: '#11181C',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
});

