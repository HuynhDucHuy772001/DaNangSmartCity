import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../constants/theme';
import { DatePickerModal } from 'react-native-paper-dates';
import moment from 'moment';
import { hp, wp } from '../../../helpers/common';
import SearchAndCategory from '../../Components/SearchAndCategory';
import ListEv from '../../Components/ListEv';
import { fetchDataEventsFromAPI } from '../../../API/api';

const { height, width } = Dimensions.get('window');

function ListEvents() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [originData, setOriginData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [active, setActive] = useState(1);
    const [searchText, setSearchText] = useState('');

    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = useState(false);

    const onDismiss = () => setOpen(false);

    const [costValue, setCostValue] = useState(null);

    const categoryList = [
        { id: 1, name: 'Tất cả' },
        { id: 2, name: 'Lễ hội truyền thống' },
        { id: 3, name: 'Thể thao' },
        { id: 4, name: 'Văn hóa - Nghệ thuật' },
        { id: 5, name: 'Chính trị - Ngoại giao' },
        { id: 6, name: 'Hội thảo chuyên ngành' },
        { id: 7, name: 'Khác' }
    ];

    const costOptions = [
        { label: 'Có phí', value: '1' },
        { label: 'Miễn phí', value: '2' },
    ];

    function removeDiacritics(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const fetchData = async () => {
        try {
            const apiData = await fetchDataEventsFromAPI();
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

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setActive(1);
        setRefreshing(false);
        setRange({ startDate: undefined, endDate: undefined });
        setSearchText('');
        setCostValue(null);
    };

    const handleSearch = (text) => {
        setSearchText(text);
        filterEvents();
    };

    const onCategoryClick = (id) => {
        setActive(id);
        filterEvents();
    };

    const handleCostChange = (value) => {
        if (costValue === value) {
            setCostValue(null);
        } else {
            setCostValue(value);
        }
        filterEvents();
    };

    const onConfirm = ({ startDate, endDate }) => {
        setOpen(false);
        setRange({ startDate, endDate });
    };

    const filterEvents = () => {
        let filteredEvents = originData;

        //Kiểm tra lĩnh lực
        if (active !== 1) {
            filteredEvents = filteredEvents.filter(event => event.linh_vuc === categoryList[active - 1].name);
        }

        //Kiểm tra khoảng thời gian
        if (range.startDate && range.endDate) {
            filteredEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.ngay_dien_ra_su_kien);
                return eventDate >= range.startDate && eventDate <= range.endDate;
            });
        }

        //Kiểm tra chi phí
        if (costValue) {
            filteredEvents = filteredEvents.filter(event => {
                if (costValue === '2') {
                    return event.gia_ve.loai_gia_ve === 'Miễn phí';
                } else if (costValue === '1') {
                    return event.gia_ve.loai_gia_ve !== 'Miễn phí';
                }
                return false;
            });
        }

        //Tìm kiếm
        if (searchText) {
            const keywordWithoutDiacritics = removeDiacritics(searchText.toLowerCase());
            filteredEvents = filteredEvents.filter((event) => {
                const eventTitleWithoutDiacritics = removeDiacritics(event.ten_su_kien.toLowerCase());
                return eventTitleWithoutDiacritics.includes(keywordWithoutDiacritics);
            });
        }

        setData(filteredEvents);
    };

    useEffect(() => {
        filterEvents();
    }, [active, range.startDate, range.endDate, costValue, searchText]);

    const formatDate = (dateString) => {
        const date = moment(dateString);

        const day = date.date();
        const month = date.month() + 1;
        const year = date.year();

        return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    };

    const clearFilter = () => {
        fetchData();
        setActive(1);
        setRange({ startDate: undefined, endDate: undefined });
        setSearchText('');
        setCostValue(null);
    };

    const close = require('../../../assets/images/cancel.png')
    const change = require('../../../assets/images/change.png')

    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <View style={styles.container_heading}>
                <View style={{ width: width * 0.1 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require("../../../assets/images/back.png")} style={{ width: wp(4), height: wp(4) }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: width * 0.74 }}>
                    <Text style={styles.heading}>Sự kiện</Text>
                </View>
            </View>

            <SearchAndCategory
                handleSearch={handleSearch}
                onCategoryClick={onCategoryClick}
                categoryList={categoryList}
                active={active}
            />

            <View style={{ flexDirection: 'row' }}>
                {/* Chọn khoảng thời gian diễn ra sự kiện */}
                <TouchableOpacity onPress={() => setOpen(true)} uppercase={false} style={styles.buttonSelectRangeDate}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Image source={require('../../../assets/images/calendar1.png')} style={{ height: wp(5), width: wp(5) }} />
                        <Text>  </Text>
                        {range.startDate && range.endDate ? (
                            <Text style={{ color: 'black', fontSize: hp(1.8) }}>
                                {formatDate(range.startDate)} - {formatDate(range.endDate)}
                            </Text>
                        ) : (
                            <Text style={{ fontSize: hp(1.8), color: 'black' }}>Chọn khoảng ngày</Text>
                        )}
                    </View>
                </TouchableOpacity>
                {/* Chọn chi phí sự kiện */}
                <View style={styles.radioButtonGroup}>
                    {costOptions.map(option => (
                        <TouchableOpacity
                            key={option.value}
                            style={styles.radioButton}
                            onPress={() => handleCostChange(option.value)}
                        >
                            <Text style={styles.radioButtonText}>{option.label}</Text>
                            <View style={styles.radioCircle}>
                                {costValue === option.value && <View style={styles.selectedRb} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* Xóa tất cả bộ lọc */}
                <TouchableOpacity style={styles.clearFilter} onPress={clearFilter}>
                    <Image source={require('../../../assets/images/clear-filter.png')} style={{ width: wp(6), height: wp(6) }} />
                </TouchableOpacity>
            </View>

            <DatePickerModal
                locale="en-GB"
                mode="range"
                visible={open}
                onDismiss={onDismiss}
                startDate={range.startDate}
                endDate={range.endDate}
                onConfirm={onConfirm}
                saveLabel="Lưu"
                label="Chọn ngày"
                closeIcon={close}
                editIcon={change}
                calendarIcon={change}
                startLabel='Ngày bắt đầu'
                endLabel='Ngày kết thúc'
                allowEditing={true}
            />

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.main} style={{ marginTop: "50%" }} />
            ) : data.length === 0 ? (
                <Text style={styles.noDataText}>Không có sự kiện bạn tìm kiếm</Text>
            ) : (
                <ListEv
                    dataEv={data}
                    setDataEv={setData}
                    loading={isLoading}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    fetchData={fetchData}
                />
            )}
        </SafeAreaView >
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
        textAlign: 'center'
    },
    buttonSelectRangeDate: {
        backgroundColor: theme.colors.white,
        marginTop: "2%",
        marginBottom: "2%",
        width: wp(62),
        marginLeft: "1.5%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C9C9C9',
        justifyContent: 'center'
    },
    radioButtonGroup: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: "2%",
        marginBottom: "2%",
        marginLeft: "1.5%",
        borderRadius: theme.radius.xs,
        width: wp(23),
        // alignItems: 'center',
    },
    radioButton: {
        flexDirection: 'row',
    },
    radioButtonText: {
        color: 'black',
        marginRight: "15%",
        fontSize: hp(1.8)
    },
    radioCircle: {
        height: wp(4),
        width: wp(4),
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#C9C9C9',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: wp(2),
        height: wp(2),
        borderRadius: 10,
        backgroundColor: 'black',
        alignSelf: 'center'
    },
    clearFilter: {
        width: wp(9),
        backgroundColor: 'white',
        marginTop: "2%",
        marginBottom: "2%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C9C9C9',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: "1%"
    },
    noDataText: {
        fontSize: hp(2),
        color: theme.colors.gray,
        textAlign: 'center',
        backgroundColor: 'white',
        height: "100%",
        paddingTop: "50%",
        fontStyle: 'italic'
    },
});

export default ListEvents;