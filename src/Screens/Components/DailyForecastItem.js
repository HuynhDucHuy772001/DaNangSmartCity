import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const DailyForecastItem = ({ item, index, convertFtoC }) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const daysOfWeek = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else {
            return daysOfWeek[date.getDay()];
        }
    };

    const icon = item.weather[0].icon;

    return (
        <View key={index} style={styles.itemContainer}>
            <View style={styles.separator} />
            <View style={styles.container}>
                <Text style={styles.text}>{formatDate(item.dt)}</Text>
                <Image style={styles.icon} source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }} />
                <Text style={styles.tempmin}>{convertFtoC(item.temp.min)}°</Text>
                <Text style={styles.tempmax}>{convertFtoC(item.temp.max)}°</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        paddingHorizontal: '8.5%',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separator: {
        borderBottomColor: theme.colors.neutralW(0.15),
        borderBottomWidth: 0.8,
        marginVertical: 2,
    },
    text: {
        fontSize: hp(2),
        color: 'white',
        fontFamily: 'Inter-SemiBold',
        width: '25%',
    },
    icon: {
        height: wp(10),
        width: wp(14),
    },
    tempmin: {
        fontSize: hp(2),
        color: 'white',
        fontFamily: 'Inter-SemiBold',
        paddingLeft: '12%',
    },
    tempmax: {
        fontSize: hp(2),
        color: 'white',
        fontFamily: 'Inter-SemiBold',
        paddingLeft: '25%',
    },

});

export default DailyForecastItem;
