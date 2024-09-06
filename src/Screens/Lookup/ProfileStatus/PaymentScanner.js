import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { hp, wp } from '../../../helpers/common';
import { theme } from '../../../constants/theme';

const PaymentScanner = ({ navigation }) => {
    const [scanned, setScanned] = useState(false);

    const handleQRCodeRead = ({ data }) => {
        if (scanned) return;
        setScanned(true);

        // Assuming the QR code contains a MoMo payment link
        const momoDeeplink = `momo://app?action=payWithApp&isScanQR=true&qr=${encodeURIComponent(data)}`;

        Linking.canOpenURL(momoDeeplink).then(supported => {
            if (supported) {
                Linking.openURL(momoDeeplink);
            } else {
                Alert.alert(
                    'Không thể mở MoMo',
                    'Vui lòng cài đặt ứng dụng MoMo để tiếp tục thanh toán.',
                    [
                        { text: 'OK', onPress: () => setScanned(false) }
                    ]
                );
            }
        }).catch(err => {
            console.error('An error occurred', err);
            setScanned(false);
        });
    };

    const handleCancelPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <QRCodeScanner
                onRead={handleQRCodeRead}
                flashMode={RNCamera.Constants.FlashMode.auto}
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
            <View style={styles.topContent}>
                <Text style={styles.topText}>Hướng camera về phía mã thanh toán</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
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

export default PaymentScanner;
