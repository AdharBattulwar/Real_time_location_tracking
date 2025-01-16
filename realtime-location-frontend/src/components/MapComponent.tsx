// src/components/MapComponent.tsx

import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocation } from "../hooks/useLocation";

interface MapComponentProps {
  username: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ username }) => {
  const { currentUser, users, error } = useLocation(username);
  const [viewport, setViewport] = useState({
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
    zoom: 12,
  });

  useEffect(() => {
    if (currentUser) {
      setViewport((prev) => ({
        ...prev,
        latitude: currentUser.latitude,
        longitude: currentUser.longitude,
      }));
    }
  }, [currentUser]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      dragPan={true}
      scrollZoom={true}
    >
      {/* Current User's Marker */}
      {currentUser && (
        <Marker
          longitude={currentUser.longitude}
          latitude={currentUser.latitude}
        >
          <div style={{ color: "blue" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              fill="blue"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
          </div>
        </Marker>
      )}

      {/* Other Users' Markers */}
      {users
        .filter((user) => user.id !== (currentUser?.id || ""))
        .map((user) => (
          <Marker
            key={user.id}
            longitude={user.longitude}
            latitude={user.latitude}
          >
            <div style={{ color: "red" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                fill="red"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
            </div>
          </Marker>
        ))}
    </ReactMapGL>
  );
};

export default MapComponent;
