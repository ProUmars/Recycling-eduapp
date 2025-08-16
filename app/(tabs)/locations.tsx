import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, Navigation, Phone, Clock, ExternalLink, Battery, Smartphone, Recycle } from 'lucide-react-native';
import * as Location from 'expo-location';

interface RecyclingLocation {
  id: string;
  name: string;
  type: 'general' | 'electronics' | 'batteries' | 'textiles' | 'glass' | 'plastic' | 'hazardous';
  address: string;
  phone?: string;
  hours: string;
  distance?: number;
  acceptedItems: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const LOCATION_TYPES = {
  general: { label: 'General Recycling', icon: '♻️', color: '#10B981' },
  electronics: { label: 'Electronics', icon: '📱', color: '#3B82F6' },
  batteries: { label: 'Batteries', icon: '🔋', color: '#F59E0B' },
  textiles: { label: 'Textiles', icon: '👕', color: '#8B5CF6' },
  glass: { label: 'Glass', icon: '🍾', color: '#06B6D4' },
  plastic: { label: 'Soft Plastics', icon: '🛍️', color: '#EF4444' },
  hazardous: { label: 'Hazardous Waste', icon: '⚠️', color: '#DC2626' },
};

// Mock data - in a real app, this would come from an API
const MOCK_LOCATIONS: RecyclingLocation[] = [
  {
    id: '1',
    name: 'City Recycling Center',
    type: 'general',
    address: '123 Green Street, Downtown',
    phone: '(555) 123-4567',
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
    acceptedItems: ['Paper', 'Cardboard', 'Plastic bottles', 'Aluminum cans', 'Glass bottles'],
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
  },
  {
    id: '2',
    name: 'Best Buy Electronics Recycling',
    type: 'electronics',
    address: '456 Tech Avenue, Mall District',
    phone: '(555) 987-6543',
    hours: 'Mon-Sun: 10AM-9PM',
    acceptedItems: ['Phones', 'Tablets', 'Computers', 'TVs', 'Cables', 'Small appliances'],
    coordinates: { latitude: 40.7589, longitude: -73.9851 },
  },
  {
    id: '3',
    name: 'Battery Plus Bulbs',
    type: 'batteries',
    address: '789 Power Road, Industrial Area',
    phone: '(555) 456-7890',
    hours: 'Mon-Sat: 9AM-7PM',
    acceptedItems: ['Car batteries', 'Phone batteries', 'AA/AAA batteries', 'Rechargeable batteries'],
    coordinates: { latitude: 40.7505, longitude: -73.9934 },
  },
  {
    id: '4',
    name: 'Goodwill Textile Recycling',
    type: 'textiles',
    address: '321 Charity Lane, Residential Area',
    phone: '(555) 234-5678',
    hours: 'Mon-Sat: 9AM-8PM, Sun: 11AM-6PM',
    acceptedItems: ['Clothing', 'Shoes', 'Bedding', 'Curtains', 'Bags'],
    coordinates: { latitude: 40.7282, longitude: -74.0776 },
  },
  {
    id: '5',
    name: 'Glass Recycling Depot',
    type: 'glass',
    address: '654 Crystal Boulevard, Warehouse District',
    hours: 'Tue-Sat: 8AM-5PM',
    acceptedItems: ['Wine bottles', 'Beer bottles', 'Jars', 'Window glass', 'Mirrors'],
    coordinates: { latitude: 40.7614, longitude: -73.9776 },
  },
  {
    id: '6',
    name: 'Plastic Film Drop-off',
    type: 'plastic',
    address: '987 Grocery Plaza, Shopping Center',
    hours: '24/7 (Drop-off bin available)',
    acceptedItems: ['Plastic bags', 'Food wraps', 'Bubble wrap', 'Shipping materials'],
    coordinates: { latitude: 40.7831, longitude: -73.9712 },
  },
];

export default function LocationsScreen() {
  const [locations, setLocations] = useState<RecyclingLocation[]>(MOCK_LOCATIONS);
  const [filteredLocations, setFilteredLocations] = useState<RecyclingLocation[]>(MOCK_LOCATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [searchQuery, selectedType, locations]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'web') {
      // For web, we'll use a mock location
      setUserLocation({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
      calculateDistances();
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        calculateDistances();
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const calculateDistances = () => {
    if (!userLocation) return;

    const updatedLocations = locations.map(location => {
      if (location.coordinates) {
        const distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          location.coordinates.latitude,
          location.coordinates.longitude
        );
        return { ...location, distance };
      }
      return location;
    });

    // Sort by distance
    updatedLocations.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    setLocations(updatedLocations);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filterLocations = () => {
    let filtered = locations;

    if (searchQuery.trim()) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.acceptedItems.some(item => 
          item.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (selectedType) {
      filtered = filtered.filter(location => location.type === selectedType);
    }

    setFilteredLocations(filtered);
  };

  const openMaps = (location: RecyclingLocation) => {
    if (!location.coordinates) {
      Alert.alert('Error', 'Location coordinates not available');
      return;
    }

    const { latitude, longitude } = location.coordinates;
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`,
      web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Unable to open maps application');
      });
    }
  };

  const callLocation = (phone: string) => {
    const url = `tel:${phone}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'electronics': return <Smartphone size={20} color={LOCATION_TYPES[type as keyof typeof LOCATION_TYPES].color} />;
      case 'batteries': return <Battery size={20} color={LOCATION_TYPES[type as keyof typeof LOCATION_TYPES].color} />;
      default: return <Recycle size={20} color={LOCATION_TYPES[type as keyof typeof LOCATION_TYPES].color} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MapPin size={28} color="#10B981" />
          <Text style={styles.headerTitle}>Recycling Locations</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations or items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, !selectedType && styles.filterChipActive]}
          onPress={() => setSelectedType(null)}
        >
          <Text style={[styles.filterText, !selectedType && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {Object.entries(LOCATION_TYPES).map(([key, type]) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterChip, selectedType === key && styles.filterChipActive]}
            onPress={() => setSelectedType(selectedType === key ? null : key)}
          >
            <Text style={styles.filterIcon}>{type.icon}</Text>
            <Text style={[styles.filterText, selectedType === key && styles.filterTextActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <MapPin size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Locations Found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your search or filter criteria.
            </Text>
          </View>
        ) : (
          filteredLocations.map((location) => (
            <View key={location.id} style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <View style={styles.locationInfo}>
                  {getTypeIcon(location.type)}
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationType}>
                      {LOCATION_TYPES[location.type as keyof typeof LOCATION_TYPES].label}
                    </Text>
                  </View>
                </View>
                {location.distance && (
                  <View style={styles.distanceContainer}>
                    <Text style={styles.distance}>{location.distance.toFixed(1)} mi</Text>
                  </View>
                )}
              </View>

              <View style={styles.locationAddress}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.addressText}>{location.address}</Text>
              </View>

              <View style={styles.locationHours}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.hoursText}>{location.hours}</Text>
              </View>

              <View style={styles.acceptedItems}>
                <Text style={styles.acceptedTitle}>Accepted Items:</Text>
                <View style={styles.itemsList}>
                  {location.acceptedItems.map((item, index) => (
                    <View key={index} style={styles.itemChip}>
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.locationActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openMaps(location)}
                >
                  <Navigation size={18} color="#10B981" />
                  <Text style={styles.actionText}>Directions</Text>
                </TouchableOpacity>

                {location.phone && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => callLocation(location.phone!)}
                  >
                    <Phone size={18} color="#10B981" />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    // In a real app, this would open more details
                    Alert.alert('More Info', `More details about ${location.name} would be shown here.`);
                  }}
                >
                  <ExternalLink size={18} color="#10B981" />
                  <Text style={styles.actionText}>More Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    minWidth: 80,
  },
  filterChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterIcon: {
    fontSize: 12,
  },
  filterText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
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
    lineHeight: 24,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationDetails: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  locationType: {
    fontSize: 14,
    color: '#6B7280',
  },
  distanceContainer: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distance: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  locationAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  locationHours: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  hoursText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  acceptedItems: {
    marginBottom: 16,
  },
  acceptedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  itemChip: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  itemText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
});