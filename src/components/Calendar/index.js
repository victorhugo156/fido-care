import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars'

import ButtonApply from '../ButtonApply/idex';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';
import Font_Size from '../../constants/Font_Size';

export default function CalendarPicker({handleDate}) {

    const [selectedDays, setSelectedDays] = useState({});

    const handleSetDate= (day)=>{
        const dateString = day.dateString;

        if(selectedDays[dateString]){
            const updateDays = {...selectedDays};
            delete updateDays[dateString];
            setSelectedDays(updateDays)
        }else{

            setSelectedDays({
                ...selectedDays,
                [dateString]: {selected: true, selectedColor: Colors.BRIGHT_BLUE}
            });
        }
    }

    // Whenever the dates change, we pass them back to the parent via the handleDate function
    useEffect(() => {
        handleDate(selectedDays);
    }, [selectedDays]);

    return (
        <View style={styles.Container}>
            <Calendar style={styles.Calendar}
                headerStyle={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: Colors.BRIGHT_BLUE,
                    paddingBottom: 10,
                    marginBottom: 10
                }}
                theme={{
                    textMonthFontSize: 18,
                    monthTextColor: Colors.GRAY_700,
                    todayTextColor: Colors.CORAL_PINK,
                    selectedDayBackGroundColor: Colors.BRIGHT_BLUE,
                    selectedDayTextColor: Colors.WHITE,
                    calendarBackground: "transparent",
                    textDayStyle: { color: Colors.GRAY_600 }
                }}
                minDate={new Date().toDateString()}
                hideExtraDays={true}
                onDayPress={(day) => handleSetDate(day)}
                markedDates={selectedDays}
            />
        </View>



    )
}

const styles = StyleSheet.create({

    Container: {
        width: "100%",
        padding: 24
    },
    Calendar: {
        backgroundColor: "transparent"
    },
    Selected:{
        color: Colors.GRAY_700,
        fontSize: Font_Size.LG,
        marginTop: 42

    }

})