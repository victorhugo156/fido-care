import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../../firebaseConfig';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';

const { width } = Dimensions.get('window');

const PetSitterList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [petSitters, setPetSitters] = useState([]);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const fetchPetSitters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'PetSitterProfile'));
        const fetchedPetSitters = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPetSitters(fetchedPetSitters);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pet sitters: ", error);
        setLoading(false);
      }
    };
    fetchPetSitters();
  }, []);

  const filteredPetSitters = petSitters.filter((sitter) =>
    sitter.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPetSitterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sitterItem}
      onPress={() => router.push(`/screens/Petsitterprofile?id=${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.Avatar }} style={styles.avatar} />
        <View style={styles.sitterRatingContainer}>
          <Icon name="star" size={16} color={Colors.TURQUOISE_GREEN} />
          <Text style={styles.sitterRatingText}>{item.Rating}</Text>
        </View>
      </View>
      <View style={styles.sitterDetails}>
        <View style={styles.sitterInfo}>
          <Text style={styles.sitterName}>{item.Name}</Text>
          <Text style={styles.sitterLocation}>
            <Icon name="map-marker" size={16} color={Colors.PRIMARY} /> {item.Location}
          </Text>
        </View>
        <Text style={styles.sitterExperience}>{`${item.Experience} years of experience`}</Text>
        <Text style={styles.sitterServices}>
          Services: {item.Services?.map(service => service.title).join(', ')}
        </Text>
        <Text style={styles.sitterPrice}>{`$${item.Services?.[0]?.price ?? 0} / Hour`}</Text>
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
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        <FlatList
          data={filteredPetSitters}
          keyExtractor={(item) => item.id}
          renderItem={renderPetSitterItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noResultsText}>No pet sitters found</Text>}
        />
      )}
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
    paddingRight: 10,
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
    marginLeft: 15,
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











