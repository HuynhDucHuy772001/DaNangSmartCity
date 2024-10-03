import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RefreshControl } from 'react-native';
import moment from 'moment';
import 'moment/locale/vi';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

moment.locale('vi'); // Thiết lập ngôn ngữ mặc định là tiếng Việt


function ListEv({ dataEv, loading, onRefresh }) {
  const navigation = useNavigation();

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const formatDate = (dateString) => {
    const date = moment(dateString);
    const day = date.date();
    const month = date.month() + 1;
    const year = date.year();
    const dayOfWeek = capitalize(date.format('dddd')); // Lấy thứ trong tuần

    return `${dayOfWeek}, ${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
  };

  // Sắp xếp các sự kiện theo ngày
  const sortedDataEv = dataEv.sort((a, b) => {
    const dateA = moment(a.ngay_dien_ra_su_kien);
    const dateB = moment(b.ngay_dien_ra_su_kien);
    return dateB.diff(dateA);
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.main} />
      ) : (
        <FlatList
          style={{ height: hp(100), width: wp(100), backgroundColor: "white" }}
          data={sortedDataEv}
          renderItem={({ item, id }) => (
            <Animated.View
              entering={FadeInDown.delay(100).springify().damping(12)}
              key={id}
              style={styles.content_list}>
              <TouchableOpacity
                onPress={() => navigation.navigate("eventdetail", { event: item })}
                style={{ width: wp(30), height: hp(12), alignSelf: 'center' }}
              >
                <Image
                  source={{ uri: item.hinh_anh }}
                  style={{ height: '100%', width: '90%', borderRadius: theme.radius.xx }}
                  resizeMode="cover"
                />
                {item.gia_ve.loai_gia_ve === 'Miễn phí' ? (
                  <View style={styles.directionButton}>
                    <Text style={styles.textTicket}>{item.gia_ve.loai_gia_ve}</Text>
                  </View>
                ) : (
                  null
                )}
              </TouchableOpacity>
              <View style={{ width: wp(70) }}>
                <TouchableOpacity onPress={() => navigation.navigate('eventdetail', { event: item })}>
                  <Text style={styles.textNameEvent} numberOfLines={2}>{item.ten_su_kien}</Text>
                </TouchableOpacity>

                <View style={styles.viewThoiGianSuKien}>
                  <Image source={require('../../assets/images/calender.png')} style={{ height: wp(7), width: wp(7) }} />
                  <Text style={styles.info_text} numberOfLines={2}>
                    {formatDate(item.ngay_dien_ra_su_kien)} • Bấm vào để xem thời gian chi tiết
                  </Text>
                </View>

                <View style={styles.viewDiaDiem_LinhVuc}>
                  <Image source={require('../../assets/images/mappin.png')} style={{ height: wp(7), width: wp(7) }} />
                  <Text style={styles.info_text} numberOfLines={2}>{item.dia_diem.dia_chi}</Text>
                </View>

                <View style={[styles.viewDiaDiem_LinhVuc, { justifyContent: 'flex-end' }]}>
                  <Text style={{ color: theme.colors.main, fontSize: hp(1.8), fontFamily: 'Inter-ExtraBold' }}>{item.linh_vuc}</Text>
                </View>

              </View>
            </Animated.View>
          )
          }
          refreshControl={
            < RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View >
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
    flexDirection: 'row',
    flex: 1,
    marginVertical: '2%',
    marginHorizontal: '2%',
    // backgroundColor: theme.colors.white,
    // borderRadius: theme.radius.xx,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    width: wp(96.5),
  },
  textTicket: {
    fontSize: hp(1.8),
    color: 'black',
    alignSelf: 'center',
    fontWeight: '500',
  },
  textNameEvent: {
    color: 'black',
    marginLeft: '3%',
    width: wp(65),
    fontSize: hp(1.9),
    marginVertical: '2%',
    fontFamily: 'Inter-ExtraBold',
  },
  viewThoiGianSuKien: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '4%',
    marginVertical: '1%',
    width: wp(65),
  },
  viewDiaDiem_LinhVuc: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '3%',
    marginVertical: '1%',
    width: wp(62),
  },
  info_text: {
    color: 'black',
    marginLeft: '2%',
    width: wp(56),
    marginBottom: '1%',
    fontSize: hp(1.8),
    fontFamily: 'Inter-Medium',
  },
  directionButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 3,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xx,
    borderWidth: 2,
    borderColor: theme.colors.grayBG,
    marginTop: '10%',
  },
});

export default ListEv;
