import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';



function Landing() {

  const navigation = useNavigation();

  const Tab = createBottomTabNavigator()

  const cameraRoute = () => {
    navigation.navigate('Camera')
  }

  const galleryRoute = () => {
    navigation.navigate('Gallery')
  }
  return (
    <>
     <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.textheading}>every glance, you develop a smile on my face. 📷</Text>
      </View>
      <View>
        <Pressable
          onPress={cameraRoute}
          style={styles.button}
        >
          <Text style={styles.textBtn}>Camera</Text>
        </Pressable>
        <Pressable
          onPress={galleryRoute}
          style={styles.button}
        >
          <Text style={styles.textBtn}>Gallery</Text>
        </Pressable>
      </View>
    </SafeAreaView>
   
    </>
   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ab6278'
  },

  heading: {
    margin: 28,
  },
textheading:{
  fontSize: 24,
  fontWeight: 'bold',
  color: '#2c3e50', 
  textAlign: 'center',
},

  text: {
    fontWeight: 500,
    fontsize:18
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: 'black',
    margin: 10,
  },

  textBtn: {
    color: 'white',
  }
})

export default Landing