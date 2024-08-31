import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { hp, wp } from '../../../helpers/common';
import { theme } from '../../../constants/theme';
import { fetchDataMaHoSoFromAPI } from '../../../API/api';

const ProfileStatusScreen = ({ navigation, route }) => {
    // const [qrData, setQrData] = useState(route.params?.qrData || null);
    const [hoSoInfo, setHoSoInfo] = useState(null);
    const [hasScanned, setHasScanned] = useState(false);

    const handleScanQRCode = () => {
        navigation.navigate('QRCodeScannerScreen');
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchData = async () => {
        try {
            const apiData = await fetchDataMaHoSoFromAPI();

            if (route.params?.qrData) {
                const tachMaHoSo = route.params?.qrData.split("=");
                const maHoSo = tachMaHoSo[1]?.trim();

                // Tìm kiếm thông tin hồ sơ trùng khớp
                const matchedItem = apiData.find(item => item.ma_so_ho_so === maHoSo);
                if (matchedItem) {
                    setHoSoInfo(matchedItem);
                } else {
                    setHoSoInfo({ error: 'Không tìm thấy thông tin tình trạng hồ sơ' });
                }

                setHasScanned(true);
            }
        } catch (error) {
            console.log('Lỗi khi gọi API:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [route.params?.qrData]);

    const handlePayment = () => {
        // Implement payment logic here
        console.log('Payment initiated');
    };

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: hp(8) }}>
            <View style={styles.container_heading}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: 'flex-start', position: 'absolute', left: wp(4) }}>
                    <Image source={require("../../../assets/images/back.png")} style={{ width: wp(4), height: wp(4) }} />
                </TouchableOpacity>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.heading} numberOfLines={1}>Tra cứu thông tin tình trạng hồ sơ</Text>
                </View>
            </View>

            <View style={{ alignItems: 'center', height: 'auto' }}>
                <ScrollView style={styles.containerLookup} showsVerticalScrollIndicator={false}>
                    <Text style={styles.description}>Di chuyển camera lại mã QR để quét và xem tình trạng xử lí hồ sơ</Text>
                    <Image source={require('../../../assets/images/qr-code.png')} style={styles.image} />

                    {/* Nút bấm quét mã QR */}
                    <TouchableOpacity style={styles.scanButton} onPress={handleScanQRCode}>
                        <Text style={styles.scanButtonText}>Quét mã QR trên hồ sơ để tra cứu</Text>
                    </TouchableOpacity>

                    {hoSoInfo && !hoSoInfo.error ? (
                        <View style={styles.qrDataContainer}>
                            <Text style={styles.resultsTitle}>Kết quả tìm kiếm:</Text>
                            <Text style={styles.qrDataText}>Trạng thái: {hoSoInfo.trang_thai}</Text>
                            <Text style={styles.qrDataText}>Mã hồ sơ: {hoSoInfo.ma_so_ho_so}</Text>
                            <Text style={styles.qrDataText}>Nộp tại: {hoSoInfo.nop_tai}</Text>
                            <Text style={styles.qrDataText}>Mã biên nhận: {hoSoInfo.ma_bien_nhan}</Text>
                            <Text style={styles.qrDataText}>Cách nộp: {hoSoInfo.cach_nop}</Text>
                            <Text style={styles.qrDataText}>Lĩnh vực: {hoSoInfo.linh_vuc}</Text>
                            <Text style={styles.qrDataText}>Chủ hồ sơ: {hoSoInfo.chu_ho_so}</Text>
                            <Text style={styles.qrDataText}>Thủ tục: {hoSoInfo.thu_tuc}</Text>
                            <Text style={styles.qrDataText}>Người nộp: {hoSoInfo.nguoi_nop}</Text>
                            <Text style={styles.qrDataText}>Thành phần hồ sơ: {hoSoInfo.thanh_phan_ho_so}</Text>
                            <Text style={styles.qrDataText}>Phí: {hoSoInfo.phi}</Text>
                            <Text style={styles.qrDataText}>Lệ phí: {hoSoInfo.le_phi}</Text>
                            <Text style={styles.qrDataText}>Ngày tiếp nhận: {formatDate(hoSoInfo.ngay_tiep_nhan)}</Text>
                            <Text style={styles.qrDataText}>Ngày hẹn trả kết quả: {formatDate(hoSoInfo.ngay_hen_tra_ket_qua)}</Text>
                            <Text style={styles.qrDataText}>Ngày trả thực tế: {formatDate(hoSoInfo.ngay_tra_thuc_te)}</Text>

                            {(parseFloat(hoSoInfo.phi) > 0 || parseFloat(hoSoInfo.le_phi) > 0) && (
                                <TouchableOpacity
                                    style={[styles.paymentButton, { opacity: 1 }]}
                                    onPress={handlePayment}
                                >
                                    <Text style={styles.paymentButtonText}>Thanh toán</Text>
                                </TouchableOpacity>
                            )}
                            {(parseFloat(hoSoInfo.phi) === 0 && parseFloat(hoSoInfo.le_phi) === 0) && (
                                <TouchableOpacity
                                    style={styles.paymentButtonNoActive}
                                    disabled={true}
                                >
                                    <Text style={styles.paymentButtonText}>Thanh toán</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        hasScanned && (
                            <View>
                                <Text style={styles.resultsTitle}>Kết quả tìm kiếm:</Text>
                                <Text style={styles.noResultsText}>Không có kết quả. Vui lòng thử lại hoặc liên hệ Tổng đài 0236 1022 (*1022) để được hỗ trợ</Text>
                            </View>
                        )
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container_heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: theme.colors.main,
        padding: 15,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
    heading: {
        fontSize: hp(2),
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    containerLookup: {
        backgroundColor: 'white',
        width: wp(90),
        marginTop: hp(2),
        alignSelf: 'center',
        borderRadius: 10,
    },
    image: {
        height: wp(40),
        width: wp(40),
        marginTop: hp(6),
        marginBottom: hp(4),
        alignSelf: 'center',
    },
    description: {
        paddingHorizontal: '5%',
        fontSize: hp(2),
        color: 'black',
        textAlign: 'center',
        marginTop: '2%',
    },
    scanButton: {
        backgroundColor: theme.colors.main,
        paddingVertical: hp(1.5),
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: hp(4),
        marginHorizontal: '5%',
    },
    scanButtonText: {
        color: '#FFFFFF',
        fontSize: hp(2),
        fontWeight: 'bold',
    },
    resultsTitle: {
        marginHorizontal: '5%',
        fontSize: hp(2),
        color: 'black',
        marginBottom: hp(2),
    },
    noResultsText: {
        marginHorizontal: '5%',
        marginTop: '1%',
        marginBottom: '4%',
        fontSize: hp(2),
        color: 'black',
    },
    qrDataText: {
        fontSize: hp(2),
        color: 'black',
        marginBottom: hp(1),
        paddingHorizontal: '5%',
    },
    linkButton: {
        backgroundColor: '#2196F3',
        paddingVertical: hp(2),
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: '5%',
    },
    linkButtonText: {
        color: '#FFFFFF',
        fontSize: hp(2),
        fontWeight: 'bold',
    },
    paymentButton: {
        backgroundColor: theme.colors.main,
        paddingVertical: hp(1.5),
        borderRadius: 10,
        alignItems: 'center',
        marginTop: hp(2),
        marginHorizontal: '5%',
    },
    paymentButtonText: {
        color: '#FFFFFF',
        fontSize: hp(1.8),
        fontWeight: 'bold',
    },
    paymentButtonNoActive: {
        backgroundColor: '#B0B0B0',
        paddingVertical: hp(1.5),
        borderRadius: 10,
        alignItems: 'center',
        marginTop: hp(2),
        marginHorizontal: '5%',
    },
});

export default ProfileStatusScreen;
