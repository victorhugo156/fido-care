import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, SectionList, Animated, ScrollView } from 'react-native';
import { collection, doc, getDocs, onSnapshot, query, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useRouter } from 'expo-router';
import { UseRegisterService } from '../../hook/useRegisterService';
import { GestureHandlerRootView, Swipeable, RectButton } from 'react-native-gesture-handler';

import CardBookingPetSitter from '../../../components/CardBookingPetSitter';
import CardBookingPetOwner from '../../../components/CardBookingPetOwner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import Font_Size from '../../../constants/Font_Size';

// Example booking data
const bookingData = [
  {
    id: '1',
    petName: 'Max',
    sitterName: 'Stephen',
    date: '21-09-2024',
    service: 'Dog Walking',
    status: 'Confirmed',
    price: 'AU$ 30',
  },
  {
    id: '2',
    petName: 'Bella',
    sitterName: 'Jane Doe',
    date: '03-10-2024',
    service: 'Pet Sitting',
    status: 'Pending',
    price: 'AU$ 35',
  },
  {
    id: '3',
    petName: 'Rocky',
    sitterName: 'John Smith',
    date: '07-10-2024',
    service: 'Two home visits per day',
    status: 'Cancelled',
    price: 'AU$ 30',
  },
];

export default function BookingList() {
  const { currentUser } = UseRegisterService();

  const [bookingDetails, setBookingDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 

  const sentBookings = bookingDetails.filter((item) => item.role === "petOwner");
  const receivedBookings = bookingDetails.filter((item) => item.role === "petSitter");
  // const isPetSitter = currentUser.roles.includes("petSitter");

  const sections = [
    { title: 'Received Bookings', data: receivedBookings },
    { title: 'Sent Bookings', data: sentBookings },
  ].filter(section => section.data && section.data.length > 0); //Display titles only if there is something;
  

  const router = useRouter();

  // Function to filter bookings based on search query
  const filteredBookings = bookingData.filter(
    (item) =>
      item.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sitterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase())
  );



      //Fetching data from the DB
      const fetchData = async (userId, roles) => {
        try {
          const queries = [];
      
          console.log("Fetching bookings for user:", userId, "with roles:", roles);
      
          // Check if user is a PetOwner
          if (roles.includes("petOwner")) {
            const petOwnerQuery = query(
              collection(db, "Booking"),
              where("PetOwnerID", "==", userId)
            );
            queries.push(getDocs(petOwnerQuery));
          }
      
          // Check if user is a PetSitter
          if (roles.includes("petSitter")) {
            const petSitterQuery = query(
              collection(db, "Booking"),
              where("PetSitterID", "==", userId)
            );
            queries.push(getDocs(petSitterQuery));
          }
      
          // Execute all queries in parallel
          const querySnapshots = await Promise.all(queries);
      
          const bookings = [];
      
          querySnapshots.forEach((snapshot, index) => {
            snapshot.forEach((doc) => {
              const data = doc.data();
              bookings.push({
                id: doc.id, // Firestore document ID
                petSitterID: data.PetSitterID,
                ownerID: data.PetOwnerID,
                status: data.BookingStatus,
                service: data.ServiceDetails?.title || "N/A",
                petName: data.ServiceDetails?.petName || "Unknown",
                date: data.ServiceDetails?.date || "N/A",
                time: data.ServiceDetails?.time || "N/A",
                sitterName: data.PetSitterName || "Unknown",
                ownerName: data.PetOwnerName || "Unknown",
                price: data.ServiceDetails?.totalPrice || "N/A",
                role: index === 0 && roles.includes("petOwner") ? "petOwner" : "petSitter", // Mark the role
              });
            });
          });
      
          console.log("Fetched bookings:", bookings);
      
          setBookingDetails(bookings); // Update state with all bookings
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const handleConfirmBooking = async (bookingId) => {
        try {
          // Update the status in the local state
          setBookingDetails((prevBookings) =>
            prevBookings.map((booking) =>
              booking.id === bookingId ? { ...booking, status: "Confirmed" } : booking
            )
          );
      
          // Update the status in Firestore
          const bookingRef = doc(db, "Booking", bookingId);
          await updateDoc(bookingRef, {
            BookingStatus: "Confirmed",
          });
      
          Alert.alert("Success", "Booking has been confirmed!");
        } catch (error) {
          console.error("Error confirming booking:", error);
          Alert.alert("Error", "Failed to confirm the booking.");
        }
      };

  const handleCancelBooking = async (bookingId) => {

    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes', onPress: async () => {
          try {
            // Update the status in the local state
            setBookingDetails((prevBookings) =>
              prevBookings.map((booking) =>
                booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking
              )
            );
            // Update the status in Firestore
            const bookingRef = doc(db, "Booking", bookingId);
            await updateDoc(bookingRef, {
              BookingStatus: "Cancelled",
            });

            Alert.alert("Success", "Booking has been cancled!");
          } catch (error) {
            console.error("Error canceling booking:", error);
            Alert.alert("Error", "Failed to cancel the booking.");
          }
        }
      },
    ]);

  }

  const handleDeleteBooking = async (bookingId) => {

    Alert.alert('Delete Booking', 'Are you sure you want to delete this booking?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes', onPress: async () => {
          try {
            // Delete from Firestore
            await deleteDoc(doc(db, "Booking", bookingId));
            // Update the local state to remove the booking
            setBookingDetails((prevBookings) => prevBookings.filter((item) => item.id !== bookingId));
            console.log(`Booking with ID ${bookingId} deleted successfully.`);
          } catch (error) {
            console.error("Error deleting booking:", error);
            Alert.alert("Error", "Failed to delete booking.");
          }

        }
      },
    ]);
  };
      useEffect(() => {
        console.log("Updated bookingDetails:", bookingDetails);
      }, [bookingDetails]);

      useEffect(() => {
        if (currentUser && currentUser.userId && currentUser.roles) {
          console.log("Fetching bookings for user:", currentUser);
          fetchData(currentUser.userId, currentUser.roles);
        } else {
          console.log("Current user is not set or missing roles.");
        }
      }, [currentUser]);

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

  const handleFunctionTesting = (petID)=>{
    console.log("This is the Pet Sitter ID Testing ----->>>", petID);
  }

  return (
<GestureHandlerRootView style={{ flex: 1 }}>
  <ScrollView style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* Screen Title */}
      <Text style={styles.screenTitle}>Your Bookings</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={Colors.BRIGHT_BLUE} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by pet name, sitter, or service..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Booking List */}
      <View style={styles.BookingsList}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
              <TouchableOpacity>
                {item.role === "petOwner" ? (
                  <CardBookingPetOwner
                    petName={item.petName}
                    status={item.status}
                    sitterName={item.sitterName}
                    ownerName={item.ownerName}
                    date={item.date}
                    price={item.price}
                    service={item.service}
                    onDeletePress={() => {
                      handleDeleteBooking(item.id)
                    }}
                    onViewDetailsPress={() => {
                      router.push({
                        pathname: '/screens/Bookingdetail',
                        params: { bookingDetails: JSON.stringify(item) }, // Pass the whole bookingDetails object
                      });
                    }}
                  />
                ) : (
                  <CardBookingPetSitter
                    petName={item.petName}
                    status={item.status}
                    sitterName={item.sitterName}
                    ownerName={item.ownerName}
                    date={item.date}
                    price={item.price}
                    service={item.service}
                    onDeletePress={() => {
                      handleDeleteBooking(item.id)
                    }}
                    onViewDetailsPress={() => {
                      router.push({
                        pathname: '/screens/Bookingdetail',
                        params: { bookingDetails: JSON.stringify(item) }, // Pass the whole bookingDetails object
                      });
                    }}
                    onConfirmPress={() => handleConfirmBooking(item.id)}
                    onCancelPress={() => handleCancelBooking(item.id)}
                  />
                )}
              </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </ScrollView>
</GestureHandlerRootView>
    
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
    backgroundColor: '#FFF',
  },
  screenTitle: {
    fontSize: Font_Size.XXL,
    fontFamily: Font_Family.BLACK,
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',

    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  listContainer: {
    padding: 16,
  },

  BookingsList:{
    alignItems: "center",
    padding: 0,
  },

  noResultsText: {
    textAlign: 'center',
    fontSize: Font_Size.MD,
    color: Colors.GRAY,
    marginTop: 50,
  },

  sectionHeader: {
    backgroundColor: Colors.GRAY_50,
    padding: 10,
  },
  sectionHeaderText: {
    fontFamily: Font_Family.BOLD,
    fontSize: Font_Size.LG,
    color: Colors.GRAY_700
  },
});































