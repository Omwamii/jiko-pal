import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Conversation, Message, PaginatedResponse } from '../types';
import { useAuth } from '../providers/AuthProvider';

const PRIMARY_COLOR = '#3629B7';

const getConversation = async (clientId: string) => {
  const res = await api.post<Conversation>('/conversations/', { client_id: clientId });
  return res.data;
};

const getMessages = async (conversationId: string) => {
  const res = await api.get<PaginatedResponse<Message> | Message[]>(`/conversations/${conversationId}/messages/`);
  const data = res.data;
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return data;
};

const sendMessageApi = async ({ conversationId, content }: { conversationId: string; content: string }) => {
  const res = await api.post<Message>(`/conversations/${conversationId}/send_message/`, { content });
  return res.data;
};

export default function VendorCustomerChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ customer?: string; phone?: string; clientId?: string }>();
  const customer = typeof params.customer === 'string' ? params.customer : 'Customer';
  const clientId = typeof params.clientId === 'string' ? params.clientId : '';
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();

  const { user, tokens } = useAuth();

  const { data: conversation, isLoading: convLoading } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => api.get<Conversation>(`/conversations/${conversationId}/`).then(r => r.data),
    enabled: !!conversationId,
  });

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
    if (clientId && !conversationId) {
      getConversation(clientId).then(data => setConversationId(data.id));
    }
  }, [clientId]);

  useEffect(() => {
    if (conversationId && tokens?.access) {
      const baseUrl = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:8000';
      const wsBase = baseUrl.replace(/^http/, 'ws');
      const ws = new WebSocket(`${wsBase}/ws/chat/${conversationId}/?token=${tokens.access}`);

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.conversation === conversationId) {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      };

      return () => ws.close();
    }
  }, [conversationId, tokens?.access]);

  const handleSend = () => {
    if (!message.trim() || !conversationId) return;
    sendMessage({ conversationId, content: message });
  };

  const messages = messagesData?.results || [];
  const isLoading = convLoading || msgLoading;

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
              <Text style={styles.avatarText}>{(customer || 'C').charAt(0)}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.customerName}>{customer}</Text>
              <Text style={styles.onlineText}>Active now</Text>
            </View>
          </View>
        </View>

        {isLoading ? (
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
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
  customerName: { color: '#11181C', fontWeight: '700', fontSize: 15 },
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
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
  sendBtn: {
    backgroundColor: PRIMARY_COLOR,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
