import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Send, Loader2, Lightbulb, Recycle, Leaf } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "How do I recycle plastic bags?",
  "What items can't go in regular recycling?",
  "How to dispose of electronics safely?",
  "What's the difference between recycling and composting?",
  "How to reduce plastic waste at home?",
  "Are pizza boxes recyclable?",
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your recycling assistant. I can help you with questions about recycling, waste reduction, and environmental sustainability. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert recycling and environmental sustainability assistant. You help people learn about:
              - Proper recycling techniques and guidelines
              - Waste reduction strategies
              - Environmental impact of different materials
              - Sustainable living practices
              - Local recycling programs and options
              - Composting and organic waste management
              - Hazardous waste disposal
              - Circular economy principles
              
              Always provide practical, actionable advice. Be encouraging and educational. If you're unsure about local regulations, suggest checking with local authorities.`,
            },
            {
              role: 'user',
              content: text.trim(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.completion,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MessageCircle size={28} color="#10B981" />
          <View>
            <Text style={styles.headerTitle}>Recycling Assistant</Text>
            <Text style={styles.headerSubtitle}>Ask me anything about recycling!</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
                ]}
              >
                {!message.isUser && (
                  <View style={styles.aiIcon}>
                    <Recycle size={16} color="#10B981" />
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
              <Text style={styles.messageTime}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingBubble}>
                <Loader2 size={20} color="#10B981" />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}

          {messages.length === 1 && (
            <View style={styles.quickQuestionsContainer}>
              <View style={styles.quickQuestionsHeader}>
                <Lightbulb size={20} color="#F59E0B" />
                <Text style={styles.quickQuestionsTitle}>Quick Questions</Text>
              </View>
              <View style={styles.quickQuestionsList}>
                {QUICK_QUESTIONS.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickQuestionButton}
                    onPress={() => handleQuickQuestion(question)}
                  >
                    <Text style={styles.quickQuestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Leaf size={20} color="#10B981" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Ask about recycling, waste reduction, sustainability..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isLoading}
              onSubmitEditing={() => sendMessage(inputText)}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 size={20} color="#FFFFFF" />
              ) : (
                <Send size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageBubble: {
    backgroundColor: '#10B981',
  },
  aiMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  aiIcon: {
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginHorizontal: 4,
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  quickQuestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  quickQuestionsList: {
    gap: 8,
  },
  quickQuestionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  inputIcon: {
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});