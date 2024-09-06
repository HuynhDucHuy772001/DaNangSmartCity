import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/theme';
import { hp } from '../../helpers/common';

function SearchAndCategory({ handleSearch, categoryList, onCategoryClick, active }) {
  const [searchText, setSearchText] = useState('');

  const onSearchButtonPress = () => {
    handleSearch(searchText);
  };

  const onChangeText = (text) => {
    setSearchText(text);
    if (text === '') {
      handleSearch(text);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm sự kiện"
          placeholderTextColor="gray"
          onChangeText={onChangeText}
          value={searchText}
          clearButtonMode="always"
        />

        <TouchableOpacity onPress={onSearchButtonPress}>
          <Image source={require('../../assets/images/search.png')} style={{ height: hp(3), width: hp(3) }} />
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: '2%', height: hp(5) }}>
        <FlatList
          data={categoryList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onCategoryClick(item.id)}>
              <Text style={
                item.id === active ? styles.category_select
                  : styles.category_unselect}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: '2%',
    marginTop: '2%',
    marginBottom: '2%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9C9C9',
    // shadowColor: theme.colors.main,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    height: hp(5),
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: hp(1.8),
    color: 'black',
    height: hp(6),
  },
  category_select: {
    marginRight: 8,
    fontSize: hp(1.8),
    fontWeight: 'bold',
    backgroundColor: theme.colors.main,
    color: theme.colors.white,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.main,
  },
  category_unselect: {
    marginRight: 8,
    fontSize: hp(1.8),
    fontWeight: 'bold',
    backgroundColor: theme.colors.white,
    color: '#C9C9C9',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9C9C9',
  },
});

export default SearchAndCategory;
