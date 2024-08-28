import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const SearchBar = ({ selectedCategory, setSelectedCategory, setSearchText, handleSearch }) => {
    const [searchText, setLocalSearchText] = useState('');

    const onSearchButtonPress = () => {
        setSearchText(searchText);
        handleSearch();
    };

    const onChangeText = (text) => {
        setLocalSearchText(text);
        if (text === '') {
            setSearchText(text);
            handleSearch();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: hp(2.2), fontWeight: theme.fontWeights.medium, color: "black" }}>Tra cứu theo</Text>
            <View style={styles.searchContainer}>
                <RNPickerSelect
                    value={selectedCategory}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    items={[
                        { label: 'Họ và tên', value: 'ho_va_ten' },
                        { label: 'CCCD/CMND', value: 'so_cmnd_cccd' },
                        { label: 'Đơn vị công tác', value: 'don_vi_cong_tac' },
                        { label: 'Trường đào tạo', value: 'truong_dao_tao' }
                    ]}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false} // Tùy chỉnh thêm trên Android
                />
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập thông tin tìm kiếm..."
                        value={searchText}
                        onChangeText={onChangeText}
                    />

                    <TouchableOpacity onPress={onSearchButtonPress}>
                        <Image source={require("../../assets/images/search.png")} style={{ alignSelf: "flex-end" }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: 'white',
        width: wp(96),
        marginHorizontal: "2%",
        paddingVertical: "2%"
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: theme.colors.main,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginLeft: "2%",
        width: wp(64),
        height: hp(6)
    },
    input: {
        flex: 1,
        fontSize: hp(1.8),
        color: 'black',
        height: hp(6),
    },
    searchIcon: {
        marginRight: 10,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        height: hp(6),
        fontSize: hp(1.8),
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: theme.colors.main,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: wp(30),
        color: "black",
    },
});

export default SearchBar;
