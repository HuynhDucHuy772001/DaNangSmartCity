import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../constants/theme';
import { hp, wp } from '../../../helpers/common';
import { fetchDataBDSFromAPI } from '../../../API/api';

const LookupScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [originData, setOriginData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchData = async () => {
        try {
            const apiData = await fetchDataBDSFromAPI();
            setData(apiData);
            setOriginData(apiData);
        } catch (error) {
            console.log('Lỗi khi gọi API:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const removeDiacritics = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const handleSearch = () => {
        const normalizedSearchText = removeDiacritics(searchText.toLowerCase());
        const filtered = originData.filter(item =>
            removeDiacritics(item.ho_va_ten.toLowerCase()).includes(normalizedSearchText)
        );
        setFilteredData(filtered);
        setHasSearched(true);
    };

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: hp(8) }}>
            <View style={styles.container_heading}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: 'flex-start', position: 'absolute', left: wp(4) }}>
                    <Image source={require('../../../assets/images/back.png')} style={{ width: wp(4), height: wp(4) }} />
                </TouchableOpacity>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.heading} numberOfLines={1}>Tra cứu chứng chỉ hành nghề bất động sản</Text>
                </View>
            </View>

            <View style={{ alignItems: 'center', height: 'auto' }}>
                <ScrollView style={styles.containerLookup} showsVerticalScrollIndicator={false}>
                    <Image source={require('../../../assets/images/iconmoigioiBDS.png')} style={styles.image} />
                    <Text style={styles.description}>Vui lòng nhập họ và tên để xem chứng chỉ môi giới bất động sản</Text>
                    <TextInput
                        placeholder="Nhập từ khóa tìm kiếm"
                        style={styles.textInput}
                        onChangeText={text => {
                            setSearchText(text);
                            // setHasSearched(false);
                        }}
                        value={searchText}
                    />
                    <TouchableOpacity
                        style={[styles.searchButton, { backgroundColor: searchText ? theme.colors.main : '#B0B0B0' }]}
                        disabled={!searchText}
                        onPress={handleSearch}
                    >
                        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
                    </TouchableOpacity>
                    {filteredData.length > 0 ? (
                        <View>
                            <Text style={styles.resultsTitle}>Kết quả tìm kiếm:</Text>
                            <View style={styles.resultsContainer}>
                                {filteredData.map((item, index) => (
                                    <View key={index} style={styles.resultItem}>
                                        <Text style={styles.resultText}>({index + 1}) Số chứng chỉ: {item.so_chung_chi}</Text>
                                        <Text style={styles.resultText}>Họ và tên: {item.ho_va_ten}</Text>
                                        <Text style={styles.resultText}>Ngày sinh: {item.ngay_thang_nam_sinh}</Text>
                                        <Text style={styles.resultText}>Nơi sinh: {item.noi_sinh}</Text>
                                        <Text style={styles.resultText}>Cấp lần đầu: {item.cap_lan_dau}</Text>
                                        <Text style={styles.resultText}>Ngày cấp: {item.ngay_cap}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        hasSearched && (
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
}

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
        // height: 'auto',
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
    },
    textInput: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: '5%',
        marginVertical: '4%',
        paddingLeft: 15,
        borderRadius: 10,
        fontSize: hp(2),
        borderWidth: 1,
        borderColor: '#B0B0B0',

    },
    searchButton: {
        marginHorizontal: '5%',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: '4%',
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: hp(2),
        padding: '1%',
    },
    resultsTitle: {
        marginHorizontal: '5%',
        marginTop: '4%',
        fontSize: hp(2),
        color: 'black',
    },
    resultsContainer: {
        marginHorizontal: '5%',
    },
    resultItem: {
        marginBottom: '2%',
    },
    resultText: {
        fontSize: hp(2),
        color: 'black',
        marginBottom: '1%',
    },
    noResultsText: {
        marginHorizontal: '5%',
        marginTop: '1%',
        marginBottom: '4%',
        fontSize: hp(2),
        color: 'black',
    },
});

export default LookupScreen;
