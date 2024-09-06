import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const LookupOption = ({ icon, text, onPress }) => (
    <Pressable style={styles.utilities} onPress={onPress}>
        <View style={styles.optionContent}>
            <Image source={icon} style={styles.optionIcon} />
            <Text style={styles.textUtilities}>{text}</Text>
        </View>
        <Image source={require('../../assets/images/next.png')} style={styles.nextIcon} />
    </Pressable>
);

const Lookup = ({ navigation }) => {
    const lookupOptions = [
        {
            icon: require('../../assets/images/iconmoigioiBDS.png'),
            text: 'Tra cứu chứng chỉ hành nghề bất động sản',
            onPress: () => navigation.navigate('BDS')
        },
        {
            icon: require('../../assets/images/clipboard.png'),
            text: 'Tra cứu thông tin tình trạng hồ sơ',
            onPress: () => navigation.navigate('profilestatus')
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Tra cứu thông tin</Text>
            </View>
            <ScrollView style={styles.containerLookup} showsVerticalScrollIndicator={false}>
                {lookupOptions.map((option, index) => (
                    <React.Fragment key={index}>
                        <LookupOption {...option} />
                        {index < lookupOptions.length - 1 && <View style={styles.separator} />}
                    </React.Fragment>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: theme.colors.main,
        padding: 15,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        alignItems: 'center',
    },
    heading: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white,
    },
    containerLookup: {
        backgroundColor: 'white',
        width: wp(90),
        marginTop: hp(2),
        alignSelf: 'center',
        borderRadius: 10,
    },
    utilities: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '3%',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        height: wp(8),
        width: wp(8),
    },
    textUtilities: {
        fontSize: hp(1.8),
        paddingLeft: '2%',
        flex: 1,
    },
    nextIcon: {
        alignSelf: 'center',
    },
    separator: {
        borderBottomColor: '#C9C9C9',
        borderBottomWidth: 1,
    },
});

export default Lookup;
