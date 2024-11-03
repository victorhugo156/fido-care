import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Shared from '../../../components/Shared/index';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import Colors from '../../../constants/Colors';
import Font_Family from '../../../constants/Font_Family';
import MarkFavSitter from '../../../components/MarkFavSitter/index';
import { useRouter } from 'expo-router';

export default function Favorites() {
  const [favList, setFavList] = useState([]);
  const [favPetSitters, setFavPetSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      const favData = await Shared.GetFavList(currentUser.user);
      const favorites = favData?.favorites || [];
      setFavList(favorites);
      await fetchFavoritePetSitters(favorites);
    }
    setLoading(false);
  };

  const fetchFavoritePetSitters = async (favoriteIds) => {
    if (favoriteIds.length === 0) {
      setFavPetSitters([]);
      return;
    }

    try {
      const petSitters = [];
      for (const id of favoriteIds) {
        const sitterDocRef = doc(db, 'PetSitterProfile', id);
        const sitterDocSnap = await getDoc(sitterDocRef);
        if (sitterDocSnap.exists()) {
          petSitters.push({ id: sitterDocSnap.id, ...sitterDocSnap.data() });
        }
      }
      setFavPetSitters(petSitters);
    } catch (error) {
      console.error('Error fetching pet sitters:', error);
    }
  };

  const handleFavoriteToggle = async (petSitterId, isFavorite) => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      setFavPetSitters((prevPetSitters) =>
        isFavorite
          ? prevPetSitters.filter((sitter) => sitter.id !== petSitterId)
          : [...prevPetSitters, favPetSitters.find((sitter) => sitter.id === petSitterId)]
      );

      try {
        if (isFavorite) {
          await Shared.RemoveFromFav(currentUser.user, petSitterId);
        } else {
          await Shared.AddToFav(currentUser.user, petSitterId);
        }
      } catch (error) {
        console.error('Error updating favorites:', error);
        setFavPetSitters((prevPetSitters) =>
          isFavorite
            ? [...prevPetSitters, favPetSitters.find((sitter) => sitter.id === petSitterId)]
            : prevPetSitters.filter((sitter) => sitter.id !== petSitterId)
        );
      }
    }
  };

  const handlePetSitterPress = (petSitter) => {
    router.push(`/screens/Petsitterprofile?id=${petSitter.id}`);
  };

  const renderPetSitterCard = ({ item }) => (
    <Pressable onPress={() => handlePetSitterPress(item)} style={styles.petSitterCard}>
      <Image source={{ uri: item.Avatar }} style={styles.petSitterImage} />
      <View style={styles.petSitterDetails}>
        <Text style={styles.petSitterName}>{item.Name}</Text>
        <View style={styles.locationContainer}>
          <Icon name="map-marker" size={16} color={Colors.GRAY_600} style={styles.locationIcon} />
          <Text style={styles.petSitterLocation}>{item.Location}</Text>
        </View>
      </View>
      <MarkFavSitter
        petSitterId={item.id}
        color="red"
        isFavorite={favList.includes(item.id)}
        onToggleFavorite={() => handleFavoriteToggle(item.id, favList.includes(item.id))}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favourite Pet Sitters</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.TURQUOISE} />
      ) : favPetSitters.length > 0 ? (
        <FlatList
          data={favPetSitters}
          renderItem={renderPetSitterCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noFavoritesText}>You don't have any favourite pet sitters yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SOFT_CREAM,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: Font_Family.BLACK,
    color: Colors.BRIGHT_BLUE,
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  petSitterCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.GRAY_700,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  petSitterImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  petSitterDetails: {
    flex: 1,
  },
  petSitterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TURQUOISE_GREEN,
    fontFamily: Font_Family.REGULAR,
    marginLeft: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  locationIcon: {
    marginRight: 5,
  },
  petSitterLocation: {
    fontSize: 14,
    fontFamily: Font_Family.REGULAR,
    color: "gray",
  },
  noFavoritesText: {
    fontSize: 18,
    fontFamily: Font_Family.BOLD,
    color: Colors.GRAY_600,
    textAlign: 'center',
    marginTop: 30,
  },
});









