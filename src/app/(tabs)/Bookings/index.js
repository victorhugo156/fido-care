import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import { useRouter } from 'expo-router';

// Example booking data
const bookingData = [
  {
    id: '1',
    petName: 'Max',
    sitterName: 'Stephen',
    date: '2024-09-21',
    service: 'Dog Walking',
    status: 'Confirmed',
    price: 'AU$ 30',
  },
  {
    id: '2',
    petName: 'Bella',
    sitterName: 'Jane Doe',
    date: '2024-09-22',
    service: 'Pet Sitting',
    status: 'Pending',
    price: 'AU$ 35',
  },
  {
    id: '3',
    petName: 'Rocky',
    sitterName: 'John Smith',
    date: '2024-09-23',
    service: 'Two home visits per day',
    status: 'Cancelled',
    price: 'AU$ 30',
  },
];

export default function BookingList() {
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const router = useRouter();

  // Function to filter bookings based on search query
  const filteredBookings = bookingData.filter(
    (item) =>
      item.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sitterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to render each booking item
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => router.push(`/screens/Bookingdetail?id=${item.id}`)} // Navigation for the entire item
        style={styles.itemContent}
      >
        <View style={styles.itemHeader}>
          <View style={styles.petNameContainer}>
            <Icon name="pets" size={20} color={Colors.TURQUOISE_GREEN} style={styles.petIcon} />
            <Text style={styles.petName}>{item.petName}</Text>
          </View>
          <View style={[styles.statusContainer, getStatusStyle(item.status)]}>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.sitterName}>Sitter: {item.sitterName}</Text>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Service:</Text>
          <Text style={styles.service}>{item.service}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/screens/Bookingdetail?id=${item.id}`)} // Navigation for "View Details" button
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
        <Icon name="chevron-right" size={16} color={Colors.BRIGHT_BLUE} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Screen Title */}
      <Text style={styles.screenTitle}>Your Bookings</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={Colors.DARK_TEXT} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by pet name, sitter, or service..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Booking List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noResultsText}>No bookings found</Text>}
      />
    </View>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'Confirmed':
      return { backgroundColor: '#4CAF50' };
    case 'Pending':
      return { backgroundColor: '#FFC107' };
    case 'Cancelled':
      return { backgroundColor: '#F44336' };
    default:
      return { backgroundColor: Colors.GRAY };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  screenTitle: {
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.GRAY_200,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.DARK_TEXT,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemContent: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  petNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petIcon: {
    marginRight: 8,
  },
  petName: {
    fontSize: Font_Size.XL,
    fontFamily: Font_Family.BOLD,
    color: Colors.DARK_TEXT,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status: {
    fontSize: Font_Size.SM,
    fontFamily: Font_Family.BOLD,
    color: '#FFFFFF',
  },
  sitterName: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.BOLD,
    marginBottom: 8,
    color: Colors.DARK_TEXT,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
  },
  detailLabel: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.DARK_TEXT,
    marginRight: 6,
  },
  date: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.DARK_TEXT,
  },
  price: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.BOLD,
    color: Colors.DARK_TEXT,
  },
  service: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.DARK_TEXT,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200,
    paddingTop: 16,
  },
  detailsButtonText: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.BOLD,
    color: Colors.BRIGHT_BLUE,
    marginRight: 8,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: Font_Size.MD,
    color: Colors.GRAY,
    marginTop: 50,
  },
});































