import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Message, PaginatedResponse } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { directChatApi, getDirectWebSocketUrl } from '@/lib/directChat';
import { formatDate } from '@/lib/utils';

const PRIMARY_COLOR = '#3629B7';

export default function MemberChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ memberUserId?: string; memberName?: string }>();
  const memberUserId = typeof params.memberUserId === 'string' ? params.memberUserId : '';
  const memberName = typeof params.memberName === 'string' ? params.memberName : 'Member';

  const { user, tokens } = useAuth();
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!memberUserId) return;
    if (memberUserId === user?.id) return;
    directChatApi
      .createConversation(memberUserId)
      .then((c) => setConversationId(c.id))
      .catch(() => setConversationId(null));
  }, [memberUserId, user?.id]);

  const { data: messagesData, isLoading: msgLoading } = useQuery({
    queryKey: ['directMessages', conversationId],
    queryFn: () => directChatApi.getMessages(conversationId!),
    enabled: !!conversationId,
  });

  const { mutate: sendMessage, isPending: sending } = useMutation({
    mutationFn: (content: string) => directChatApi.sendMessage(conversationId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directMessages', conversationId] });
      setMessage('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    },
  });

  useEffect(() => {
    if (!conversationId || !tokens?.access) return;
    const ws = new WebSocket(getDirectWebSocketUrl(conversationId, tokens.access));
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.conversation === conversationId) {
        queryClient.invalidateQueries({ queryKey: ['directMessages', conversationId] });
      }
    };
    return () => ws.close();
  }, [conversationId, tokens?.access, queryClient]);

  const handleSend = () => {
    if (!message.trim() || !conversationId) return;
    sendMessage(message.trim());
  };

  const messages = (messagesData as PaginatedResponse<Message> | undefined)?.results || [];

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
              <Text style={styles.avatarText}>{(memberName || 'M').charAt(0)}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.title}>{memberName}</Text>
              <Text style={styles.subtitle}>Chat</Text>
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
  title: { color: '#11181C', fontWeight: '700', fontSize: 15 },
  subtitle: { color: '#9CA3AF', fontSize: 10 },
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
  msgBubbleRight: { backgroundColor: PRIMARY_COLOR },
  msgText: { fontSize: 12 },
  msgTextLeft: { color: '#11181C' },
  msgTextRight: { color: '#FFFFFF' },
  msgTime: { marginTop: 3, fontSize: 9, color: '#9CA3AF' },
  msgTimeLeft: { textAlign: 'left' },
  msgTimeRight: { textAlign: 'right' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#11181C',
    marginRight: 10,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

