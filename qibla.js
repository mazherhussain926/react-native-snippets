import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";

const QiblaDirection = () => {
  const [location, setLocation] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [magnetometer, setMagnetometer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationAndQibla = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          async (userLocation) => {
            setLocation(userLocation.coords);

            // Fetch Qibla direction
            try {
              const response = await axios.get(
                `http://api.aladhan.com/v1/qibla/${userLocation.coords.latitude}/${userLocation.coords.longitude}`
              );
              setQiblaDirection(response.data.data.direction);
              setLoading(false);
            } catch (error) {
              console.error("Error fetching Qibla direction: ", error);
              setLoading(false);
            }
          }
        );
      } catch (error) {
        console.error("Error fetching location: ", error);
        setLoading(false);
      }
    };

    fetchLocationAndQibla();

    // Subscribe to magnetometer updates
    const subscription = Magnetometer.addListener((data) => {
      let { x, y } = data;
      setMagnetometer(Math.atan2(y, x) * (180 / Math.PI));
    });

    return () => {
      subscription && subscription.remove();
      Location.stopObserving();
    };
  }, []);

  if (loading || !location || !magnetometer) {
    return (
        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
             <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )

  }

  // Calculate the angle between the device's heading and the Qibla direction
  const angle = qiblaDirection - magnetometer;

  return (
    <View style={styles.container}>
      <View style={styles.compassContainer}>
        <Image
          source={require("../assets/compass-needle.png")}
          style={[styles.needle, { transform: [{ rotate: `${angle}deg` }] }]}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Qibla Direction: {qiblaDirection.toFixed(2)}°
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  compassContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  needle: {
    width: 250,
    height: 250,
    position: "absolute",
  },
  textContainer: {
    padding: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});

export default QiblaDirection;
