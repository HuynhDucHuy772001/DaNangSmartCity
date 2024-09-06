import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchDataFromAPI } from '../../../API/api';
import ChildListView from '../../Components/ChildListView';
import SearchBar from '../../Components/SearchBar';
import { hp, wp } from '../../../helpers/common';
import MultiSelectUni from '../../Components/MultiSelectUni';
import { theme } from '../../../constants/theme';

const { height, width } = Dimensions.get('window');

const ListView = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [originData, setOriginData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('ho_va_ten');
    const [searchText, setSearchText] = useState('');
    const [selectedUniversities, setSelectedUniversities] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const apiData = await fetchDataFromAPI();
            setData(apiData); // Cập nhật dữ liệu hiện tại
            setOriginData(apiData); // Cập nhật dữ liệu gốc
            setIsLoading(false);
        } catch (error) {
            console.log('Lỗi khi gọi API:', error);
            setIsLoading(false);
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
        let filteredData = originData;

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
        }
        setData(filteredData);
    };

    useEffect(() => {
        filterInfor();
    }, [searchText, selectedUniversities]);

    const university = [
        { label: 'Đại học Duy Tân', value: 'Đại học Duy Tân' },
        { label: 'Đại học Kiến trúc Đà Nẵng', value: 'Đại học Kiến\ntrúc Đà Nẵng' },
        { label: 'Đại học Bách khoa Đà Nẵng', value: 'Đại học Bách khoa Đà Nẵng' }
    ];

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
        setSearchText('');
    }

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

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.main} style={{ marginTop: '50%' }} />
            ) : data.length === 0 ? (
                <Text style={styles.noDataText}>Không có thông tin bạn cần tìm kiếm</Text>
            ) : (
                <ChildListView data={data} loading={isLoading} refreshing={refreshing} onRefresh={onRefresh} formatCCCD={formatCCCD} />
            )}
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
        alignItems: 'center',
        width: '100%',
    },

    heading: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white,
        textAlign: 'center',
    },

    noDataText: {
        fontSize: 16,
        color: theme.colors.gray,
        textAlign: 'center',
        backgroundColor: 'white',
        height: hp(100),
        paddingTop: '50%',
        fontStyle: 'italic',
    },
});

export default ListView;
