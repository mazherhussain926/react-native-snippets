import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, StatusBar, Image } from "react-native";
import axios from "axios";
import { LocationContext } from "../../context/location";
import Loader from "../../components/Loader/";
import ErrorMessage from "../../components/ErrorMessage";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { Ionicons, Entypo } from "@expo/vector-icons";
const Salat = () => {
  const {
    location,
    city,
    country,
    errorMsg: locationError,
    loading: locationLoading,
  } = useContext(LocationContext);
  const [prayerTimes, setPrayerTimes] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [fetchingPrayerTimes, setFetchingPrayerTimes] = useState(false);

  const prayerIcons = {
    Imsak: "🌅",
    Fajr: "🌄",
    Sunrise: "🌅",
    Dhuhr: "☀️",
    Asr: "🕒",
    Sunset: "🌇",
    Maghrib: "🌆",
    Isha: "🌙",
    Midnight: "🌕",
  };

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const ampm = hour >= 12 ? " PM " : " AM ";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute}${ampm}`;
  };

  const fetchPrayerTimes = async () => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}`
      );
      setPrayerTimes(response.data.data.timings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      setErrorMsg("Error fetching prayer times");
    } finally {
      setFetchingPrayerTimes(false);
    }
  };

  useEffect(() => {
    if (location) {
      setFetchingPrayerTimes(true);
      fetchPrayerTimes();
    }
  }, [location]);

  if (locationLoading) {
    return <Loader />;
  }

  if (locationError || errorMsg) {
    return <ErrorMessage message={errorMsg || locationError} />;
  }

  if (fetchingPrayerTimes) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
console.log(prayerTimes)
  const prayerTimesArray = Object.entries(prayerTimes).map(([key, value]) => ({
    name: key,
    time: convertTo12HourFormat(value),
  }));

  const sortOrder = [
    "Imsak",
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Sunset",
    "Maghrib",
    "Isha",
    "Midnight",
  ];

  const sortedPrayerTimes = prayerTimesArray
    .filter((prayer) => sortOrder.includes(prayer.name))
    .sort((a, b) => sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name));
  //console.log(sortedPrayerTimes);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        style="auto"
        backgroundColor="transparent"
        translucent={true}
      />
      <Image
        source={require("../../assets/images/welcome/mosque.png")}
        style={styles.coverImage}
      />
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons name="location-outline" size={24} color={COLORS.BLUE1} />
          <Text style={styles.locationText}>
            {city},{country}
          </Text>
        </View>
        <View style={styles.separator} />
        {sortedPrayerTimes.map((prayer, index) => (
          <View key={index} style={styles.prayerContainer}>
            <Text style={styles.prayerTimeText}>
              {" "}
              {prayerIcons[prayer.name]}
            </Text>
            <Text style={styles.prayerTimeText}>{prayer.time}</Text>
            <Text style={styles.prayerTimeText}>{prayer.name}</Text>
            <Entypo name="sound" size={20} color={COLORS.BLUE1} />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  coverImage: {
    height: 350,
    width: "100%",
    resizeMode: "cover",
    alignSelf: "center",
    marginTop: -50,
  },
  contentContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 20,
    marginTop: -60,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: COLORS.GRAY4,
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY3,
    marginVertical: 10,
  },
  prayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  prayerTimeText: {
    fontFamily: "outfit",
    color: COLORS.GRAY4,
    fontSize: 14,
    textAlign:"center"
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default Salat;
