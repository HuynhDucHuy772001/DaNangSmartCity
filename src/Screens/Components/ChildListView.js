import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const ChildListView = ({ data, loading, onRefresh, formatCCCD }) => {
    const navigation = useNavigation();

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.main} />
            ) : (
                <FlatList
                    style={{ height: hp(100), width: wp(100), marginTop: '2%' }}
                    data={data}
                    renderItem={({ item, index }) => (
                        <View key={index} style={styles.content_list}>
                            <View style={styles.viewTenVaNgaySinh}>
                                <Text style={styles.textHoTen}>Họ và tên: {item.ho_va_ten}</Text>
                                <Text style={styles.textNgaySinh}>Ngày sinh: {formatDate(item.ngay_thang_nam_sinh)}</Text>
                            </View>

                            <View style={styles.viewCCCD_DVCT_TDT}>
                                <Text style={styles.textCCCD_DVCT_TDT}>CCCD/CMND: {formatCCCD(item.so_cmnd_cccd)}</Text>
                            </View>

                            <View style={styles.viewCCCD_DVCT_TDT}>
                                <Text style={styles.textCCCD_DVCT_TDT}>Đơn vị công tác: {item.don_vi_cong_tac}</Text>
                            </View>

                            <View style={styles.viewCCCD_DVCT_TDT}>
                                <Text style={styles.textCCCD_DVCT_TDT}>Trường đào tạo: {item.truong_dao_tao}</Text>
                            </View>

                            <TouchableOpacity
                                style={{ alignItems: 'flex-end' }}
                                onPress={() => navigation.navigate("detailview", { infor: item })}
                            >
                                <Text style={styles.textXemChiTiet}>Xem chi tiết thông tin>>></Text>
                            </TouchableOpacity>
                        </View>
                    )
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                        />
                    }
                />
            )}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content_list: {
        display: 'flex',
        flex: 1,
        marginVertical: '1%',
        marginHorizontal: '2%',
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.xx,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: wp(96.5),
        padding: '1%',
    },
    viewTenVaNgaySinh: {
        flexDirection: 'row',
        marginVertical: '2%',
        marginHorizontal: '2%',
    },
    viewCCCD_DVCT_TDT: {
        marginVertical: '2%',
        marginHorizontal: '2%',
    },
    textHoTen: {
        fontWeight: theme.fontWeights.semibold,
        fontSize: hp(1.9),
        width: '60%',
    },
    textNgaySinh: {
        fontSize: hp(1.85),
    },
    textCCCD_DVCT_TDT: {
        fontSize: hp(1.8),
    },
    textXemChiTiet: {
        fontStyle: 'italic',
        color: theme.colors.main,
        fontSize: hp(2),
    }
})

export default ChildListView;
