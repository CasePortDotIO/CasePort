import { useState, useEffect } from "react";

export interface GeoLocation {
  city: string;
  state: string;
  stateCode: string;
  country: string;
  latitude: number;
  longitude: number;
  detected: boolean;
}

/**
 * Hook to detect user's geographic location using IP geolocation API
 * Falls back to default location if detection fails
 */
export function useGeoLocation(defaultCity = "New York", defaultState = "New York", defaultStateCode = "NY") {
  const [location, setLocation] = useState<GeoLocation>({
    city: defaultCity,
    state: defaultState,
    stateCode: defaultStateCode,
    country: "US",
    latitude: 40.7128,
    longitude: -74.006,
    detected: false,
  });

  useEffect(() => {
    // Try to get location from IP geolocation API
    const fetchGeoLocation = async () => {
      try {
        // Using ip-api.com (free tier, no key required)
        const response = await fetch("https://ip-api.com/json/?fields=city,state,stateCode,country,lat,lon");
        const data = await response.json();

        if (data.status === "success") {
          setLocation({
            city: data.city || defaultCity,
            state: data.state || defaultState,
            stateCode: data.stateCode || defaultStateCode,
            country: data.country || "US",
            latitude: data.lat || 40.7128,
            longitude: data.lon || -74.006,
            detected: true,
          });
        }
      } catch (error) {
        // Silently fail and use default location
        console.log("Geo-detection failed, using default location");
      }
    };

    fetchGeoLocation();
  }, []);

  return location;
}
