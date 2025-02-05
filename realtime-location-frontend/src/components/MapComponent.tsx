import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation } from '../hooks/useLocation';

// Mapbox access token
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent: React.FC<{ username: string }> = ({ username }) => {
  const [start, setStart] = useState<{ latitude: number; longitude: number } | null>(null);
  const [end, setEnd] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isShared, setIsShared] = useState<boolean>(false);
  const { currentUser, users, error, createRide, matchingRides } = useLocation(username);

  // Map viewport state
  const [viewport, setViewport] = useState({
    latitude: currentUser?.latitude || 0,
    longitude: currentUser?.longitude || 0,
    zoom: 13,
  });

  // Update viewport when the current user's location changes
  useEffect(() => {
    if (currentUser) {
      setStart({ latitude: currentUser.latitude, longitude: currentUser.longitude });
      setViewport({
        latitude: currentUser.latitude,
        longitude: currentUser.longitude,
        zoom: 13,
      });
    }
  }, [currentUser]);

  // Handle ride creation
  const handleCreateRide = () => {
    if (start && end) {
      createRide(start, end, isShared);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* Mapbox Map */}
      <ReactMapGL
        {...viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {/* Current User Marker */}
        {currentUser && (
          <Marker latitude={currentUser.latitude} longitude={currentUser.longitude}>
            <div style={{ color: 'blue', fontSize: '20px' }}>📍</div>
            <Popup latitude={currentUser.latitude} longitude={currentUser.longitude}>
              {currentUser.username} (You)
            </Popup>
          </Marker>
        )}

        {/* Other Users Markers */}
        {users.map((user) => (
          <Marker key={user.id} latitude={user.latitude} longitude={user.longitude}>
            <div style={{ color: 'red', fontSize: '20px' }}>📍</div>
            <Popup latitude={user.latitude} longitude={user.longitude}>
              {user.username}
            </Popup>
          </Marker>
        ))}

        {/* Matching Rides Polylines */}
        {matchingRides.map((ride) => (
          <Source
            key={ride.id}
            id={`ride-${ride.id}`}
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [ride.start.longitude, ride.start.latitude],
                  [ride.end.longitude, ride.end.latitude],
                ],
              },
            }}
          >
            <Layer
              id={`ride-line-${ride.id}`}
              type="line"
              paint={{
                'line-color': 'blue',
                'line-width': 3,
              }}
            />
          </Source>
        ))}
      </ReactMapGL>

      {/* Ride Creation Form */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000,
        }}
      >
        <h3>Create a Ride</h3>
        <label>
          Start: {start ? `${start.latitude}, ${start.longitude}` : 'Not set'}
        </label>
        <br />
        <label>
          End Latitude:
          <input
            type="number"
            value={end?.latitude || ''}
            onChange={(e) =>
              setEnd((prev) => ({
                latitude: parseFloat(e.target.value),
                longitude: prev?.longitude || 0,
              }))
            }
          />
        </label>
        <br />
        <label>
          End Longitude:
          <input
            type="number"
            value={end?.longitude || ''}
            onChange={(e) =>
              setEnd((prev) => ({
                latitude: prev?.latitude || 0,
                longitude: parseFloat(e.target.value),
              }))
            }
          />
        </label>
        <br />
        <label>
          Share Ride:
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
          />
        </label>
        <br />
        <button onClick={handleCreateRide}>Create Ride</button>
      </div>

      {/* Matching Rides List */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000,
        }}
      >
        <h3>Matching Rides</h3>
        {matchingRides.length > 0 ? (
          <ul>
            {matchingRides.map((ride) => (
              <li key={ride.id}>
                Ride from ({ride.start.latitude}, {ride.start.longitude}) to (
                {ride.end.latitude}, {ride.end.longitude})
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching rides found.</p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default MapComponent;