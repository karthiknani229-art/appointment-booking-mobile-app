import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProviderDetailsScreen from '../screens/ProviderDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, label, focused }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 22 }}>{icon}</Text>
    <Text
      style={{
        fontSize: 10,
        fontWeight: focused ? '700' : '500',
        color: focused ? '#6C63FF' : '#94A3B8',
        marginTop: 2,
      }}
    >
      {label}
    </Text>
  </View>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: 65,
        paddingBottom: 10,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        backgroundColor: '#FFFFFF',
        elevation: 20,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon icon="🏠" label="Home" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Appointments"
      component={AppointmentsScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon icon="📅" label="My Bookings" focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Tabs" component={TabNavigator} />
    <MainStack.Screen name="ProviderDetails" component={ProviderDetailsScreen} />
    <MainStack.Screen name="Booking" component={BookingScreen} />
  </MainStack.Navigator>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6C63FF' }}>
        <Text style={{ fontSize: 48 }}>🏥</Text>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFF', marginTop: 16 }}>MediBook</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppProvider>
          <MainNavigator />
        </AppProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
