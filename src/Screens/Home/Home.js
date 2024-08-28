import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import { Marquee } from '@animatereactnative/marquee';
import { fetchDataEventsFromAPI } from '../../API/api';
import moment from 'moment';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Home = ({ navigation }) => {
    const [weather, setWeather] = useState(null);

    const [originData, setOriginData] = useState([]);
    const [eventCount, setEventCount] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDataEvent();
        fetchWeather();
        const intervalId = setInterval(fetchWeather, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchWeather = async () => {
        const API_KEY = 'f5532ca263adae4d802d165345108817';
        const CITY = 'Danang';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&lang=vi&units=imperial`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error(error);
        }
    };

    const convertFtoC = (temp) => {
        return ((temp - 32) * (5 / 9)).toFixed(0);
    };

    const renderWeatherWidget = () => {
        if (!weather) {
            return <ActivityIndicator size={'small'} color={theme.colors.main} style={{ marginTop: '50%' }}></ActivityIndicator>;
        }

        const icon = weather.weather[0].icon;

        return (
            <TouchableOpacity style={styles.weatherContainer} onPress={() => navigation.navigate("weatherscreen")}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Image source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }} style={styles.icon} />
                    <Text style={styles.temperature}>{convertFtoC(weather.main.temp)}°</Text>
                </View>
                <Text style={styles.description}>{weather.weather[0].description}</Text>
            </TouchableOpacity>
        );
    };

    const fetchDataEvent = async () => {
        try {
            const apiData = await fetchDataEventsFromAPI();
            setOriginData(apiData);
            setIsLoading(false);
        } catch (error) {
            console.log('Lỗi khi gọi API:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 24 * 60 * 60 * 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        checkUpcomingEvents();
    }, [originData, currentDate]);

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            if (flatListRef.current) {
                let nextIndex = (currentIndex + 1) % upcomingEvents.length;
                flatListRef.current.scrollToOffset({ offset: nextIndex * (wp(40) + 10), animated: true });
                setCurrentIndex(nextIndex);
            }
        }, 3000);

        return () => clearInterval(scrollInterval);
    }, [currentIndex, upcomingEvents]);

    //Format lại ngày
    const formatDate = (date) => {
        return date.toLocaleDateString('en-CA');
    };

    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const formatDateView = (dateString) => {
        const date = moment(dateString);
        const day = date.date();
        const month = date.month() + 1;
        const year = date.year();
        const dayOfWeek = capitalize(date.format('dddd')); // Lấy thứ trong tuần

        return `${dayOfWeek}, ${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    };

    //Lấy số lượng sự kiện ngẫu nhiên
    const getRandomEvents = (events, maxCount) => {
        const shuffledEvents = events.sort(() => 0.5 - Math.random());
        return shuffledEvents.slice(0, maxCount);
    };

    //Kiểm tra sự kiện sắp diễn ra vào ngày mai
    const checkUpcomingEvents = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const tomorrowString = formatDate(tomorrow);

        const upcoming = originData.filter(event => {
            const eventDate = formatDate(new Date(event.ngay_dien_ra_su_kien));
            return eventDate === tomorrowString;
        });

        const randomUpcomingEvents = getRandomEvents(upcoming, 3);
        setUpcomingEvents(randomUpcomingEvents);
        setEventCount(randomUpcomingEvents.length);
    };

    //Hiệu ứng chuyển động, làm mờ sự kiện sắp diễn ra
    const renderUpcomingEvents = ({ item, index }) => {
        const inputRange = [
            (index - 1) * wp(60),
            index * wp(60),
            (index + 1) * wp(60),
        ];
        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: 'clamp',
        });

        //Hiển thị sự kiện sắp diễn ra
        return (
            <TouchableOpacity onPress={() => navigation.navigate("eventdetail", { event: item })}>
                <Animated.View style={[styles.eventBanner, { opacity, transform: [{ scale }] }]}>
                    <Image
                        source={{ uri: item.hinh_anh }}
                        style={{ height: '62%', width: '100%', borderRadius: theme.radius.xs }}
                        resizeMode='cover'
                    />
                    <Text style={styles.eventTitle} numberOfLines={1}>{item.ten_su_kien}</Text>
                    <Text style={styles.eventTime} numberOfLines={1}>{formatDateView(item.ngay_dien_ra_su_kien)} • {item.thoi_gian_dien_ra_su_kien}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: hp(18) }}>
                <View style={styles.heading}>

                    <View style={styles.leftContent}>
                        <Image source={require("../../assets/images/logo.png")} style={styles.logo}></Image>
                        <Text style={styles.textNameApp}>DANANG SMART CITY</Text>
                    </View>

                    <View style={{ backgroundColor: theme.colors.neutralW(0.15), height: '100%' }}>{renderWeatherWidget()}</View>

                    <View style={styles.rightContent}>
                        <Image source={require("../../assets/images/bell.png")} style={{ height: hp(2.5), width: hp(2.5) }}></Image>
                        <Text>     </Text>
                        <Image source={require("../../assets/images/profile-user.png")} style={styles.logo}></Image>
                    </View>
                </View>

                <View style={{ marginHorizontal: "5%", marginTop: "2%" }}>
                    <Marquee spacing={80} speed={0.6}>
                        <Text style={{ fontSize: hp(1.8), color: 'black' }}>
                            "Khoa học, công nghệ và đổi mới sáng tạo - khơi dậy khát vọng, kiến tạo tương lại, nâng cao tiềm lực và vị thế quốc gia"
                        </Text>
                    </Marquee>
                </View>
                <View style={{ backgroundColor: theme.colors.main, height: "20%", marginHorizontal: "2%", borderRadius: theme.radius.xs, justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}></View>
            </View>

            <View style={styles.digitalCitizenSection}>
                <Text style={styles.title}>Công dân số</Text>
                <View style={{ flexDirection: 'row', marginHorizontal: '2%' }}>
                    <TouchableOpacity style={{ width: wp(24) }} onPress={() => navigation.navigate("listview")}>
                        <Image source={require("../../assets/images/seo1.png")} style={{ alignSelf: 'center', height: hp(8), width: hp(8) }}></Image>
                        <Text style={styles.textUtilities}>Tra cứu chứng chỉ hành nghề kiến trúc</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: wp(24) }} onPress={() => navigation.navigate('listevents')}>
                        <Image source={require("../../assets/images/iconEvent.png")} style={{ alignSelf: 'center', height: hp(8), width: hp(8) }}></Image>
                        <Text style={styles.textUtilities}>Lịch sự kiện</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading ? (
                <ActivityIndicator size="small" color={theme.colors.main} style={{ marginTop: "10%" }} />
            ) : (
                upcomingEvents.length > 0 ? (
                    <View style={styles.upcomingEventsSection}>
                        <Text style={styles.textUpcomingEventsTitle}>Sự kiện sắp diễn ra</Text>
                        <AnimatedFlatList
                            data={upcomingEvents}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderUpcomingEvents}
                            keyExtractor={(item, index) => index.toString()}
                            snapToAlignment="center"
                            snapToInterval={wp(60) + 10}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: true }
                            )}
                            ref={flatListRef}
                        />
                    </View>
                ) : (null)
            )}

            <View style={styles.digitalCitizenSection}>
                <Text style={styles.title}>Chính quyền số</Text>
                <View style={{ flexDirection: 'row', marginHorizontal: '2%' }}>
                    <TouchableOpacity style={{ width: wp(24) }}>
                        <Image source={require("../../assets/images/logo.png")} style={{ alignSelf: 'center', height: hp(8), width: hp(8) }}></Image>
                        <Text style={styles.textUtilities}>Hệ thống Egov</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    heading: {
        width: wp(94),
        flexDirection: 'row',
        marginVertical: "2%",
        marginHorizontal: "2%",
        justifyContent: 'space-between',
    },
    logo: {
        height: wp(12),
        width: wp(12),
    },
    textNameApp: {
        color: theme.colors.main,
        fontSize: hp(2.3),
        fontWeight: theme.fontWeights.bold,
        width: 130,
        marginLeft: "2%"
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    digitalCitizenSection: {
        backgroundColor: theme.colors.neutral(0.05),
        height: 'auto',
        marginTop: "3%",
        borderRadius: 10,
        paddingBottom: '2%'
    },
    title: {
        color: theme.colors.main,
        fontSize: hp(2),
        marginLeft: "2%",
        marginVertical: "2%",
        fontWeight: 'bold',
    },
    textUtilities: {
        textAlign: 'center',
        fontSize: hp(1.6),
        fontFamily: 'Inter-Medium',
        color: 'black'
    },
    weatherContainer: {
        marginTop: '3%',
    },
    temperature: {
        fontSize: hp(1.6),
        fontFamily: 'Inter-Black',
        color: theme.colors.main,
        alignSelf: 'center',
    },
    icon: {
        width: wp(7),
        height: wp(7),
    },
    description: {
        fontSize: hp(1.6),
        color: theme.colors.main,
        textTransform: 'capitalize',
        textAlign: 'center',
        paddingLeft: 6,
    },
    upcomingEventsSection: {
        paddingHorizontal: "2%"
    },
    textUpcomingEventsTitle: {
        fontSize: hp(2),
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.colors.main
    },
    eventBanner: {
        borderRadius: 8,
        height: hp(12),
        width: wp(60),
        backgroundColor: 'white',
        shadowColor: theme.colors.main,
    },
    eventTitle: {
        color: 'black',
        fontSize: hp(1.8),
        fontWeight: 'bold',
        position: 'absolute',
        bottom: "18%"
    },
    eventTime: {
        color: 'black',
        fontSize: hp(1.8),
        position: 'absolute',
        bottom: "0%"
    },
});

export default Home;
