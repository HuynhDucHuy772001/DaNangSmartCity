import React, { useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Image, ImageBackground, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, StatusBar, VirtualizedList, } from 'react-native';
import { theme } from '../../../constants/theme';
import { Dimensions } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown } from 'react-native-reanimated';
import moment from 'moment';
import YoutubeIframe from 'react-native-youtube-iframe';
import ImageViewer from 'react-native-image-zoom-viewer';
import { hp, wp } from '../../../helpers/common';

const { height, width } = Dimensions.get('window');

function EventDetail() {
    const navigation = useNavigation();
    const event = useRoute().params.event;
    const playerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [imageViewUri, setImageViewUri] = useState('');

    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const formatDate = (dateString) => {
        const date = moment(dateString);
        const day = date.date();
        const month = date.month() + 1;
        const year = date.year();
        const dayOfWeek = capitalize(date.format('dddd'));

        return `${dayOfWeek}, ${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    };

    const handleLinkPress = () => {
        Linking.openURL(event.nguon);
    };

    const handleLinkToGGMap = () => {
        Linking.openURL(event.dia_diem.link_ban_do);
    };

    const videoWidth = wp(100);
    const videoHeight = (videoWidth / 16) * 9;

    const onImagePress = (url) => {
        setImageViewUri(url);
        setIsImageViewVisible(true);
    };

    const renderImage = (node, index) => {
        const { src } = node.attributes;
        return (
            <TouchableOpacity key={index} onPress={() => onImagePress(src)}>
                <Image source={{ uri: src }} style={styles.markdownImage} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ backgroundColor: theme.colors.white, flex: 1, height: hp(100) }}>
            <ScrollView style={{ height: hp(100), backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
                <Animated.View
                    entering={FadeInDown.delay(10).springify().damping(11)}
                    style={{ backgroundColor: theme.colors.white, height: '100%' }}
                >
                    <ImageBackground
                        source={{ uri: event.hinh_anh }}
                        imageStyle={{ borderBottomLeftRadius: theme.radius.xl, borderBottomRightRadius: theme.radius.xl }}
                        style={{
                            height: hp(30),
                            width: wp(100),
                            borderBottomLeftRadius: theme.radius.md,
                            borderBottomRightRadius: theme.radius.md,
                        }}
                        resizeMode="cover"
                    >
                        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                            <Image source={require('../../../assets/images/back.png')} style={{ height: wp(4), width: wp(4), alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </ImageBackground>

                    <Text style={styles.ten_su_kien}>{event.ten_su_kien}</Text>

                    {event.gia_ve.loai_gia_ve === 'Miễn phí' ? (
                        <View style={[styles.directionButton, { justifyContent: 'flex-end' }]}>
                            <Image source={require('../../../assets/images/ticket.png')} style={{ height: wp(9), width: wp(9) }} />
                            <Text style={styles.textTicket}>{event.gia_ve.loai_gia_ve}</Text>
                        </View>
                    ) : (
                        <View style={styles.directionButton}>
                            <Image source={require('../../../assets/images/ticket.png')} style={{ height: wp(9), width: wp(9) }} />
                            <Text style={styles.textTicket}>{event.gia_ve.so_tien}</Text>
                        </View>
                    )}

                    <View style={styles.container_thoi_gian_dien_ra_su_kien}>
                        <Image source={require('../../../assets/images/calender.png')} style={{ height: wp(10), width: wp(10) }} />
                        <Text style={styles.thoi_gian_dien_ra_su_kien}>
                            {formatDate(event.ngay_dien_ra_su_kien)} • {event.thoi_gian_dien_ra_su_kien}
                        </Text>
                    </View>

                    <View style={styles.container_dia_diem}>
                        <Image source={require('../../../assets/images/mappin.png')} style={{ height: wp(10), width: wp(10) }} />
                        <Text style={styles.dia_diem}>{event.dia_diem.dia_chi}</Text>
                        <TouchableOpacity onPress={handleLinkToGGMap}>
                            <Image source={require('../../../assets/images/external-link.png')} style={{ height: 15, width: 15, alignItems: 'center' }} />
                        </TouchableOpacity>
                    </View>

                    <View>
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={theme.colors.main} />
                            </View>
                        )}
                        <YoutubeIframe
                            ref={playerRef}
                            width={videoWidth}
                            height={videoHeight}
                            videoId={event.clip_gioi_thieu}
                            onReady={() => setLoading(false)}
                        />
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: hp(2.5), fontFamily: 'Inter-ExtraBold', color: 'black', marginTop: '2%' }}>Thông tin về sự kiện</Text>
                    </View>
                    {event.bai_viet ? (
                        <Markdown style={markdownStyles} rules={{ image: renderImage }}>
                            {event.bai_viet}
                        </Markdown>
                    ) : (
                        <Text style={styles.dang_cap_nhat}>Đang cập nhật...</Text>
                    )}

                    <View style={{ alignSelf: 'flex-end', flexDirection: 'row', marginRight: '5%', marginBottom: '2%' }}>
                        <Text style={{ fontSize: hp(2), color: 'black' }}>Nguồn: </Text>
                        <TouchableOpacity onPress={handleLinkPress}>
                            <Text numberOfLines={1} style={{ color: theme.colors.main, fontSize: hp(2), width: wp(30) }}>
                                {event.nguon}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: hp(2), color: 'black' }}>Thông tin đơn vị tổ chức</Text>
                        {event.don_vi_to_chuc.logo ? (
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Image
                                    source={{ uri: event.don_vi_to_chuc.logo }}
                                    style={{
                                        height: wp(8),
                                        width: wp(8),
                                    }}
                                    resizeMode="stretch"
                                />
                                <Text style={{ alignSelf: 'center', fontSize: hp(2), color: 'black' }}> {event.don_vi_to_chuc.ten}</Text>
                            </View>
                        ) : (
                            <Text style={styles.dang_cap_nhat_tt}>Đang cập nhật...</Text>
                        )}

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => Linking.openURL(`tel:${event.don_vi_to_chuc.thong_tin_lien_he.sdt}`)}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../../assets/images/telephone.png')} style={{ alignSelf: 'center', marginRight: "1%" }} />
                                    <Text style={{ color: 'black', fontSize: hp(2), textDecorationLine: 'underline' }}>
                                        {event.don_vi_to_chuc.thong_tin_lien_he.sdt}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={{ fontSize: hp(2) }}> - </Text>
                            <TouchableOpacity onPress={() => Linking.openURL(event.don_vi_to_chuc.thong_tin_lien_he.website)}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../../assets/images/internet.png')} style={{ alignSelf: 'center', marginRight: "1%" }} />
                                    <Text style={{ color: 'black', fontSize: hp(2), textDecorationLine: 'underline' }}>
                                        {event.don_vi_to_chuc.thong_tin_lien_he.website}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Modal for Image View */}
            <Modal
                visible={isImageViewVisible}
                transparent={true}
                animationType="slide"
            >
                <StatusBar barStyle="light-content" />
                <ImageViewer
                    imageUrls={[{ url: imageViewUri }]}
                    enableSwipeDown
                    onSwipeDown={() => setIsImageViewVisible(false)}
                />
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsImageViewVisible(false)}>
                    <Image source={require('../../../assets/images/close.png')} style={{ height: wp(4), width: wp(4) }} />
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const markdownStyles = StyleSheet.create({
    body: {
        marginHorizontal: '2.5%',
        fontSize: hp(2.1),
        color: 'black',
    },
});

const styles = StyleSheet.create({
    back: {
        padding: 10,
        backgroundColor: theme.colors.neutralW(0.4),
        borderRadius: theme.radius.xs,
        width: 45,
        marginTop: '2%',
        marginLeft: '2%',
    },
    ten_su_kien: {
        fontSize: hp(2.8),
        textTransform: 'uppercase',
        margin: '2%',
        color: 'black',
        fontFamily: 'Inter-Black',
    },
    container_thoi_gian_dien_ra_su_kien: {
        display: 'flex',
        flexDirection: 'row',
        margin: '2%',
        width: wp(96),
    },
    thoi_gian_dien_ra_su_kien: {
        fontSize: hp(2),
        color: 'black',
        marginHorizontal: '2%',
        alignSelf: 'center',
    },
    container_dia_diem: {
        display: 'flex',
        flexDirection: 'row',
        margin: '2%',
        width: wp(96),
        alignItems: 'center',
    },
    dia_diem: {
        fontSize: hp(2),
        color: 'black',
        marginHorizontal: '2%',
        alignSelf: 'center',
    },
    dang_cap_nhat: {
        marginHorizontal: '2%',
        fontSize: hp(2),
        fontStyle: 'italic',
        color: 'black',
    },
    directionButton: {
        width: 'auto',
        padding: 4,
        position: 'static',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        marginBottom: '2%',
        borderRadius: 10,
        shadowColor: theme.colors.main,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5,
        marginLeft: '2%',
    },
    textTicket: {
        fontSize: hp(2),
        color: 'black',
        marginHorizontal: '2%',
        alignSelf: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    dang_cap_nhat_tt: {
        marginHorizontal: '2%',
        fontSize: hp(1.7),
        fontStyle: 'italic',
        color: 'black',
    },
    markdownImage: {
        width: wp(96),
        height: (wp(96) / 16) * 9,
        // resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: '8%',
        right: '6%',
    },
});

export default EventDetail;
