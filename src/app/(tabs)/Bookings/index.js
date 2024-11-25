import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, doc, getDocs, onSnapshot, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useRouter } from 'expo-router';
import { UseRegisterService } from '../../hook/useRegisterService';

import CardBooking from '../../../components/CardBooking';
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
  

  const router = useRouter();

  // Function to filter bookings based on search query
  const filteredBookings = bookingData.filter(
    (item) =>
      item.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sitterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sentBookings = bookingDetails.filter((item) => item.role === "petOwner");
  const receivedBookings = bookingDetails.filter((item) => item.role === "petSitter");

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
                status: data.BookingStatus,
                service: data.ServiceDetails?.title || "N/A",
                petName: data.ServiceDetails?.petName || "Unknown",
                date: data.ServiceDetails?.date || "N/A",
                time: data.ServiceDetails?.time || "N/A",
                sitterName: data.sitterName || "Unknown",
                price: data.price || "N/A",
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


      // const fetchData = async (userId, isPetOwner = true) => {
      //   try {
      //     const fieldToQuery = isPetOwner ? "PetOwnerID" : "PetSitterID";
      
      //     console.log("Fetching bookings for:", userId, "as", isPetOwner ? "PetOwner" : "PetSitter");
      
      //     const bookingsQuery = query(
      //       collection(db, "Booking"),
      //       where(fieldToQuery, "==", userId)
      //     );
      
      //     const querySnapshot = await getDocs(bookingsQuery);
      
      //     console.log("Query snapshot size:", querySnapshot.size);
      
      //     const bookings = querySnapshot.docs.map((doc) => ({
      //       id: doc.id, // Firestore document ID
      //       status: doc.data().BookingStatus,
      //       service: doc.data().ServiceDetails?.title || "N/A",
      //       petName: doc.data().ServiceDetails?.petName || "Unknown",
      //       date: doc.data().ServiceDetails?.date || "N/A",
      //       time: doc.data().ServiceDetails?.time || "N/A",
      //       sitterName: doc.data().sitterName || "Unknown",
      //       price: doc.data().price || "N/A",
      //     }));
      
      //     console.log("Fetched bookings:", bookings);
      
      //     setBookingDetails(bookings); // Update state with accumulated bookings
      //   } catch (error) {
      //     console.error("Error fetching data:", error);
      //   }
      // };

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

  return (
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
        <View style={styles.ContainerTitleBookingsCards}>
          <Text>Sent Bookings</Text>
        </View>

        <FlatList
          data={sentBookings}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <CardBooking
                petName={item.petName}
                status={item.status}
                sitterName={item.sitterName}
                date={item.date}
                price={item.price}
                service={item.service}
                currentUserId={currentUser.userId} // Pass current user's ID
                petSitterId={item.PetSitterID}    // Pass Pet Sitter's ID from booking
              />
            </TouchableOpacity>
          )}
        />

        <View style={styles.ContainerTitleBookingsCards}>
          <Text>Received Bookings</Text>
        </View>

        <FlatList
          data={receivedBookings}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <CardBooking
                petName={item.petName}
                status={item.status}
                sitterName={item.sitterName}
                date={item.date}
                price={item.price}
                service={item.service}
                onViewDetailsPress={() => router.push(`/screens/Petsitterprofile?id=${item.id}`)}
                onConfirmPress={() => handleConfirmBooking(item.id)}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* <FlatList
        data={bookingDetails}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.roleTag}>{item.role === "petOwner" ? "Sent" : "Received"}</Text>
            <Text>{item.petName}</Text>
            <Text>{item.status}</Text>
            <Text>{item.service}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      /> */}
      {/* <FlatList
            data={bookingDetails}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>No bookings available.</Text>}
        /> */}
      {/* <FlatList
        data={filteredBookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noResultsText}>No bookings found</Text>}
      /> */}
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
  },



  ContainerTitleBookingsCards:{
    paddingLeft: 12,

    marginBottom: 15,
  },

  noResultsText: {
    textAlign: 'center',
    fontSize: Font_Size.MD,
    color: Colors.GRAY,
    marginTop: 50,
  },
});































