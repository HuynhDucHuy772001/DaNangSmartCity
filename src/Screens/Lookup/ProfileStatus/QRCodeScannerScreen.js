import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { hp, wp } from '../../../helpers/common';
import { theme } from '../../../constants/theme';
import { launchImageLibrary } from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';

const QRCodeScannerScreen = ({ navigation }) => {
    const handleQRCodeRead = ({ data }) => {
        console.log("Mã quét được:", data);
        navigation.navigate('profilestatus', { qrData: data });
    };

    const handleCancelPress = () => {
        navigation.goBack();
    };

    // const openMoMoWithQRData = (qrData) => {
    //     const momoDeeplink = `momo://app?action=payWithApp&isScanQR=true&qr=${encodeURIComponent(qrData)}`;

    //     Linking.openURL(momoDeeplink)
    //         .catch(err => console.error('Không thể mở MoMo:', err));
    // };

    const openLibraryImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.didCancel) {
                console.log('Hủy chọn ảnh từ thư viện');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                console.log('URI hình ảnh được chọn: ', response.assets?.[0]?.uri);
                const imagePath = response.assets?.[0]?.uri;
                RNQRGenerator.detect({ uri: imagePath })
                    .then(result => {
                        const { values } = result;
                        if (values?.length > 0) {
                            const qrData = values[0]; // Extract the first detected QR code value
                            console.log("Mã quét được:", qrData)
                            // openMoMoWithQRData(qrData)
                            navigation.navigate('profilestatus', { qrData }); // Pass the detected QR code data to ProfileStatusScreen
                        } else {
                            console.log('Không tìm thấy mã QR Code');
                            Alert.alert(
                                'Thông báo',
                                'Không tìm thấy mã QR Code từ hình ảnh đã chọn'
                            )
                        }
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });
            }
        });
    };

    return (
        <View style={styles.container}>
            <QRCodeScanner
                onRead={handleQRCodeRead}
                flashMode={RNCamera.Constants.FlashMode.torch}
                showMarker={true}
                reactivate={true}
                reactivateTimeout={800}
                cameraStyle={styles.cameraContainer}
                customMarker={
                    <View style={styles.customMarker}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                }
            />
            <TouchableOpacity style={styles.cancelButtonContainer} onPress={handleCancelPress}>
                <Image style={styles.cancelButton} source={require('../../../assets/images/close.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickImageButtonContainer} onPress={openLibraryImage}>
                <Image source={require('../../../assets/images/qr-code-white.png')} style={{ height: 30, width: 30, marginRight: '5%' }} />
                <Text style={styles.pickImageButtonText}>Chọn hình QR Code có sẵn</Text>
            </TouchableOpacity>
            <View style={styles.topContent}>
                <Text style={styles.topText}>Hướng camera về phía mã QR</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    cameraContainer: {
        height: '100%',
        width: '100%',
    },
    topContent: {
        position: 'absolute',
        top: hp(20),
        left: 0,
        right: 0,
        padding: 20,
        alignItems: 'center',
    },
    topText: {
        fontSize: hp(2),
        color: 'white',
        textAlign: 'center',
    },
    customMarker: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderColor: '#FFFFFF',
        borderWidth: 5,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopLeftRadius: 10,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopRightRadius: 10,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomLeftRadius: 10,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomRightRadius: 10,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    cancelButtonContainer: {
        position: 'absolute',
        top: hp(2),
        left: wp(5),
        backgroundColor: theme.colors.neutral(0.12),
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        height: wp(4),
        width: wp(4),
    },
    pickImageButtonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: hp(5),
        backgroundColor: theme.colors.neutral(0.15),
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
    pickImageButtonText: {
        color: 'white',
        fontSize: hp(1.8),
        textAlign: 'center',
    },
});

export default QRCodeScannerScreen;
