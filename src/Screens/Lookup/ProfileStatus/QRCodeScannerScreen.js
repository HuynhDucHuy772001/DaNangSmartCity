import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { hp, wp } from '../../../helpers/common';
import { theme } from '../../../constants/theme';

const QRCodeScannerScreen = ({ navigation }) => {
    const handleQRCodeRead = ({ data }) => {
        console.log("Mã Khi Quét:", data);
        navigation.navigate('profilestatus', { qrData: data });
    };

    const handleCancelPress = () => {
        navigation.goBack();
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
        width: wp(4)
    },
});

export default QRCodeScannerScreen;
