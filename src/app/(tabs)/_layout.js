import { Image } from 'react-native'
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
<<<<<<< HEAD

            headerStyle:{
              backgroundColor: Colors.TURQUOISE_GREEN,
            },
            headerLeft:()=>(
              <Image
              source={require('../../assets/icons/ArrowLeft.png')}
              />
            ),

            headerTitleAlign: "center",
            
            headerTitle:()=>(
              <Image
              source={require('../../assets/images/fido_logo_cream.png')}
              style={{
                width: 74,
                resizeMode: "contain",
                alignItems: "center"
                
              }}
              />
            ),
            tabBarIcon: ({color})=><FontAwesome name="home" size={24} color={color} />
=======
            title: 'HOME',
            headerShown: false,
            tabBarIcon: ({color})=><FontAwesome name="home" size={32} color={color} />
>>>>>>> 7ccfd57dd1e68e71bf75aee0709b9682b29e7a99
          }}
        
        />
        <Tabs.Screen name='bookings'
          options={{
            title: 'BOOKINGS',
            headerShown: false,
            tabBarIcon: ({color})=><Entypo name="calendar" size={32} color={color} />
          }}
        
        />
        <Tabs.Screen name='inbox' 
          options={{
            title: 'INBOX',
            headerShown: false,
            tabBarIcon: ({color})=><Ionicons name="chatbox" size={32} color={color} />
          }}        
        />
        <Tabs.Screen name='profile'
          options={{
            title: 'PROFILE',
            headerShown: false,
            tabBarIcon: ({color})=><FontAwesome name="user" size={32} color={color} />
          }}  
        
        />     
        
    </Tabs>

  )
}