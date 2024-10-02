import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchDataFromAPI } from '../../../API/api';
import SearchBar from '../../Components/SearchBar';
import { hp, wp } from '../../../helpers/common';
import MultiSelectUni from '../../Components/MultiSelectUni';
import { theme } from '../../../constants/theme';

const { height, width } = Dimensions.get('window');

const ListView = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [filterDataAll, setFilteredDataAll] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ho_va_ten');
    const [searchText, setSearchText] = useState('');
    const [selectedUniversities, setSelectedUniversities] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchData = async () => {
        try {
            const apiData = await fetchDataFromAPI();
            setData(apiData); // Cập nhật dữ liệu hiện tại
        } catch (error) {
            console.log('Lỗi khi gọi API:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    function removeDiacritics(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    const handleSearch = () => {
        filterInfor();
    };

    const filterInfor = () => {
        let filteredData = data;

        if (searchText || selectedUniversities.length > 0) {
            filteredData = filteredData.filter(item => {
                let matchesSearchText = true;
                let matchesUniversity = true;

                if (searchText) {
                    if (selectedCategory === 'ho_va_ten') {
                        const ho_va_tenKhongDau = removeDiacritics(item.ho_va_ten.toLowerCase())
                        matchesSearchText = ho_va_tenKhongDau.includes(searchText.toLowerCase());
                    } else if (selectedCategory === 'so_cmnd_cccd') {
                        matchesSearchText = item.so_cmnd_cccd.toLowerCase().includes(searchText.toLowerCase());
                    } else if (selectedCategory === 'don_vi_cong_tac') {
                        const don_vi_cong_tacKhongDau = removeDiacritics(item.don_vi_cong_tac.toLowerCase())
                        matchesSearchText = don_vi_cong_tacKhongDau.includes(searchText.toLowerCase());
                    } else if (selectedCategory === 'truong_dao_tao') {
                        const truong_dao_taoKhongDau = removeDiacritics(item.truong_dao_tao.toLowerCase())
                        matchesSearchText = truong_dao_taoKhongDau.includes(searchText.toLowerCase());
                    }
                }

                if (selectedUniversities.length > 0) {
                    matchesUniversity = selectedUniversities.includes(item.truong_dao_tao);
                }

                return matchesSearchText && matchesUniversity;
            });
            setHasSearched(true);
            setFilteredDataAll(filteredData);
        }
    };

    useEffect(() => {
        filterInfor();
    }, [searchText, selectedUniversities]);

    const university = [
        { label: 'Đại học Duy Tân', value: 'Đại học Duy Tân' },
        { label: 'Đại học Kiến trúc Đà Nẵng', value: 'Đại học Kiến\ntrúc Đà Nẵng' },
        { label: 'Đại học Bách khoa Đà Nẵng', value: 'Đại học Bách khoa Đà Nẵng' }
    ];

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatCCCD = (cccd) => {
        const start = cccd.slice(0, 2);
        const end = cccd.slice(-2);
        return `${start}xxxxx${end}`;
    }

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={styles.container_heading}>
                <View style={{ width: width * 0.1 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../../assets/images/back.png')} style={{ width: wp(4), height: wp(4) }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: width * 0.74 }}>
                    <Text style={styles.heading}>Tra cứu hành nghề kiến trúc</Text>
                </View>
            </View>

            <SearchBar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSearchText={setSearchText}
                handleSearch={handleSearch}
            />

            <MultiSelectUni university={university} setSelectedUniversities={setSelectedUniversities} />

            {/* {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.main} style={{ marginTop: '50%' }} />
            ) : data.length === 0 ? (
                <Text style={styles.noDataText}>Không có thông tin bạn cần tìm kiếm</Text>
            ) : (
                <ChildListView data={data} loading={isLoading} refreshing={refreshing} onRefresh={onRefresh} formatCCCD={formatCCCD} />
            )} */}

            {filterDataAll.length > 0 ? (
                <ScrollView>
                    <Text style={styles.resultsTitle}>Kết quả tìm kiếm:</Text>
                    <View style={styles.resultsContainer}>
                        {filterDataAll.map((item, index) => (
                            <View key={index} style={styles.resultItem}>
                                <Text style={styles.resultText}>({index + 1}) Họ và tên: {item.ho_va_ten}</Text>
                                <Text style={styles.resultText}>Ngày sinh: {formatDate(item.ngay_thang_nam_sinh)}</Text>
                                <Text style={styles.resultText}>CCCD/CMND: {formatCCCD(item.so_cmnd_cccd)}</Text>
                                <Text style={styles.resultText}>Trình độ chuyên môn: {item.trinh_do_chuyen_mon}</Text>
                                <Text style={styles.resultText}>Lĩnh vực cấp CCHN: {item.linh_vuc_cap_cchn}</Text>
                                <Text style={styles.resultText}>Đơn vị công tác: {item.don_vi_cong_tac}</Text>
                                <Text style={styles.resultText}>Trường đào tạo: {item.truong_dao_tao}</Text>
                                <Text style={styles.resultText}>Hệ đào tạo: {item.he_dao_tao}</Text>
                                <Text style={styles.resultText}>Ghi chú: {item.ghi_chu}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                hasSearched ? (
                    <View>
                        <Text style={styles.resultsTitle}>Kết quả tìm kiếm:</Text>
                        <Text style={styles.noResultsText}>Không có kết quả. Vui lòng thử lại hoặc liên hệ Tổng đài 0236 1022 (*1022) để được hỗ trợ</Text>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.resultsTitle}>Nhập thông tin ở phía trên để tìm kiếm</Text>
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container_heading: {
        flexDirection: 'row',
        color: 'white',
        backgroundColor: theme.colors.main,
        padding: 15,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        alignItems: 'center',
        width: '100%',
    },
    heading: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white,
        textAlign: 'center',
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

export default ListView;
