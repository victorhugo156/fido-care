import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

const { width } = Dimensions.get('window');

// Example Pet Sitter Data
const petSittersData = [
  {
    id: '1',
    name: 'Stephen',
    location: 'Darlinghurst',
    experience: '5+ years of experience',
    rating: 4.5,
    avatar: 'https://media.istockphoto.com/id/1350689855/photo/portrait-of-an-asian-man-holding-a-young-dog.jpg?s=612x612&w=0&k=20&c=Iw0OedGHrDViIM_6MipHmPLlo83O59by-LGcsDPyzwU=',
    services: ['Dog Walking', 'Home Visit'],
    pricePerNight: '120.00 / night',
  },
  {
    id: '2',
    name: 'Jane Doe',
    location: 'Surry Hills',
    experience: '3+ years of experience',
    rating: 4.5,
    avatar: 'https://us.images.westend61.de/0001193741pw/black-woman-holding-dog-in-city-BLEF04793.jpg',
    services: ['Pet Boarding', 'Pet Grooming'],
    pricePerNight: '110.00 / night',
  },
  {
    id: '3',
    name: 'John Smith',
    location: 'Sydney CBD',
    experience: '7+ years of experience',
    rating: 4.9,
    avatar: 'https://www.dailypaws.com/thmb/3vRjo6plM5FG2-68rVrK94hDexk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/dachshund-dogs-with-long-snouts-1139706566-2000-1eb6fd444a0e4671be7ea2e0dae9bf79.jpg',
    services: ['Dog Walking', 'Pet Training'],
    pricePerNight: '130.00 / night',
  },
];

const PetSitterList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const router = useRouter();

  // Filter pet sitters based on search term
  const filteredPetSitters = petSittersData.filter((sitter) =>
    sitter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render individual Pet Sitter Card
  const renderPetSitterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sitterItem}
      onPress={() => router.push(`/screens/Petsitterprofile?id=1`)} // Hardcoded to always show profile with ID = 1 (Stephen)
    >
      {/* Avatar Image */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {/* Rating Information below Avatar */}
        <View style={styles.sitterRatingContainer}>
          <Icon name="star" size={16} color={Colors.TURQUOISE_GREEN} />
          <Text style={styles.sitterRatingText}>{item.rating}</Text>
        </View>
      </View>
      {/* Details */}
      <View style={styles.sitterDetails}>
        <View style={styles.sitterInfo}>
          <Text style={styles.sitterName}>{item.name}</Text>
          <Text style={styles.sitterLocation}>
            <Icon name="map-marker" size={16} color={Colors.PRIMARY} /> {item.location}
          </Text>
        </View>
        <Text style={styles.sitterExperience}>{item.experience}</Text>
        <Text style={styles.sitterServices}>Services: {item.services.join(', ')}</Text>
        {/* Price Information on the right side below services */}
        <Text style={styles.sitterPrice}>{`$${item.pricePerNight}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find the Perfect Pet Sitter</Text>
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} color={Colors.GRAY_700} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      <FlatList
        data={filteredPetSitters}
        keyExtractor={(item) => item.id}
        renderItem={renderPetSitterItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noResultsText}>No pet sitters found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SOFT_CREAM,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginVertical: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: Colors.DARK_TEXT,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  sitterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10, // Added space to the right of the avatar
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  sitterRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  sitterRatingText: {
    fontSize: 14,
    color: Colors.GRAY_700,
    marginLeft: 5,
    fontFamily: Font_Family.REGULAR,
  },
  sitterPrice: {
    fontSize: 14,
    color: Colors.GRAY_600,
    fontWeight: '600',
    fontFamily: Font_Family.BLACK,
    marginTop: 5,    
  },
  sitterDetails: { 
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 15, // Add space between avatar and details
  },
  sitterInfo: {
    flexDirection: 'column',
  },
  sitterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TURQUOISE_GREEN,
    fontFamily: Font_Family.REGULAR,
  },
  sitterLocation: {
    fontSize: 14,
    fontFamily: Font_Family.REGULAR,
    color: "gray",
    marginTop: 5,
  },
  sitterExperience: {
    fontSize: 14,
    color: "gray",
    fontFamily: Font_Family.REGULAR,
    marginVertical: 5,
  },
  sitterServices: {
    fontSize: 14,
    color: "gray",
    fontFamily: Font_Family.REGULAR,
    marginTop: 5,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.GRAY,
    marginTop: 50,
  },
});

export default PetSitterList;







