import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import  Landing from '../screens/Landing'
import camera from '../screens/Camera'
import Gallery from '../screens/Gallery'

function Tabs() {

    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#f0edf6"
            inactiveColor="#3e2465"
        >
            <Tab.Screen
                name="Home"
                component={Landing}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen 
            name="Camera" 
            component={camera} 
            options={{
                tabBarLabel: 'Camera',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="camera" color={color} size={26} />
                ),
            }}
            />
            <Tab.Screen 
            name="Gallery" 
            component={Gallery} 
            options={{
                tabBarLabel: 'Gallery',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="image" color={color} size={26} />
                ),
            }}
            />
        </Tab.Navigator>
    )
}

export default Tabs