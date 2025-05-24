"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// إصلاح الأيقونات الافتراضية
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type Props = {
  onSelectLocation: (lat: number, lng: number, locationName: string) => void;
};

const LocationPicker = ({ onSelectLocation }: Props) => {
  const [position, setPosition] = useState<[number, number]>([32.0, 35.3]);
  const [locationName, setLocationName] = useState("");

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const name = data.display_name || "Unknown location";
      setLocationName(name);
      onSelectLocation(lat, lng, name);
    } catch (err) {
      setLocationName("Failed to get location name");
      onSelectLocation(lat, lng, "Unknown location");
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        fetchLocationName(lat, lng);
      },
    });
    return null;
  };

  return (
    <>
      <MapContainer
        center={position}
        zoom={9}
        scrollWheelZoom={false}
        style={{
          height: "300px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          marginTop: "10px",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        <Marker position={position} />
      </MapContainer>

      {locationName && (
        <p style={{ marginTop: "8px", fontWeight: "bold", color: "#2F855A" }}>
          Selected Location: {locationName}
        </p>
      )}
    </>
  );
};

export default LocationPicker;
