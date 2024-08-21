import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment-hijri';
import { COLORS } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalendarScreen() {
  const [hijriDate, setHijriDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    const todayHijri = formatHijriDate(moment());
    setHijriDate(todayHijri);
  }, []);

  const handleDayPress = (day) => {
    const selectedHijri = formatHijriDate(moment(day.dateString, 'YYYY-MM-DD'));
    setHijriDate(selectedHijri);
    setSelectedDate(day.dateString); // Update selected date
  };

  const formatHijriDate = (date) => {
    const hijriYear = date.iYear();
    const hijriMonth = date.iMonth();
    const hijriDay = date.iDate();
    const hijriDayName = date.format('dddd');
  
    // Hijri month names
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabiʿ al-Awwal', 'Rabiʿ al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaʿban',
      'Ramadan', 'Shawwal', 'Dhu al-Qiʿdah', 'Dhu al-Hijjah'
    ];
  
    return `${hijriDayName}, ${hijriDay} ${hijriMonths[hijriMonth]}, ${hijriYear} AH`;
  };

  const getMarkedDates = () => {
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: COLORS.BLUE1,
        selectedTextColor: '#FFF',
      }
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 15 }}>
        {hijriDate && (
          <View style={styles.hijriContainer}>
            <Text style={styles.hijriText}>{hijriDate}</Text>
          </View>
        )}
        <Calendar
          current={moment().format('YYYY-MM-DD')}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()} 
          theme={{
            backgroundColor: '#FFF',
            calendarBackground: '#FFF',
            textSectionTitleColor: '#B6C1CD',
            selectedDayBackgroundColor: COLORS.BLUE1, 
            selectedDayTextColor: '#FFF', 
            todayTextColor: COLORS.RED,
            dayTextColor: COLORS.GRAY4,
            textDisabledColor: '#D9E1E8',
            dotColor: '#00ADF5',
            selectedDotColor: '#FFF',
            arrowColor: COLORS.BLUE1,
            monthTextColor: COLORS.BLUE1,
            textDayFontFamily: 'outfit-medium',
            textMonthFontFamily: 'outfit-bold',
            textDayHeaderFontFamily: 'outfit-medium',
            textDayFontSize: 16,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 14,
          }}
          enableSwipeMonths={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  hijriContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  hijriText: {
    fontSize: 20,
    color: COLORS.BLUE1,
    fontWeight: 'bold',
  },
});
