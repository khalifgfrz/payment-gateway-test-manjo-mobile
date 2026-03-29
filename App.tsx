import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import GenerateQRScreen from './src/screens/GenerateQRScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import TrackerScreen from './src/screens/TrackerScreen';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

const getTabBarIcon = ({focused, color, size, route}: any) => {
  let iconName: string = 'home';

  if (route.name === 'Home') {
    iconName = focused ? 'list' : 'list-outline';
  } else if (route.name === 'GenerateQR') {
    iconName = focused ? 'qr-code' : 'qr-code-outline';
  } else if (route.name === 'Payment') {
    iconName = focused ? 'card' : 'card-outline';
  } else if (route.name === 'Tracker') {
    iconName = focused ? 'search' : 'search-outline';
  }

  return <Ionicons name={iconName as any} size={size} color={color} />;
};

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarIcon: ({focused, color, size}) =>
              getTabBarIcon({focused, color, size, route}),
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopColor: '#e2e8f0',
              borderTopWidth: 1,
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginTop: 5,
            },
          })}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Semua Transaksi'}}
          />
          <Tab.Screen
            name="GenerateQR"
            component={GenerateQRScreen}
            options={{title: 'Generate QR'}}
          />
          <Tab.Screen
            name="Payment"
            component={PaymentScreen}
            options={{title: 'Pembayaran'}}
          />
          <Tab.Screen
            name="Tracker"
            component={TrackerScreen}
            options={{title: 'Tracking'}}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
