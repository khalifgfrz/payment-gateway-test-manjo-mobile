import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './src/screens/HomeScreen';
import GenerateQRScreen from './src/screens/GenerateQRScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import TrackerScreen from './src/screens/TrackerScreen';

type RootTabParamList = {
  Home: undefined;
  GenerateQR: undefined;
  Payment: undefined;
  Tracker: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarActiveTintColor: '#2563EB',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              paddingTop: 8,
              paddingBottom: 8,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '500',
            },
            tabBarIcon: ({color, size}) => {
              let iconName: string = 'home';

              if (route.name === 'Home') {
                iconName = 'view-dashboard-outline';
              } else if (route.name === 'GenerateQR') {
                iconName = 'qrcode';
              } else if (route.name === 'Payment') {
                iconName = 'credit-card-outline';
              } else if (route.name === 'Tracker') {
                iconName = 'magnify';
              }

              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={color}
                />
              );
            },
          })}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="GenerateQR"
            component={GenerateQRScreen}
            options={{
              tabBarLabel: 'Generate QR',
            }}
          />
          <Tab.Screen
            name="Payment"
            component={PaymentScreen}
            options={{
              tabBarLabel: 'Payment',
            }}
          />
          <Tab.Screen
            name="Tracker"
            component={TrackerScreen}
            options={{
              tabBarLabel: 'Tracker',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
