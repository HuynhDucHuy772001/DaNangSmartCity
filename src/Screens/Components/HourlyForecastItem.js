import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const HourlyForecastItem = ({ item, index, convertFtoC }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
        const hours = date.getHours();
        return `${hours} : 00`;
    };

    const icon = item.weather[0].icon;

    return (
        <View key={index} style={styles.container}>
            <Text style={styles.time}>{formatTime(item.dt)}</Text>
            <Image style={styles.icon} source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }} />
            <Text style={styles.temp}>{convertFtoC(item.main.temp)}°</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.neutral(0.15),
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    time: {
        color: 'white',
        fontSize: hp(1.6),
        fontFamily: 'Inter-Black'
    },
    icon: {
        height: wp(11),
        width: wp(11)
    },
    temp: {
        color: 'white',
        fontFamily: 'Inter-Black'
    }
})

export default HourlyForecastItem;
