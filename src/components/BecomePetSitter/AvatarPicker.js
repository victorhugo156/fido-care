import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AvatarPicker = ({ avatar, setAvatar, setFieldValue }) => {
  useEffect(() => {
    // Set the initial value in Formik if an avatar already exists
    if (avatar) {
      setFieldValue('avatar', avatar);
    }
  }, [avatar]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to set an avatar.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const selectedImageUri = pickerResult.assets[0].uri;
      setAvatar(selectedImageUri);
      setFieldValue('avatar', selectedImageUri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarPlaceholder}>Tap here to select a photo</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    color: '#00aaff',
    fontSize: 16,
  },
});

export default AvatarPicker;

