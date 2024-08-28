import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const Lookup = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container_heading}>
                <Text style={styles.heading}>Tra cứu thông tin</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                <ScrollView style={styles.containerLookup} showsVerticalScrollIndicator={false}>
                    <Pressable style={styles.utilities} onPress={() => navigation.navigate('BDS')}>
                        <View style={{ flexDirection: 'row', padding: '3%', alignItems: 'center' }}>
                            <Image source={require('../../assets/images/iconmoigioiBDS.png')} style={{ height: wp(8), width: wp(8) }} />
                            <Text style={styles.textUtilities}>Tra cứu chứng chỉ hành nghề bất động sản động sản</Text>
                        </View>
                        <Image source={require('../../assets/images/next.png')} style={{ alignSelf: 'center', paddingRight: '3%' }} />
                    </Pressable>
                    <View style={styles.separator} />
                    <Pressable style={styles.utilities} onPress={() => navigation.navigate('profilestatus')}>
                        <View style={{ flexDirection: 'row', padding: '3%', alignItems: 'center' }}>
                            <Image source={require('../../assets/images/clipboard.png')} style={{ height: wp(8), width: wp(8) }} />
                            <Text style={styles.textUtilities}>Tra cứu thông tin tình trạng hồ sơ</Text>
                        </View>
                        <Image source={require('../../assets/images/next.png')} style={{ alignSelf: 'center', paddingRight: '3%' }} />
                    </Pressable>
                    <View style={styles.separator} />
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container_heading: {
        flexDirection: 'row',
        color: 'white',
        backgroundColor: theme.colors.main,
        padding: 15,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        justifyContent: 'center'
    },
    heading: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white,
    },
    containerLookup: {
        backgroundColor: 'white',
        width: wp(90),
        height: hp(80),
        marginTop: hp(2),
        borderRadius: 10
    },
    utilities: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textUtilities: {
        fontSize: hp(1.8),
        paddingLeft: '2%',
        width: wp(72),
    },
    separator: {
        borderBottomColor: '#C9C9C9',
        borderBottomWidth: 1,
    },
});

export default Lookup;
