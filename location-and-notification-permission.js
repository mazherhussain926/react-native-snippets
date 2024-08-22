import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null); 
  const [country, setCountry] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState(null);

  useEffect(() => {
    let subscription;

    const fetchPermissions = async () => {
      try {
        // Request location permissions
        let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Request notification permissions
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        setNotificationPermission(notificationStatus === 'granted');

        // Fetch location data
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          async (userLocation) => {
            const { latitude, longitude } = userLocation.coords;
            setLocation(userLocation.coords);

            try {
              const [reverseGeocodeResult] = await Location.reverseGeocodeAsync(
                { latitude, longitude },
                { useGoogleMaps: false }
              );
              if (reverseGeocodeResult) {
                setCity(reverseGeocodeResult.city || 'Unknown City');
                setCountry(reverseGeocodeResult.country || 'Unknown Country');
              }
            } catch (geoError) {
              console.error('Error during reverse geocoding:', geoError);
              setCity('Error fetching city');
            }
            
            setLoading(false);
          }
        );
      } catch (error) {
        setErrorMsg('Error fetching location');
        setLoading(false);
      }
    };

    fetchPermissions();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (notificationPermission) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
  }, [notificationPermission]);

  return (
    <LocationContext.Provider value={{ location, city, country, errorMsg, loading, notificationPermission }}>
      {children}
    </LocationContext.Provider>
  );
};
