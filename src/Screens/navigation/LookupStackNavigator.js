import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LookupScreen from '../Lookup/BDS/LookupScreen';
import Lookup from '../Lookup/Lookup';
import QRCodeScannerScreen from '../Lookup/ProfileStatus/QRCodeScannerScreen';
import ProfileStatusScreen from '../Lookup/ProfileStatus/ProfileStatusScreen';

const Stack = createStackNavigator();

export default function LookupStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="homelookup"
                component={Lookup}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BDS"
                component={LookupScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="profilestatus"
                component={ProfileStatusScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QRCodeScannerScreen"
                component={QRCodeScannerScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
