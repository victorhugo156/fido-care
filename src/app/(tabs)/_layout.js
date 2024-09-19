import { View, Text, findNodeHandle } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  return (
   <Tabs
      screenOptions={{
        tabBarActiveTintColor:Colors.PRIMARY,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor:Colors.SOFTCREAM,
          borderTopColor: 'transparent',
          elevation: 0
        }
      }
    }    
      
   >
        <Tabs.Screen name='home' 
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color})=><FontAwesome name="home" size={24} color={color} />
          }}
        
        />
        <Tabs.Screen name='bookings'
          options={{
            title: 'Bookings',
            headerShown: false,
            tabBarIcon: ({color})=><Entypo name="calendar" size={24} color={color} />
          }}
        
        />
        <Tabs.Screen name='inbox' 
          options={{
            title: 'Inbox',
            headerShown: false,
            tabBarIcon: ({color})=><Ionicons name="chatbox" size={24} color={color} />
          }}        
        />
        <Tabs.Screen name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color})=><FontAwesome name="user" size={24} color={color} />
          }}  
        
        />     
        
    </Tabs>

  )
}