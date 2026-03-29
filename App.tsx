import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: '#007AFF',
              borderBottomWidth: 0,
              elevation: 3,
            },
            headerTitleStyle: {
              color: '#fff',
              fontSize: 18,
              fontWeight: '600',
            },
            headerTintColor: '#fff',
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              paddingBottom: 5,
            },
            tabBarIcon: ({color, size}) => {
              let iconName: string = 'home';

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'GenerateQR') {
                iconName = 'qrcode';
              } else if (route.name === 'Payment') {
                iconName = 'credit-card';
              } else if (route.name === 'Tracker') {
                iconName = 'magnify';
              }

              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
          })}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Dashboard',
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="GenerateQR"
            component={GenerateQRScreen}
            options={{
              title: 'Generate QR',
              tabBarLabel: 'Generate QR',
            }}
          />
          <Tab.Screen
            name="Payment"
            component={PaymentScreen}
            options={{
              title: 'Payment',
              tabBarLabel: 'Payment',
            }}
          />
          <Tab.Screen
            name="Tracker"
            component={TrackerScreen}
            options={{
              title: 'Tracker',
              tabBarLabel: 'Tracker',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
