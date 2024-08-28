import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../constants/theme';
import { hp, wp } from '../../../helpers/common';

const { height, width } = Dimensions.get('window');

const DetailView = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { infor } = route.params;

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
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={styles.container_heading}>
                <View style={{ width: width * 0.1 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require("../../../assets/images/back.png")} style={{ width: wp(4), height: wp(4) }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: width * 0.74 }}>
                    <Text style={styles.heading}>Tra cứu hành nghề kiến trúc</Text>
                </View>
            </View>

            <View>
                <Text style={styles.tiltle}>Thông tin chi tiết hành nghề kiến trúc:</Text>
            </View>

            <View style={styles.viewTenVaNgaySinh}>
                <Text style={styles.textHoTen}>Họ và tên: {infor.ho_va_ten}</Text>
                <Text style={styles.textNgaySinh}>Ngày sinh: {formatDate(infor.ngay_thang_nam_sinh)}</Text>
            </View>

            <View style={styles.viewCCCD_DVCT_LVC_TDCM_GC}>
                <Text style={styles.textCCCD_DVCT_LVC_TDCM_GC}>CCCD/CMND: {formatCCCD(infor.so_cmnd_cccd)}</Text>
            </View>

            <View style={styles.viewCCCD_DVCT_LVC_TDCM_GC}>
                <Text style={styles.textCCCD_DVCT_LVC_TDCM_GC}>Trình độ chuyên môn: {infor.trinh_do_chuyen_mon}</Text>
            </View>

            <View style={styles.viewCCCD_DVCT_LVC_TDCM_GC}>
                <Text style={styles.textCCCD_DVCT_LVC_TDCM_GC}>Lĩnh vực cấp CCHN: {infor.linh_vuc_cap_cchn}</Text>
            </View>

            <View style={styles.viewCCCD_DVCT_LVC_TDCM_GC}>
                <Text style={styles.textCCCD_DVCT_LVC_TDCM_GC}>Đơn vị công tác: {infor.don_vi_cong_tac}</Text>
            </View>

            <View style={styles.viewTDT_HDT}>
                <Text style={styles.textTDT}>Trường đào tạo: {infor.truong_dao_tao}</Text>
                <Text style={styles.textHDT}>Hệ đào tạo: {infor.he_dao_tao}</Text>
            </View>

            <View style={styles.viewCCCD_DVCT_LVC_TDCM_GC}>
                <Text style={styles.textCCCD_DVCT_LVC_TDCM_GC}>Ghi chú: {infor.ghi_chu}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container_heading: {
        flexDirection: 'row',
        color: theme.colors.white,
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
    tiltle: {
        fontSize: hp(2.4),
        marginHorizontal: "2%",
        marginVertical: "2%",
        fontWeight: theme.fontWeights.bold
    },
    viewTenVaNgaySinh: {
        flexDirection: 'row',
        marginVertical: "2%",
        marginHorizontal: "2%",
        alignContent: 'center'
    },
    viewCCCD_DVCT_LVC_TDCM_GC: {
        marginVertical: "2%",
        marginHorizontal: "2%"
    },
    textHoTen: {
        fontWeight: theme.fontWeights.semibold,
        fontSize: hp(2.1),
        width: "58%"
    },
    textNgaySinh: {
        fontSize: hp(2),
        textNgaySinh: "38%",
    },
    textCCCD_DVCT_LVC_TDCM_GC: {
        fontSize: hp(2),
    },
    viewTDT_HDT: {
        flexDirection: 'row',
        marginVertical: "2%",
        marginHorizontal: "2%"
    },
    textTDT: {
        fontSize: hp(2),
        width: "60%"
    },
    textHDT: {
        fontSize: hp(2),
    }
})

export default DetailView;
