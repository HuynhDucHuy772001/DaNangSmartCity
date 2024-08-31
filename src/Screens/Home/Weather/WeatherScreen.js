import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, Alert } from 'react-native';
import { hp, wp } from '../../../helpers/common';
import HourlyForecastItem from '../../Components/HourlyForecastItem';
import DailyForecastItem from '../../Components/DailyForecastItem';
import { theme } from '../../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const API_KEY = "f5532ca263adae4d802d165345108817";
const API_KEY_IQAIR = "ed52ab3d-0fbd-4b85-9494-cefc14914c3d";

const WeatherScreen = () => {
    const navigation = useNavigation();

    const [weatherDataCurrent, setWeatherDataCurrent] = useState(null);
    const [hourlyWeatherForecastData, setHourlyWeatherForecastData] = useState([]);
    const [dailyWeatherForecastData, setDailyWeatherForecastData] = useState([]);
    const [dailyCurrent, setDailyCurrent] = useState([]);
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [iqAir, setIqAir] = useState(null);
    const [loading, setLoading] = useState(true);

    //Xác định vị trí
    useEffect(() => {
        const getLocation = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Yêu cầu truy cập vị trí",
                        message: "Ứng dụng cần truy cập vị trí của bạn.",
                        buttonNegative: "Từ chối",
                        buttonPositive: "Đồng ý"
                    }
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn("Quyền truy cập vị trí bị từ chối");
                    return;
                }
            }

            Geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                },
                (error) => {
                    showAlert(error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 200 }
            );
        };

        getLocation();
    }, []);

    console.log(location);

    useEffect(() => {
        if (location.latitude && location.longitude) {
            fetchWeatherData();
            fetchIQAir();
            const intervalId = setInterval(fetchWeatherData, 60000);

            return () => clearInterval(intervalId);
        }
    }, [location]);
    //Call API thời tiết
    const fetchWeatherData = async () => {
        try {
            const { latitude, longitude } = location;
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=vi&units=imperial`);
            const weatherData = await weatherResponse.json();
            setWeatherDataCurrent(weatherData);

            const hourlyResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=vi&units=imperial`);
            const hourlyData = await hourlyResponse.json();
            setHourlyWeatherForecastData(hourlyData.list);

            const dailyResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=9&appid=${API_KEY}&lang=vi&units=imperial`);
            const dailyData = await dailyResponse.json();
            setDailyWeatherForecastData(dailyData.list);
            setDailyCurrent(dailyData.list[0]);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };
    //Call API CLKK
    const fetchIQAir = async () => {
        try {
            const { latitude, longitude } = location;
            const iqAirResponse = await fetch(`https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${API_KEY_IQAIR}`);
            const iqAirData = await iqAirResponse.json();
            if (iqAirData && iqAirData.data && iqAirData.data.current && iqAirData.data.current.pollution) {
                setIqAir(iqAirData.data.current.pollution.aqius);
            } else {
                console.warn("Invalid IQAir data:", iqAirData);
                setIqAir(null);
            }
        } catch (error) {
            console.error('Error fetching IQAir data:', error);
            setIqAir(null);
        }
    };

    const showAlert = (error) => {
        Alert.alert(
            "Lỗi",
            "Không thể lấy vị trí hiện tại của bạn. Vui lòng kiểm tra lại định vị và thử lại",
            [{ text: "OK", onPress: () => navigation.goBack() }],
            { cancelable: false }
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.neutralW(0.15), justifyContent: 'center' }}>
                <ActivityIndicator size='large' color={theme.colors.main} />
            </View>
        );
    }

    const capitalize = (string) => string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const weatherDescription = capitalize(weatherDataCurrent.weather[0].description);
    const icon = weatherDataCurrent.weather[0].icon;

    const convertFtoC = (temp) => ((temp - 32) * (5 / 9)).toFixed(0);

    const pop = dailyCurrent.pop ? (dailyCurrent.pop * 100).toFixed(0) : '';
    const gust = dailyCurrent.gust ? (dailyCurrent.gust * 1.6093440).toFixed(0) : '';
    const windDeg = weatherDataCurrent.wind.deg;
    const rain = dailyCurrent.rain ? dailyCurrent.rain.toFixed(1) : '0';
    const wind = weatherDataCurrent.wind.speed ? (weatherDataCurrent.wind.speed * 1.6093440).toFixed(0) : '0';

    const getWindDirection = (deg) => {
        const directions = [
            'Bắc', 'Bắc Đông Bắc', 'Đông Bắc', 'Đông Đông Bắc',
            'Đông', 'Đông Đông Nam', 'Đông Nam', 'Nam Đông Nam',
            'Nam', 'Nam Tây Nam', 'Tây Nam', 'Tây Tây Nam',
            'Tây', 'Tây Tây Bắc', 'Tây Bắc', 'Bắc Tây Bắc'
        ];
        const index = Math.round((deg % 360) / 22.5) % 16;
        return directions[index];
    };


    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const now = new Date();
    const nowTimestamp = Math.floor(now.getTime() / 1000);
    const sunrise = weatherDataCurrent.sys.sunrise;
    const sunset = weatherDataCurrent.sys.sunset;
    const isBeforeSunset = nowTimestamp < sunset;

    const getBackgroundImage = (weather) => {
        switch (weather) {
            case 'Clouds':
                return 'https://i.imgur.com/ZXBmbOK.jpeg';
            case 'Rain':
            case 'Thunderstorm':
                return 'https://c.wallhere.com/photos/e7/37/rain_water_on_glass-112394.jpg!d';
            case 'Clear':
                return 'https://png.pngtree.com/thumb_back/fw800/background/20190222/ourmid/pngtree-fresh-blue-sky-white-clouds-sky-background-skywhite-cloudsskybackground-image_58863.jpg';
            case 'Sun':
                return 'https://norlur.am/uploads/img/blog/upload/post-content/2021-02-06-22-35-18_istockphoto-638668442-640x640.jpg';
            default:
                return '';
        }
    };

    const getStatusImage = (aqi) => {
        if (aqi < 50) {
            return require('../../../assets/images/smile.png');
        } else if (aqi >= 50 && aqi <= 100) {
            return require('../../../assets/images/neutral-face.png');
        } else if (aqi > 100) {
            return require('../../../assets/images/sad.png');
        } else {
            return '';
        }
    };

    const getStatus = (aqi) => {
        if (aqi <= 50) {
            return 'Tốt'
        } else if (aqi > 50 && aqi <= 100) {
            return 'Vừa phải';
        } else if (aqi > 100) {
            return 'Không lành mạnh cho các nhóm nhạy cảm';
        } else {
            return 'Không khỏe mạnh';
        }
    };

    const backgroundImage = getBackgroundImage(weatherDataCurrent.weather[0].main);

    const statusImage = getStatusImage(iqAir);

    const statusT = getStatus(iqAir);

    return (
        <ImageBackground source={{ uri: backgroundImage }} style={styles.container} resizeMode='cover'>
            <View style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0,0,0,0.2)'
            }}></View>
            <View style={{ flexDirection: 'row', height: 'auto', width: wp(92) }}>
                <View style={{ justifyContent: 'center', width: wp(14) }}>
                    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                        <Image source={require('../../../assets/images/back.png')} style={styles.iconTitle} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Thông tin thời tiết hiện tại */}
            <View style={styles.weatherInfo}>
                <Text style={styles.cityName}>{weatherDataCurrent.name}</Text>
                <View>
                    <Image style={styles.icon} source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }} />
                </View>
                <Text style={styles.temp}>{convertFtoC(weatherDataCurrent.main.temp)}°</Text>
                <Text style={styles.weather}>{weatherDescription}</Text>
                {dailyWeatherForecastData.length > 0 && (
                    <Text style={styles.tempMinMax}>
                        C: {convertFtoC(dailyWeatherForecastData[0].temp.max)}°
                        T: {convertFtoC(dailyWeatherForecastData[0].temp.min)}°
                    </Text>
                )}
            </View>

            <ScrollView style={styles.detailWeather} showsVerticalScrollIndicator={false}>
                {/* Thông tin thời tiết hàng giờ */}
                <View>
                    <FlatList
                        data={hourlyWeatherForecastData.slice(0, 8)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 5, height: hp(15) }}
                        renderItem={({ item, index }) => <HourlyForecastItem item={item} index={index} convertFtoC={convertFtoC} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {/* Thông tin chất lượng không khí */}
                <View style={styles.viewAQI}>
                    <View style={styles.viewSection}>
                        <Image source={require('../../../assets/images/air-quality.png')} style={styles.iconTitle} />
                        <Text style={styles.textTitle}>CHẤT LƯỢNG KHÔNG KHÍ</Text>
                    </View>
                    <View style={{ marginBottom: '2%' }}>
                        {iqAir ? (
                            <View style={{ flexDirection: 'row', paddingLeft: '4%' }}>
                                <View style={{ width: wp(20) }}>
                                    <Image source={statusImage} style={{ height: wp(20), width: wp(20) }} />
                                </View>
                                <View style={{ width: wp(32) }}>
                                    <Text style={{ color: 'white', fontSize: hp(5), fontFamily: 'Inter-SemiBold', textAlign: 'center' }}>{iqAir}</Text>
                                    <Text style={{ color: 'white', fontSize: hp(2), fontFamily: 'Inter-SemiBold', textAlign: 'center' }}>US AQI</Text>
                                </View>
                                <View style={{ width: wp(32), justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: hp(3), fontFamily: 'Inter-SemiBold', textAlign: 'center' }}>{statusT}</Text>
                                </View>
                            </View>

                        ) : (
                            <Text style={{ color: 'white', fontSize: hp(1.8), fontFamily: 'Inter-SemiBold', paddingLeft: '4%' }}>Không có dữ liệu AQI</Text>
                        )}
                    </View>
                </View>
                {/* Thông tin thời tiết hàng ngày */}
                <View style={styles.viewDailyForecast}>
                    <View style={styles.viewSection}>
                        <Image source={require('../../../assets/images/calendar2.png')} style={styles.iconTitle} />
                        <Text style={styles.textTitle}>DỰ BÁO HÀNG NGÀY</Text>
                    </View>

                    <FlatList
                        data={dailyWeatherForecastData}
                        renderItem={({ item, index }) => <DailyForecastItem item={item} index={index} convertFtoC={convertFtoC} />}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                    />
                </View>
                {/*Thông tin mặt trời mọc và lặn và tầm nhìn*/}
                <View style={styles.viewSunRise_SunSetAndVision}>
                    {isBeforeSunset ? (
                        <View style={styles.viewSunRise_SunSet}>
                            <View style={styles.viewSection2Row}>
                                <Image source={require('../../../assets/images/sunset.png')} style={styles.iconTitle} />
                                <Text style={styles.textTitle2Row}>MẶT TRỜI LẶN</Text>
                            </View>
                            <Text style={styles.textSunRise_SunSet}>{formatTime(weatherDataCurrent.sys.sunset)}</Text>
                            <Text style={styles.textDetailSunRise_SunSet}>
                                Mặt trời mọc: {formatTime(weatherDataCurrent.sys.sunrise)}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.viewSunRise_SunSet}>
                            <View style={styles.viewSection2Row}>
                                <Image source={require('../../../assets/images/sunrise.png')} style={styles.iconTitle} />
                                <Text style={styles.textTitle2Row}>MẶT TRỜI MỌC</Text>
                            </View>
                            <Text style={styles.textSunRise_SunSet}>{formatTime(dailyWeatherForecastData[1].sunrise)}</Text>
                            <Text style={styles.textDetailSunRise_SunSet}>
                                Mặt trời lặn: {formatTime(weatherDataCurrent.sys.sunset)}
                            </Text>
                        </View>
                    )}

                    <View style={styles.viewVision}>
                        <View style={styles.viewSection2Row}>
                            <Image source={require('../../../assets/images/vision.png')} style={styles.iconTitle} />
                            <Text style={styles.textTitle2Row}>TẦM NHÌN</Text>
                        </View>
                        <Text style={styles.textVision}>{(weatherDataCurrent.visibility) / 1000} <Text style={{ fontSize: hp(4) }}>km</Text></Text>
                        {weatherDataCurrent.visibility >= 10 ? (
                            <Text style={styles.textDetailVision}>Tầm nhìn hoàn toàn rõ ràng</Text>
                        ) : (
                            <Text style={styles.textDetailVision}>Tầm nhìn không rõ ràng</Text>
                        )}
                    </View>
                </View>
                {/* Thông tin thời tiết về gió*/}
                <View style={styles.viewWind}>
                    <View style={styles.viewSection}>
                        <Image source={require('../../../assets/images/wind.png')} style={styles.iconTitle} />
                        <Text style={styles.textTitle}>GIÓ</Text>
                    </View>
                    <View style={styles.viewWindChild}>
                        <View style={{ width: wp(45) }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.textWind}>{wind}</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.textKMH}>km/h</Text>
                                    <Text style={styles.textDetailWind}>Gió</Text>
                                </View>
                            </View>
                            <View style={styles.separator} />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.textGust}>{gust}</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.textKMH}>km/h</Text>
                                    <Text style={styles.textDetailWind}>Gió giật</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: wp(45), justifyContent: 'center', paddingLeft: '2%' }}>
                            <Text style={styles.textWindDeg}>Hướng gió {windDeg} {getWindDirection(windDeg)}</Text>
                        </View>
                    </View>
                </View>
                {/* Thông tin thời tiết về cảm nhận và lượng mưa */}
                <View style={styles.viewFeelLikeAndAmountOfRain}>
                    <View style={styles.viewFeelLike}>
                        <View style={styles.viewSection2Row}>
                            <Image source={require('../../../assets/images/thermometer.png')} style={styles.iconTitle} />
                            <Text style={styles.textTitle2Row}>CẢM NHẬN</Text>
                        </View>
                        <Text style={styles.textFeelsLike}>{convertFtoC(weatherDataCurrent.main.feels_like)}°</Text>
                        {weatherDataCurrent.main.humidity > 50 ? (
                            <Text style={styles.textDetailFeelsLike}>Độ ẩm đang khiến bạn cảm thấy nóng hơn</Text>
                        ) : (
                            <Text style={styles.textDetailFeelsLike}>Độ ẩm ổn định làm bạn cảm thấy thoải mái và dễ chịu hơn</Text>
                        )}
                    </View>

                    <View style={styles.ViewAmountOfRain}>
                        <View style={styles.viewSection2Row}>
                            <Image source={require('../../../assets/images/drop.png')} style={styles.iconTitle} />
                            <Text style={styles.textTitle2Row}>LƯỢNG MƯA</Text>
                        </View>
                        <Text style={styles.textAmountOfRain}>{rain} <Text style={{ fontSize: hp(4) }}>mm</Text></Text>
                        <Text style={styles.textDetailAmountOfRain}>Trong 24h qua</Text>
                    </View>
                </View>
                {/* Thông tin thời tiết về mưa và độ ẩm*/}
                <View style={styles.viewRainAndHumidity}>
                    <View style={styles.viewRain}>
                        <View style={styles.viewSection2Row}>
                            <Image source={require('../../../assets/images/cloud.png')} style={styles.iconTitle} />
                            <Text style={styles.textTitle2Row}>MƯA</Text>
                        </View>
                        <Text style={styles.textRain}>{pop}%</Text>
                        <Text style={styles.textDetailRain}>Có khả năng {pop}% mưa xảy ra</Text>
                    </View>

                    <View style={styles.ViewHumidity}>
                        <View style={styles.viewSection2Row}>
                            <Image source={require('../../../assets/images/humidity.png')} style={styles.iconTitle} />
                            <Text style={styles.textTitle2Row}>ĐỘ ẨM</Text>
                        </View>
                        <Text style={styles.textHumidity}>{weatherDataCurrent.main.humidity}%</Text>
                        <Text style={styles.textDetailHumidity}>Độ ẩm là {weatherDataCurrent.main.humidity}% ngay lúc này</Text>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    back: {
        padding: 10,
        backgroundColor: theme.colors.neutralW(0.15),
        borderRadius: theme.radius.xs,
        width: 45,
        marginTop: '10%'
    },
    weatherInfo: {
        alignItems: 'center',
        height: hp(38),
        justifyContent: 'center'
    },
    cityName: {
        fontWeight: 'bold',
        fontSize: hp(4),
        color: 'white'
    },
    icon: {
        height: wp(20),
        width: wp(20)
    },
    temp: {
        fontFamily: 'Inter-Black',
        fontSize: hp(8),
        color: 'white'
    },
    weather: {
        fontSize: hp(2.5),
        color: 'white'
    },
    tempMinMax: {
        fontSize: hp(2.2),
        color: 'white'
    },
    detailWeather: {
        height: 'auto',
        flex: 1,
        width: wp(92)
    },
    viewDailyForecast: {
        borderRadius: 10,
        backgroundColor: theme.colors.neutral(0.15),
        marginVertical: "2%"
    },
    viewSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: "4%",
        paddingVertical: "2%"
    },
    iconTitle: {
        width: wp(4),
        height: wp(4),
        alignSelf: 'center'
    },
    textTitle: {
        color: 'white',
        fontFamily: 'Inter-ExtraBold',
        marginLeft: "2%",
        fontSize: hp(1.5)
    },
    textTitle2Row: {
        color: 'white',
        fontFamily: 'Inter-ExtraBold',
        marginLeft: "3%",
        fontSize: hp(1.5)
    },
    viewRainAndHumidity: {
        flexDirection: 'row'
    },
    viewSection2Row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: "8%",
        paddingVertical: "4%"
    },
    viewAQI: {
        backgroundColor: theme.colors.neutral(0.15),
        borderRadius: 10,
        marginTop: '2%',
    },
    viewRain: {
        borderRadius: 10,
        backgroundColor: theme.colors.neutral(0.15),
        marginBottom: "2%",
        width: wp(45),
        marginRight: '2%'
    },
    ViewHumidity: {
        borderRadius: 10,
        backgroundColor: theme.colors.neutral(0.15),
        marginBottom: "2%",
        width: wp(45)
    },
    textRain: {
        color: 'white',
        fontSize: hp(5),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold'
    },
    textDetailRain: {
        color: 'white',
        fontSize: hp(1.8),
        paddingHorizontal: '8%',
        fontFamily: 'Inter-Medium',
        paddingBottom: '2%'
    },
    textHumidity: {
        color: 'white',
        fontSize: hp(5),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold'
    },
    textDetailHumidity: {
        color: 'white',
        fontSize: hp(1.8),
        paddingHorizontal: '8%',
        fontFamily: 'Inter-Medium',
        paddingBottom: '2%'
    },
    viewWind: {
        backgroundColor: theme.colors.neutral(0.15),
        borderRadius: 10,
        marginBottom: '2%'
    },
    viewWindChild: {
        flexDirection: 'row',
    },
    textWind: {
        color: 'white',
        fontSize: hp(5),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold',
        width: wp(19)
    },
    textGust: {
        color: 'white',
        fontSize: hp(5),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold',
        width: wp(19)
    },
    separator: {
        borderBottomColor: theme.colors.neutralW(0.15),
        borderBottomWidth: 0.8,
        marginLeft: '8%'
    },
    textKMH: {
        color: 'white',
        fontSize: hp(1.2),
        fontFamily: 'Inter-Regular'
    },
    textDetailWind: {
        color: 'white',
        fontSize: hp(1.4),
        fontFamily: 'Inter-Black'
    },
    compassContainer: {
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'center'
    },
    textWindDeg: {
        color: 'white',
        fontSize: hp(1.8),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold',
    },
    viewFeelLikeAndAmountOfRain: {
        flexDirection: 'row'
    },
    viewFeelLike: {
        borderRadius: 10,
        backgroundColor: theme.colors.neutral(0.15),
        marginBottom: "2%",
        width: wp(45),
        marginRight: '2%'
    },
    textFeelsLike: {
        color: 'white',
        fontSize: hp(5),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold'
    },
    textDetailFeelsLike: {
        color: 'white',
        fontSize: hp(1.8),
        paddingHorizontal: '8%',
        fontFamily: 'Inter-Medium',
        paddingBottom: '2%'
    },
    ViewAmountOfRain: {
        borderRadius: 10,
        backgroundColor: theme.colors.neutral(0.15),
        marginBottom: "2%",
        width: wp(45)
    },
    textAmountOfRain: {
        color: 'white',
        fontSize: hp(5),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold'
    },
    textDetailAmountOfRain: {
        color: 'white',
        fontSize: hp(1.8),
        paddingHorizontal: '8%',
        fontFamily: 'Inter-Medium',
        paddingBottom: '2%'
    },
    viewSunRise_SunSetAndVision: {
        flexDirection: 'row'
    },
    viewSunRise_SunSet: {
        borderRadius: 10,
        backgroundColor: theme.colors.neutral(0.15),
        marginBottom: "2%",
        width: wp(45),
        marginRight: '2%'
    },
    textSunRise_SunSet: {
        color: 'white',
        fontSize: hp(5),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold'
    },
    textDetailSunRise_SunSet: {
        color: 'white',
        fontSize: hp(1.8),
        paddingHorizontal: '8%',
        fontFamily: 'Inter-Medium',
        paddingBottom: '2%'
    },
    viewVision: {
        borderRadius: 10,
        backgroundColor: theme.colors.neutral(0.15),
        marginBottom: "2%",
        width: wp(45),
        marginRight: '2%'
    },
    textVision: {
        color: 'white',
        fontSize: hp(5),
        paddingLeft: '8%',
        fontFamily: 'Inter-SemiBold'
    },
    textDetailVision: {
        color: 'white',
        fontSize: hp(1.8),
        paddingHorizontal: '8%',
        fontFamily: 'Inter-Medium',
        paddingBottom: '2%'
    },
});

export default WeatherScreen;