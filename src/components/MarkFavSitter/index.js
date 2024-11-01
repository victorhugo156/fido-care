import { Pressable, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Shared from './../Shared/index';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const MarkFavSitter = ({ petSitterId, color = 'black', isFavorite: initialIsFavorite, onToggleFavorite }) => {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const fetchUserAndFavorites = async () => {
        try {
          const currentUser = await GoogleSignin.getCurrentUser();
          if (currentUser) {
            setUser(currentUser.user);
            await loadFavorites(currentUser.user);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      fetchUserAndFavorites();
    }, [petSitterId]);

    const loadFavorites = async (currentUser) => {
      const favData = await Shared.GetFavList(currentUser);
      if (favData && favData.favorites) {
        setIsFavorite(favData.favorites.includes(petSitterId));
      }
    };

    const toggleFavorite = async () => {
      if (!user) return;
      
      if (isFavorite) {
        await Shared.RemoveFromFav(user, petSitterId);
        setIsFavorite(false);
        onToggleFavorite && onToggleFavorite(); // Notify parent component
      } else {
        await Shared.AddToFav(user, petSitterId);
        setIsFavorite(true);
        onToggleFavorite && onToggleFavorite(); // Notify parent component
      }
    };

    return (
      <Pressable onPress={toggleFavorite}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={30} color={isFavorite ? "red" : color} />
      </Pressable>
    );
};

export default MarkFavSitter;

