import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomeStackNavigator from "./HomeStackNavigator";
import Discover from "../Discover/Discover";
import { Image } from "react-native";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Introduction from "../Introduction/Introduction";
import Account from "../Account/Account";
import { theme } from "../../constants/theme";
import { hp } from "../../helpers/common";
import LookupStackNavigator from "./LookupStackNavigator";

const Tab = createBottomTabNavigator();

function getTabBarVisibility(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'home';
    return !(routeName === 'listview' || routeName === 'detailview' ||
        routeName === 'weatherscreen' || routeName === 'BDS' ||
        routeName === 'listevents' || routeName === 'eventdetail' ||
        routeName === 'profilestatus' || routeName === 'QRCodeScannerScreen'
    );
}

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    display: getTabBarVisibility(route) ? 'flex' : 'none',
                    height: hp(10),
                    backgroundColor: 'white',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute',
                },
            })}
        >
            <Tab.Screen
                name="homestack"
                component={HomeStackNavigator}
                options={{
                    title: "Trang chủ",
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={require("../../assets/images/home.png")}
                            style={{ height: hp(4.6), width: hp(4.6), tintColor: color }}
                        />
                    ),
                    tabBarLabelStyle: {
                        fontSize: hp(2),
                        marginBottom: "5%"
                    },
                    tabBarActiveTintColor: theme.colors.main
                }}
            />
            <Tab.Screen
                name="Discover"
                component={Discover}
                options={{
                    title: "Khám phá",
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={require("../../assets/images/4-rounded-squares.png")}
                            style={{ height: hp(3.5), width: hp(3.5), tintColor: color }}
                        />
                    ),
                    tabBarLabelStyle: {
                        fontSize: hp(2),
                        marginBottom: "5%"
                    },
                    tabBarActiveTintColor: theme.colors.main
                }}
            />
            <Tab.Screen
                name="Lookup"
                component={LookupStackNavigator}
                options={{
                    title: "Tra cứu",
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={require("../../assets/images/search1.png")}
                            style={{ height: hp(4.6), width: hp(4.6), tintColor: color }}
                        />
                    ),
                    tabBarLabelStyle: {
                        fontSize: hp(2),
                        marginBottom: "5%"
                    },
                    tabBarActiveTintColor: theme.colors.main
                }}
            />
            <Tab.Screen
                name="Introduction"
                component={Introduction}
                options={{
                    title: "Giới thiệu",
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={require("../../assets/images/link.png")}
                            style={{ height: hp(4.4), width: hp(4.4), tintColor: color }}
                        />
                    ),
                    tabBarLabelStyle: {
                        fontSize: hp(2),
                        marginBottom: "5%"
                    },
                    tabBarActiveTintColor: theme.colors.main
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{
                    title: "Tài khoản",
                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={require("../../assets/images/account.png")}
                            style={{ height: hp(4.6), width: hp(4.6), tintColor: color }}
                        />
                    ),
                    tabBarLabelStyle: {
                        fontSize: hp(2),
                        marginBottom: "5%"
                    },
                    tabBarActiveTintColor: theme.colors.main
                }}
            />
        </Tab.Navigator>
    );
}
