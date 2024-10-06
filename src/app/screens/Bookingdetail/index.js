import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Updated booking data with price and location information
const bookingData = [
  {
    id: '1',
    petName: 'Max',
    sitterName: 'Stephen',
    date: '2024-09-21',
    service: 'Dog Walking',
    status: 'Confirmed',
    price: 'AU$ 30',
    location: 'Sydney Park, Sydney, NSW',
    details: 'Max needs a walk every day for one hour in the morning. Please ensure he is fed and has water available before leaving.',
    sitterAvatar: 'https://media.istockphoto.com/id/1350689855/photo/portrait-of-an-asian-man-holding-a-young-dog.jpg?s=612x612&w=0&k=20&c=Iw0OedGHrDViIM_6MipHmPLlo83O59by-LGcsDPyzwU=',
  },
  {
    id: '2',
    petName: 'Bella',
    sitterName: 'Jane Doe',
    date: '2024-09-22',
    service: 'Pet Sitting',
    status: 'Pending',
    price: 'AU$ 35',
    location: 'Homebush, Sydney, NSW',
    details: 'Bella needs a daily home visit to check on her food and water. She is very friendly and enjoys some light playtime.',
    sitterAvatar: 'https://us.images.westend61.de/0001193741pw/black-woman-holding-dog-in-city-BLEF04793.jpg',
  },
  {
    id: '3',
    petName: 'Rocky',
    sitterName: 'John Smith',
    date: '2024-09-23',
    service: 'Two home visits per day',
    status: 'Cancelled',
    price: 'AU$ 30',
    location: 'Bondi Beach, Sydney, NSW',
    details: 'Rocky requires home visits twice daily for feeding and walking. He tends to bark at strangers, so approach calmly.',
    sitterAvatar: 'https://www.dailypaws.com/thmb/3vRjo6plM5FG2-68rVrK94hDexk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/dachshund-dogs-with-long-snouts-1139706566-2000-1eb6fd444a0e4671be7ea2e0dae9bf79.jpg',
  },
];

const BookingDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const booking = bookingData.find((item) => item.id === id);

  if (!booking) return <Text style={styles.noDataText}>No booking details found.</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={{ uri: booking.sitterAvatar }} style={styles.sitterAvatar} />
        <Text style={styles.sitterName}>{booking.sitterName}</Text>
      </View>

      {/* Booking Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pet Name</Text>
          <Text style={styles.infoValue}>{booking.petName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Service</Text>
          <Text style={styles.infoValue}>{booking.service}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>{booking.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Price</Text>
          <Text style={styles.infoValue}>{booking.price}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{booking.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text
            style={[
              styles.infoValue,
              booking.status === 'Confirmed' ? styles.confirmed : booking.status === 'Pending' ? styles.pending : styles.cancelled,
            ]}
          >
            {booking.status}
          </Text>
        </View>

        <View style={[styles.infoRow, styles.detailsRow]}>
          <Text style={styles.infoLabel}>Details</Text>
          <Text style={styles.infoValue}>{booking.details}</Text>
        </View>
      </View>

      {/* Conditional PayPal Button for Pending Payments */}
      {booking.status === 'Pending' && (
        <TouchableOpacity style={styles.payButton}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/512px-PayPal_logo.svg.png' }}
            style={styles.paypalIcon}
          />
          <Text style={styles.payButtonText}>Pay with PayPal</Text>
        </TouchableOpacity>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => router.push('/screens/Chat')} // Navigate to the chat screen
      >
        <Text style={styles.messageButtonText}>Message Sitter</Text>
        <Icon name="envelope" size={20} color={Colors.WHITE} style={styles.buttonIcon} />
      </TouchableOpacity>

      {/* Rate the Service Button - Shown only if status is "Confirmed" */}
      {booking.status === 'Confirmed' && (
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => router.push(`/screens/Rateservice?id=${booking.id}`)}
        >
          <Text style={styles.rateButtonText}>Rate the Service</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SOFT_CREAM,
    paddingTop: 5,
  },
  noDataText: {
    fontSize: Font_Size.LG,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 50,
    fontFamily: Font_Family.BOLD,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.BRIGHT_BLUE,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  sitterAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  sitterName: {
    fontSize: Font_Size.XL,
    color: Colors.WHITE,
    fontFamily: Font_Family.BOLD,
  },
  infoContainer: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200,
  },
  infoLabel: {
    fontSize: Font_Size.LG,
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_700,
  },
  infoValue: {
    fontSize: Font_Size.MD,
    fontFamily: Font_Family.REGULAR,
    color: Colors.GRAY_600,
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  confirmed: {
    color: Colors.TURQUOISE_GREEN,
    fontFamily: Font_Family.BOLD,
  },
  pending: {
    color: '#FFC107',
    fontFamily: Font_Family.BOLD, 
  },
  cancelled: {
    color: '#F44336',
    fontFamily: Font_Family.BOLD, 
  },
  detailsRow: {
    borderBottomWidth: 0, // Remove bottom border for last row
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BRIGHT_BLUE,
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  messageButtonText: {
    fontSize: Font_Size.LG,
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontFamily: Font_Family.BOLD,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 5,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
    //marginBottom: 5,
  },
  paypalIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  payButtonText: {
    fontSize: Font_Size.LG,
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontFamily: Font_Family.BOLD,
  },

  rateButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: Colors.TURQUOISE_GREEN,
    padding: 15, borderRadius: 10, 
    marginHorizontal: 20, 
    marginBottom: 20 
},
  rateButtonText: { 
    fontSize: Font_Size.LG, 
    color: Colors.WHITE, 
    fontWeight: 'bold', 
    fontFamily: Font_Family.BOLD },
});

export default BookingDetail;






