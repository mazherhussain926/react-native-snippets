import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

const Salat = () => {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const convertTo12HourFormat = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; 
    return `${formattedHour}:${minute} ${ampm}`;
  };

  useEffect(() => {
    const fetchLocationAndPrayerTimes = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
        );
        const data = await response.json();
        setPrayerTimes(data.data.timings);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchLocationAndPrayerTimes();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prayer Times</Text>
      <Text style={styles.time}>Fajr: {convertTo12HourFormat(prayerTimes.Fajr)}</Text>
      <Text style={styles.time}>Dhuhr: {convertTo12HourFormat(prayerTimes.Dhuhr)}</Text>
      <Text style={styles.time}>Asr: {convertTo12HourFormat(prayerTimes.Asr)}</Text>
      <Text style={styles.time}>Maghrib: {convertTo12HourFormat(prayerTimes.Maghrib)}</Text>
      <Text style={styles.time}>Isha: {convertTo12HourFormat(prayerTimes.Isha)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  time: {
    fontSize: 18,
    marginVertical: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default Salat;
