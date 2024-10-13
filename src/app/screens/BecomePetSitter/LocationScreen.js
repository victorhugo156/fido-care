import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import Colors from '../../../constants/Colors';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const LocationScreen = () => {
  const router = useRouter();
  const { formData } = useLocalSearchParams();
  const [latitude, setLatitude] = useState(-33.8688); // Default location (Sydney)
  const [longitude, setLongitude] = useState(151.2093);
  const [mapRegion, setMapRegion] = useState({
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleLocationSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    setLatitude(lat);
    setLongitude(lng);
    setMapRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleConfirmLocation = () => {
    router.push({
      pathname: '/screens/BecomePetSitter',
      params: {
        formData: {
          ...formData,
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
          locationName: 'Selected Address', // Replace with actual address if needed
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Enter Location"
        onPress={handleLocationSelect}
        query={{
          key: 'AIzaSyBQJUBHGQfNam1-_zUiAFVMYIg8jQ5Vvdo',
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          textInputContainer: styles.input,
          textInput: styles.textInput,
        }}
      />
      <MapView style={styles.map} region={mapRegion}>
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
      <Button title="Confirm Location" onPress={handleConfirmLocation} color={Colors.PRIMARY} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
});

export default LocationScreen;




