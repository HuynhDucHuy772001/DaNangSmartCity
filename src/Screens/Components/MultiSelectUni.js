import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { theme } from '../../constants/theme';
import { hp } from '../../helpers/common';

const MultiSelectUni = ({ university, setSelectedUniversities }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState([]);

    useEffect(() => {
        setSelectedUniversities(currentValue);
    }, [currentValue]);

    return (
        <View style={styles.dropDown}>
            <DropDownPicker
                items={university}
                open={isOpen}
                value={currentValue}
                setOpen={() => setIsOpen(!isOpen)}
                setValue={(val) => setCurrentValue(val)}
                autoScroll
                placeholder='Chọn các trường đào tạo cần lọc'
                placeholderStyle={{ fontSize: hp(1.85) }}
                showArrowIcon={true}
                multiple={true}
                mode='BADGE'
                badgeColors={theme.colors.main}
                badgeDotColors={theme.colors.grayBG}
                badgeTextStyle={{ color: "white" }}
                textStyle={{ fontSize: hp(1.85) }}
                style={{
                    borderWidth: 0,
                    height: hp(5),
                    marginBottom: "5%",
                    shadowColor: theme.colors.main,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                dropDownContainerStyle={{
                    borderWidth: 0,
                    shadowColor: theme.colors.main,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    dropDown: {
        marginHorizontal: "2%",
    }
})

export default MultiSelectUni;
