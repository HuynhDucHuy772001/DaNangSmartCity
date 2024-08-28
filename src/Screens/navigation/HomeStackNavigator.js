import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '../Home/Home';
import ListView from '../Home/LookupArchitecturalPracticeCertificates/ListView';
import DetailView from '../Home/LookupArchitecturalPracticeCertificates/DetailView';
import WeatherScreen from '../Home/Weather/WeatherScreen';
import ListEvents from '../Home/Events/ListEvents';
import EventDetail from '../Home/Events/EventDetail';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="listview"
                component={ListView}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="detailview"
                component={DetailView}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="weatherscreen"
                component={WeatherScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="listevents"
                component={ListEvents}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="eventdetail"
                component={EventDetail}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
