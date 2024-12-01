import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { EXPO_PUBLIC_GOOGLEMAPS_API_KEY } from '@env';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const LocationPicker = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  region,
  setRegion,
  setFieldValue,
  initialLocation,
}) => {
  const [address, setAddress] = useState(initialLocation || '');
  const googlePlacesRef = useRef(null);

  useEffect(() => {
    // Set the initial address value in the GooglePlacesAutocomplete input field
    if (googlePlacesRef.current && initialLocation) {
      googlePlacesRef.current.setAddressText(initialLocation);
      setAddress(initialLocation);
    }

    // Update the region to reflect initial latitude and longitude
    if (latitude && longitude) {
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setFieldValue('location', initialLocation);
    }
  }, [initialLocation, latitude, longitude]);

  const handlePlaceSelect = (data, details) => {
    if (details && details.geometry && details.geometry.location) {
      const { lat, lng } = details.geometry.location;
      setLatitude(lat);
      setLongitude(lng);
      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setFieldValue('location', data.description);

      // update the Google Places field and address state
      setAddress(data.description);
      if (googlePlacesRef.current) {
        googlePlacesRef.current.setAddressText(data.description); // Explicitly update the field
      }
    }
  };

  const handleTextChange = (text) => {
    setAddress(text);
    if (googlePlacesRef.current) {
      googlePlacesRef.current.setAddressText(text); // Explicitly update the field for syncing
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Your Location</Text>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="Search for a location"
        onPress={handlePlaceSelect}
        query={{ key: EXPO_PUBLIC_GOOGLEMAPS_API_KEY, language: 'en' }}
        fetchDetails
        textInputProps={{
          value: address,
          onChangeText: handleTextChange, // Sync address with text input
        }}
        styles={{
          textInput: styles.textInput,
          container: styles.autocompleteContainer,
          listView: styles.listView,
        }}
      />
      <MapView style={styles.map} region={region}>
        {latitude && longitude && <Marker coordinate={{ latitude, longitude }} />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  autocompleteContainer: {
    flex: 0,
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: Colors.GRAY_200,
    fontFamily: Font_Family.REGULAR,
    backgroundColor: '#FFF',
    color: Colors.GRAY_600,
  },
  listView: {
    borderWidth: 1,
    borderColor: Colors.GRAY_200,
    borderRadius: 8,
    marginTop: 5,
  },
  map: {
    height: 200,
    borderRadius: 10,
  },
});

export default LocationPicker;







