import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, doc, getDocs, onSnapshot, query, where, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { UseRegisterService } from '../../hook/useRegisterService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CalendarPicker from '../../../components/Calendar';
import { MultipleSelectList } from 'react-native-dropdown-select-list'

import ServicePicker from '../../../components/SegmentControlMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import MarkFavSitter from '../../../components/MarkFavSitter/index';
import ButtonApply from '../../../components/ButtonApply/idex';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import { UseContextService } from '../../hook/useContextService';
import Font_Size from '../../../constants/Font_Size';

// Skeleton loading component for smoother transitions
const SkeletonProfile = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonHeaderImage} />
    <View style={styles.skeletonInfo}>
      <View style={styles.skeletonText} />
      <View style={styles.skeletonText} />
      <View style={styles.skeletonButton} />
    </View>
  </View>
);

const PetSitterProfile = () => {
  const { id } = useLocalSearchParams();
  const { currentUser } = UseRegisterService();
  const { bookingDetails, setBookingDetails } = UseContextService({
    PetOwnerId: null,
    PetSitterId: null,
    status: null,
    title: null,
    date: null,
    petName: null,
    time: null
  })
  const petSitterId = id;
  //This will get the reference of the bottom sheet
  const bottomSheetRef = useRef(null);


  const router = useRouter();
  const [dropDownMenuselected, setDropDownMenuSelected] = useState([]);
  const [timeText, setTimeText] = useState('Select Your Time');
  const [petName, setPetName] = useState(''); //Modal Options - > For pet's name
  const [dates, setDates] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null); // Modal Options - > For time (morning/afternoon/night)
  const [selectedService, setSelectedService] = useState(null); // Modal Options - > For service
  const [days, setDays] = useState([]); // Modal Options - > For calendar date
  const [petSitter, setPetSitter] = useState(null);
  const [loading, setLoading] = useState(true);
  //const [user, setUser] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  const [petQuantity, setPetQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalSelectedService, setModalSelectedService] = useState(null); // Currently selected service
  const [markedDates, setMarkedDates] = useState({});



  //Modal Controls
  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.present();

  useEffect(() => {
    /*------ Formating Calendar Date ------ */
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0") // Get day and add add zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear();
    const formattedDefaultDate = `${day}/${month}/${year}`;
    setDays([formattedDefaultDate]);

    /*------ END Formating Calendar Date ------ */

    console.log('This is the currentUser in PetSitterProFile ->>>>', currentUser);

    // Function to fetch the pet sitter's profile
    const fetchPetSitter = async () => {
      if (!petSitterId) {
        console.error("Invalid petSitterId:", petSitterId);
        Alert.alert("Error", "Pet sitter ID is not provided.");
        setLoading(false);
        return;
      }
      try {
        // const currentUser = await GoogleSignin.getCurrentUser();
        // if (currentUser) setUser(currentUser.user);

        const docRef = doc(db, "PetSitterProfile", petSitterId);
        const petSitterDoc = await getDoc(docRef);

        if (petSitterDoc.exists()) {
          const petSitterData = petSitterDoc.data();
          setPetSitter({ id: petSitterId, ...petSitterData }); // Include the document ID

          if (petSitterData.Services && petSitterData.Services.length > 0) {
            setSelectedService(petSitterData.Services[0].title); // Default to the first service
            setTotalPrice(parseInt(petSitterData.Services[0].price, 10)); // Initialize price
          }

          // Setting markedDates after setting petSitter to display in the calendar
          if (petSitterData.Availability) {
            const markedDates = petSitterData.Availability.reduce((acc, date) => {
              const [month, day, year] = date.split('/');
              const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              acc[formattedDate] = { selected: true, selectedColor: 'blue' };
              return acc;
            }, {});

          setMarkedDates(markedDates); // Use state to store markedDates
        }

        } else {
          Alert.alert("Error", "Pet sitter not found.");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    // Calling the function to fetch the data
    fetchPetSitter();
  }, [petSitterId]);

  useEffect(() => {

    if (petSitterId) {
      const reviewsRef = collection(db, 'Feedback');
      const q = query(reviewsRef, where('petSitterId', '==', petSitterId));

      const unsubscribeReviews = onSnapshot(q, (querySnapshot) => {
        let totalRating = 0;
        let count = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalRating += data.rating;
          count += 1;
        });

        if (count > 0) {
          setAverageRating((totalRating / count).toFixed(1));
        } else {
          setAverageRating(null);
        }
        setReviewCount(count);
      });

      return () => {
        if (typeof unsubscribeReviews === 'function') {
          unsubscribeReviews();
        }
      };
    }
  }, [petSitterId]);

  /** ---------- BOOKING FUNCTIONS ---------------- */

  const createBookingRequest = async () => {
    if (!currentUser || !currentUser.roles || !currentUser.roles.includes("petOwner")) {
      Alert.alert("Error", "You must be a Pet Owner to create a booking.");
      return;
    }

    if (!petSitter || !petSitter.id) {
      Alert.alert("Error", "Pet sitter information is missing.");
      return;
    }

    if (!days || days.length === 0) {
      Alert.alert("Error", "Please select at least one date for the booking.");
      return;
  }

    const bookingData = {
      PetOwnerID: currentUser.userId,
      PetSitterID: petSitter.id,
      BookingStatus: "Pending",
      PetSitterName: petSitter.Name,
      PetOwnerName: currentUser.name,
      ServiceDetails: {
        title: selectedService,
        date: days,
        time: selectedTime,
        petName: petName,
        totalPrice: totalPrice
      },
    };

    console.log("Booking data being sent:", bookingDetails);
    console.log("Pet Sitter Name and Current User name --->>>:", petSitter, currentUser.name,)
    try {
      await addDoc(collection(db, "Booking"), bookingData);
      Alert.alert("Success", "Booking request sent.");
      router.push("Bookings");
    } catch (error) {
      console.error("Error creating booking request:", error);
      Alert.alert("Error", "Failed to create booking.");
    }
  };

  const handleDateValue = (selectedDates) => {
    // Extract date keys (e.g., "2024-12-05") from selectedDates
    const selectedDateKeys = Object.keys(selectedDates);
    setDays(selectedDateKeys)
    setBookingDetails((prevDetails) => ({
      ...prevDetails, // Spread previous booking details
      date: selectedDateKeys, // Add or update the date field
  }));
  console.log("Selected dates for booking:", selectedDateKeys);
  console.log("Updated booking details:", bookingDetails);

  }

  const handleTestFunction = () => {

    //console.log("The dates Selectes are: ", dates)

    // console.log("The dates Selectes are: ", days);
    // console.log("The Time Selectes are: ", timeText);
    // console.log("The Service Selectes are: ", dropDownMenuselected);
    // console.log("The Pet Name Selectes are: ", petName);

    console.log("Pet Sitter Name and Current User name --->>>:", petSitter.Name, currentUser.name,)

  }

  /** ---------- END BOOKING FUNCTIONS ---------------- */

  const handleChatNavigation = async () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to start a chat");
      return;
    }

    try {
      const chatsQuery = query(
        collection(db, 'Chat'),
        where('userIds', 'array-contains', user.email)
      );

      const chatsSnapshot = await getDocs(chatsQuery);
      let existingChat = null;

      chatsSnapshot.forEach((chatDoc) => {
        const chatData = chatDoc.data();
        if (chatData.userIds.includes(petSitter.email)) {
          existingChat = { id: chatDoc.id, ...chatData };
        }
      });

      if (existingChat) {
        router.push(`/Chat?id=${existingChat.id}`);
      } else {
        const chatRef = await addDoc(collection(db, 'Chat'), {
          userIds: [user.email, petSitter.email],
          users: [
            { email: user.email, name: user.name, avatar: user.photo },
            { email: petSitter.email, name: petSitter.Name, avatar: petSitter.Avatar },
          ],
          createdAt: new Date(),
        });
        router.push(`/Chat?id=${chatRef.id}`);
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
      Alert.alert("Error", "Failed to initiate chat. Please try again.");
    }
  };

  const handleNavigateToReviews = () => {
    if (petSitterId) {
      router.push(`/screens/Reviews?id=${petSitterId}`);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.PRIMARY} />;
  }

  if (!petSitter) {
    return <SkeletonProfile />;
  }

  //Function Inside Modal to select pet quantity
  const handleNext = (servicePrice) => {
    setPetQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1; // Increment pet quantity
      console.log("New Pet Quantity:", newQuantity);
  
      // Update total price
      setTotalPrice((prevPrice) => {
        const additionalCost = (newQuantity - 1) * 10; // Extra cost for additional pets
        const updatedTotalPrice = parseInt(servicePrice, 10) + additionalCost;
        console.log("Updated Total Price:", updatedTotalPrice);
        return updatedTotalPrice;
      });
  
      return newQuantity;
    });
  };
  
  //This function is the back Pet
  const handlePrevious = (servicePrice) => {
    setPetQuantity((prevQuantity) => {
      if (prevQuantity <= 1) {
        console.log("Cannot decrease below 1 pet. Resetting to initial price.");
        setTotalPrice(parseInt(servicePrice, 10)); // Reset to initial price
        return 1;
      }
  
      const newQuantity = prevQuantity - 1; // Decrement pet quantity
      console.log("New Pet Quantity:", newQuantity);
  
      // Update total price
      setTotalPrice((prevPrice) => {
        const additionalCost = (newQuantity - 1) * 10; // Extra cost for additional pets
        const updatedTotalPrice = parseInt(servicePrice, 10) + additionalCost;
        console.log("Updated Total Price:", updatedTotalPrice);
        return updatedTotalPrice;
      });
  
      return newQuantity;
    });
  };
  

  const handleServiceChange = (serviceTitle) => {
    // Find the selected service in petSitter.Services
    const selected = petSitter.Services.find(service => service.title === serviceTitle);
  
    if (selected) {
      setSelectedService(selected.title); // Update the selected service
      setTotalPrice(parseInt(selected.price, 10)); // Update total price
    }
  };

  const handleDateCalendar = (dates) => {
    setDates(dates);
    console.log("The dates Selectes are: ", dates)

}


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.headerImageContainer}>
          <Image source={{ uri: petSitter.Avatar }} style={styles.headerImage} />
          <View style={styles.imageOverlay}>
            <MarkFavSitter petSitterId={petSitterId} color={Colors.CORAL_PINK} />
            <TouchableOpacity style={styles.imageButton}>
              <Ionicons name="share-outline" size={20} color={Colors.CORAL_PINK} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileInfoContainer}>
          <Text style={styles.sitterName}>{petSitter.Name}</Text>
          <Text style={styles.location}>{petSitter.Location}</Text>
          <TouchableOpacity style={styles.ratingContainer} onPress={handleNavigateToReviews}>
            <Ionicons name="star" size={16} color={Colors.CORAL_PINK} />
            <Text style={styles.ratingText}>
              {averageRating ? `${averageRating} / 5` : 'N/A'}
            </Text>
            <Text style={styles.reviewCount}>
              ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.button, styles.meetButton]} onPress={handleChatNavigation}>
            <Text style={styles.buttonText}>MEETING PET SITTER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.messageButton]} onPress={handleChatNavigation}>
            <Text style={styles.buttonText}>MESSAGE PET SITTER</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ABOUT ME</Text>
          <Text style={styles.aboutText} numberOfLines={showFullText ? undefined : 3}>
            {petSitter.About}
          </Text>
          <TouchableOpacity onPress={() => setShowFullText(!showFullText)}>
            <Text style={styles.readMoreText}>{showFullText ? 'Read Less' : 'Read More'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SERVICES</Text>
          {petSitter.Services && petSitter.Services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.servicePrice}>AU${service.price} / hour</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainerAvailability}>
          <Text style={styles.sectionTitle}>AVAILABILITY</Text>

          <View style={styles.availabilityCalendar}>
            {markedDates ? (
              <CalendarPicker
                markedDates={markedDates} // Highlight available dates
                isReadOnly={true} // Disable user interaction
                handleDate={() => { }} // No-op since it's read-only
              />
            ) : (
              <Text style={styles.errorText}>No availability data found.</Text>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          {petSitter.Skills && petSitter.Skills.map((skill, index) => (
            <Text key={index} style={styles.skillText}>✔️ {skill}</Text>
          ))}
        </View>

        <ButtonApply bgColor={Colors.CORAL_PINK} btnTitle={"Book"} onPress={()=>{
          if(currentUser.name){
            handleOpenPress()
          }else{
            Alert.alert("You have To finish your register");
            router.push('screens/PersonalDetails');
          }

        }} />
      </ScrollView>
      {/*-------------- Modal ------------------- */}

      <CustomBottomSheet ref={bottomSheetRef} snapPointsStart={3}>
        <ScrollView style={{ flex: 1 }} >
          <View style={styles.containerModal}>
            <View style={styles.containerModalCalendar}>
              <Text style={styles.modalTitles}>Select the Date</Text>
              <CalendarPicker
                markedDates={markedDates}
                handleDate={handleDateValue}
              />
            </View>

            <View style={styles.containerModalTime}>
              <Text style={styles.modalTitles}>Select the TIME</Text>
              <ServicePicker
                values={["Morning", "Afternoon", "Night"]}
                onValueChange={(time) => setSelectedTime(time)}
              />
            </View>


            <View style={styles.containerModalService}>
              <Text style={styles.modalTitles}>Current Services Provided</Text>
              <ServicePicker
                values={petSitter?.Services?.map((service) => service.title) || []} // Extracting titles from Services
                onValueChange={handleServiceChange}
              />
            </View>

            <View style={styles.containerModalPetName}>
              <Text style={styles.modalTitles}>What is your Pet name?</Text>
              <TextInput
                style={styles.inputPetName}
                placeholder="Pet Name"
                value={petName}
                onChangeText={setPetName}
              // value={petName}
              />
            </View>

            <View style={styles.containerModalPetQuantity}>
              <Text style={styles.modalTitles}>How many Pets: </Text>
              <View style={styles.ContainerSwapper}>
                <TouchableOpacity onPress={()=>{handlePrevious(petSitter.Services[0].price)}}>
                  <Image style={styles.BtnControlMinus} source={require("../../../assets/icons/btn_minus.png")} />
                </TouchableOpacity>

                <View style={styles.ContainerDataDisplay}>
                  <Text style={styles.InfoData}>{petQuantity}</Text>
                </View>


                  <TouchableOpacity onPress={() => handleNext(petSitter.Services[0].price)}>
                    <Image style={styles.BtnControlPlus} source={require("../../../assets/icons/btn_plus.png")} />
                  </TouchableOpacity>
              </View>
            </View>

            <View style={styles.containerModalTotalPrice}>
              <Text style={styles.modalTitles}>Total:</Text>
              <View style={styles.serviceItem}>
                <Text style={styles.totalPrice}>AU${totalPrice} / hour</Text>
              </View>
            </View>
          </View>
          <ButtonApply bgColor={Colors.CORAL_PINK} btnTitle={"Send Booking"} onPress={createBookingRequest} />
        </ScrollView>

      </CustomBottomSheet>
    </GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({

  /*-------------- Modal Style ------------------- */

  containerModal: {
    flexGrow: 1,

    padding: 20,
  },

  modalTitles: {
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_700,
    fontSize: Font_Size.LG

  },
  containerModalCalendar: {
    marginBottom: 30

  },

  containerModalPetName: {
    height: 90,

    justifyContent: "space-between",

    marginBottom: 30
  },

  inputPetName: {
    backgroundColor: Colors.GRAY_50,

    width: "100%",

    padding: 10,

    borderRadius: 5
  },

  containerModalService: {
    height: 70,

    justifyContent: "space-between",

    marginBottom: 30
  },

  containerModalTime: {
    height: 70,

    justifyContent: "space-between",

    marginBottom: 30
  },

  containerModalPetQuantity: {
    width: "100%",
    height: 70,

    flexDirection: "row",
    alignItems: "center",
    gap: 20,

    marginBottom: 20

  },

  ContainerSwapper: {
    width: 120,
    height: 170,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"

  },
  ContainerDataDisplay: {
    alignItems: "center",
    gap: 5

  },

  InfoData:{
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_700,
    fontSize: Font_Size.LG

  },

  BtnControlMinus: {
    width: 28,
    height: 28,
    resizeMode: "contain"
  },
  BtnControlPlus: {
    width: 33,
    height: 33,
    resizeMode: "contain"
  },

  containerModalTotalPrice:{
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  
  totalPrice:{
    fontFamily: Font_Family.BLACK,
    color: Colors.GRAY_700,
    fontSize: Font_Size.LG

  },


  /*-------------- End Modal Style ------------------- */
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerImageContainer: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
  profileInfoContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sitterName: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY,
  },
  location: {
    fontSize: 18,
    color: Colors.GRAY,
    fontFamily: Font_Family.REGULAR,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: Font_Family.BOLD,
    color: Colors.CORAL_PINK,
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: Font_Family.BOLD,
    color: Colors.CORAL_PINK,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
  meetButton: {
    backgroundColor: Colors.TURQUOISE_GREEN,
  },
  messageButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Font_Family.BOLD,
  },
  sectionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  sectionContainerAvailability:{


    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',

  },

  availabilityCalendar: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: Colors.GRAY_700,
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: Font_Family.REGULAR,
  },
  readMoreText: {
    fontSize: 16,
    color: Colors.GRAY_700,
    fontFamily: Font_Family.BOLD,
    marginTop: 5,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: Font_Family.REGULAR,
    color: Colors.BOLD,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },


  calendarText: {
    color: '#999',
  },
  skillText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
    fontFamily: Font_Family.REGULAR,
  },
  skeletonContainer: {
    padding: 20,
  },
  skeletonHeaderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  skeletonInfo: {
    marginTop: 15,
    alignItems: 'center',
  },
  skeletonText: {
    width: '60%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 5,
  },
  skeletonButton: {
    width: '40%',
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default PetSitterProfile;









