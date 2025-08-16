import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Plus, Trash2, Calendar, CheckCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reminder {
  id: string;
  title: string;
  type: 'garbage' | 'recycling' | 'compost' | 'custom';
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  time: string; // HH:MM format
  enabled: boolean;
  nextDate: string;
}

const REMINDER_TYPES = {
  garbage: { label: 'Garbage Collection', icon: '🗑️', color: '#EF4444' },
  recycling: { label: 'Recycling Collection', icon: '♻️', color: '#10B981' },
  compost: { label: 'Compost Collection', icon: '🌱', color: '#F59E0B' },
  custom: { label: 'Custom Reminder', icon: '📅', color: '#8B5CF6' },
};

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const FREQUENCIES = {
  weekly: 'Every week',
  biweekly: 'Every 2 weeks',
  monthly: 'Every month',
};

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    type: 'garbage',
    frequency: 'weekly',
    dayOfWeek: 1,
    time: '08:00',
    enabled: true,
  });

  useEffect(() => {
    loadReminders();
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'web') return;
    Alert.alert(
      'Limited in Expo Go',
      'Push notifications are limited in Expo Go on SDK 53. Reminders will be saved locally, but notifications require a development build.'
    );
  };

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem('binReminders');
      if (stored) {
        setReminders(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = async (updatedReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem('binReminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const calculateNextDate = (dayOfWeek: number, frequency: string): string => {
    const now = new Date();
    const today = now.getDay();
    let daysUntilNext = (dayOfWeek - today + 7) % 7;
    
    if (daysUntilNext === 0) {
      daysUntilNext = frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30;
    }
    
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntilNext);
    return nextDate.toISOString().split('T')[0];
  };

  const scheduleNotification = async (reminder: Reminder) => {
    if (Platform.OS === 'web') {
      console.log(`Reminder scheduled: ${reminder.title} for ${reminder.nextDate} at ${reminder.time}`);
      return;
    }
    
    try {
      // For now, just log the notification scheduling
      // In a real app, you would implement proper notification scheduling
      console.log(`Scheduling notification for ${reminder.title} on ${reminder.nextDate} at ${reminder.time}`);
      
      // You can implement actual notification scheduling here
      // using the expo-notifications API with proper trigger configuration
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const addReminder = async () => {
    if (!newReminder.title?.trim()) {
      Alert.alert('Error', 'Please enter a reminder title.');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      type: newReminder.type as Reminder['type'],
      frequency: newReminder.frequency as Reminder['frequency'],
      dayOfWeek: newReminder.dayOfWeek!,
      time: newReminder.time!,
      enabled: newReminder.enabled!,
      nextDate: calculateNextDate(newReminder.dayOfWeek!, newReminder.frequency!),
    };

    const updatedReminders = [...reminders, reminder];
    await saveReminders(updatedReminders);
    
    if (reminder.enabled) {
      await scheduleNotification(reminder);
    }
    
    setShowAddModal(false);
    setNewReminder({
      type: 'garbage',
      frequency: 'weekly',
      dayOfWeek: 1,
      time: '08:00',
      enabled: true,
    });
  };

  const toggleReminder = async (id: string) => {
    const updatedReminders = reminders.map(reminder => {
      if (reminder.id === id) {
        const updated = { ...reminder, enabled: !reminder.enabled };
        if (updated.enabled) {
          scheduleNotification(updated);
        }
        return updated;
      }
      return reminder;
    });
    
    await saveReminders(updatedReminders);
  };

  const deleteReminder = async (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedReminders = reminders.filter(r => r.id !== id);
            await saveReminders(updatedReminders);
          },
        },
      ]
    );
  };

  const formatNextDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Bell size={28} color="#10B981" />
          <Text style={styles.headerTitle}>Bin Day Reminders</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Reminders Set</Text>
            <Text style={styles.emptyDescription}>
              Add reminders for garbage, recycling, and compost collection days.
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Add First Reminder</Text>
            </TouchableOpacity>
          </View>
        ) : (
          reminders.map((reminder) => {
            const typeInfo = REMINDER_TYPES[reminder.type];
            return (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderHeader}>
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderIcon}>{typeInfo.icon}</Text>
                    <View style={styles.reminderDetails}>
                      <Text style={styles.reminderTitle}>{reminder.title}</Text>
                      <Text style={styles.reminderSubtitle}>
                        {DAYS_OF_WEEK[reminder.dayOfWeek]} at {reminder.time} • {FREQUENCIES[reminder.frequency]}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={reminder.enabled}
                    onValueChange={() => toggleReminder(reminder.id)}
                    trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                    thumbColor={reminder.enabled ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>
                
                <View style={styles.reminderFooter}>
                  <View style={styles.nextDateContainer}>
                    <CheckCircle size={16} color={reminder.enabled ? '#10B981' : '#9CA3AF'} />
                    <Text style={[styles.nextDate, !reminder.enabled && styles.nextDateDisabled]}>
                      Next: {formatNextDate(reminder.nextDate)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Reminder</Text>
            <TouchableOpacity onPress={addReminder}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Reminder Title</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Garbage Collection"
                value={newReminder.title}
                onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Type</Text>
              <View style={styles.typeSelector}>
                {Object.entries(REMINDER_TYPES).map(([key, type]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.typeOption,
                      newReminder.type === key && styles.typeOptionSelected
                    ]}
                    onPress={() => setNewReminder({ ...newReminder, type: key as Reminder['type'] })}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text style={[
                      styles.typeLabel,
                      newReminder.type === key && styles.typeLabelSelected
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.formLabel}>Day</Text>
                <View style={styles.daySelector}>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayOption,
                        newReminder.dayOfWeek === index && styles.dayOptionSelected
                      ]}
                      onPress={() => setNewReminder({ ...newReminder, dayOfWeek: index })}
                    >
                      <Text style={[
                        styles.dayLabel,
                        newReminder.dayOfWeek === index && styles.dayLabelSelected
                      ]}>
                        {day.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.formLabel}>Time</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="08:00"
                  value={newReminder.time}
                  onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Frequency</Text>
              <View style={styles.frequencySelector}>
                {Object.entries(FREQUENCIES).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.frequencyOption,
                      newReminder.frequency === key && styles.frequencyOptionSelected
                    ]}
                    onPress={() => setNewReminder({ ...newReminder, frequency: key as Reminder['frequency'] })}
                  >
                    <Text style={[
                      styles.frequencyLabel,
                      newReminder.frequency === key && styles.frequencyLabelSelected
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  addButton: {
    backgroundColor: '#10B981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reminderDetails: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  reminderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  reminderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextDate: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  nextDateDisabled: {
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalSave: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeSelector: {
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeOptionSelected: {
    backgroundColor: '#EBF8FF',
    borderColor: '#10B981',
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  typeLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  typeLabelSelected: {
    color: '#10B981',
    fontWeight: '600',
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 45,
    alignItems: 'center',
  },
  dayOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dayLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dayLabelSelected: {
    color: '#FFFFFF',
  },
  frequencySelector: {
    gap: 8,
  },
  frequencyOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  frequencyOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  frequencyLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  frequencyLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});