import React, { useState } from 'react';
import MapComponent from './components/MapComponent';

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [tempUsername, setTempUsername] = useState<string>('');

  const handleJoin = () => {
    if (tempUsername.trim() !== '') {
      setUsername(tempUsername);
      // The MapComponent will handle joining and location tracking
      // Optionally, you can add authentication or other user management here
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {!username ? (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1>Welcome to Real-Time Location Tracker</h1>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setTempUsername(e.target.value)}
            style={{ padding: '10px', width: '200px' }}
          />
          <br />
          <button onClick={handleJoin} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Join
          </button>
        </div>
      ) : (
        <MapComponent username={username} />
      )}
    </div>
  );
};

export default App;