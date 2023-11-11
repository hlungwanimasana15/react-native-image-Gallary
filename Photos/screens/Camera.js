import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Image,Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


function camera() {

  const [photo, setPhoto] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
  const [location, setLocation] = useState();

  let cameraRef = useRef('');

  const navigator = useNavigation()

  // Connecting to the SQLite database or opening database
  const db = SQLite.openDatabase('photocollection.db')

  useEffect(() => {

    (async () => {
      const { status: cameraPermission } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaLibraryPermission } = await MediaLibrary.requestPermissionsAsync();

      // Request location permissions here:
      const { status: locationPermission } = await Location.requestForegroundPermissionsAsync();

      setHasCameraPermission(cameraPermission === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission === 'granted');

      // Check if location permission is granted:
      if (locationPermission === 'granted') {
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
      }
    })();

    createImageTable();

  }, [])

  // Handles creating the table in SQLite
  const createImageTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        // 'CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, image_data TEXT, image_url TEXT, )'
        'CREATE TABLE IF NOT EXISTS photocollection (id INTEGER PRIMARY KEY AUTOINCREMENT, image_url TEXT)'
      );
    });
  };

  // Handles the take photo function
  const takePic = async () => {

    if (!cameraRef.current) return;

    const options = {
      quality: 1,
      base64: true,
      exif: false
    }

    try {

      let newPhoto = await cameraRef.current.takePictureAsync(options)

      if (location) {
        console.log('User Location:', location.coords.latitude, location.coords.longitude);
        // You can use location.coords.latitude and location.coords.longitude here.
      }

      setPhoto(newPhoto)
    }
    catch (err) {
      console.log(err)
    }
  }

  const closeCamera = () => {
    navigator.navigate('Welcome')
  }

  if (photo) {
    const sharePic = () => {
      Sharing(photo.uri).then(() => {
        setPhoto('');
      })
    }

    const savePhoto = async () => {

      try {
        const imageUrl = `${photo.uri}`;


        if (location) {

          const { latitude, longitude } = location.coords;

          console.log('User Location:', location.coords.latitude, location.coords.longitude);

          db.transaction((tx) => {
            tx.executeSql(
              // 'INSERT INTO images (image_data, image_url) VALUES (?, ?)',
              'INSERT INTO photocollection (image_url) VALUES (?)',

              // [photo.base64, imageUrl, latitude, longitude],
              [imageUrl],
              (_, results) => {
                if (results.rowsAffected > 0) {
                  console.warn('Image saved successfully.');
                } else {
                  console.warn('Image not saved.');
                }
              }
            );
          });
          setPhoto('');
        }
      }
      catch (err) {
        console.log(err)
      }
    }

    return (
      <SafeAreaView>
        <View style={styles.previewContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.preview} source={photo} />
          </View>
          <View style={styles.optionsBtnContainer}>
          <Button title="Capture" style={styles.optionsBtn} onPress={() => setPhoto('')} />
            <Button title="Share" style={styles.optionsBtn} onPress={sharePic} />
            <Button title="Save" style={styles.optionsBtn} onPress={savePhoto} />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (hasCameraPermission === null || hasMediaLibraryPermission === null) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button
          containerStyle={{
            width: 150,
            marginHorizontal: 40,
            marginVertical: 10,
          }}
          title="Take Photo"
          onPress={takePic}
        />
        <Button
          containerStyle={{
            width: 150,
            marginHorizontal: 15,
            marginVertical: 10,
          }}
          title="Close Camera"
          onPress={closeCamera}
        />
        <StatusBar />
      </View>
    </Camera>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  alertMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  alertMessageText: {
    width: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end',
    marginTop: 550,
  },
  button: {
    margin: 40,
  },
  previewContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: '50%'
  },
  preview: {
    marginHorizontal: '25%',
    width: 200,
    height: 200,
  },
  imageContainer: {
    marginBottom: 30,
  },
  optionsBtnContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  optionsBtn: {
    width: 150,
    margin: 5,
  }
})

export default camera