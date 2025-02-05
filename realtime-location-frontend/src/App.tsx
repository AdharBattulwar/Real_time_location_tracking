import React, { useEffect, useState } from "react";
import MapComponent from "./components/MapComponent";
import * as turf from "@turf/turf";

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [tempUsername, setTempUsername] = useState<string>("");

  const handleJoin = () => {
    if (tempUsername.trim() !== "") {
      setUsername(tempUsername);
    }
  };

  const checkForRideIntersection = () => {
    const path1 = turf.lineString([
      [73.883167, 18.44259],
      [73.884212, 18.442611],
      [73.88466, 18.44262],
      [73.885198, 18.44263],
      [73.885448, 18.44313],
      [73.885642, 18.443545],
      [73.885723, 18.443752],
      [73.885733, 18.443851],
      [73.885723, 18.443948],
      [73.885688, 18.444344],
      [73.885672, 18.444466],
      [73.88565, 18.444759],
      [73.885634, 18.444892],
      [73.885597, 18.445209],
      [73.885591, 18.445306],
      [73.885578, 18.445553],
      [73.885601, 18.445768],
      [73.88564, 18.446126],
      [73.885657, 18.446385],
      [73.885669, 18.446573],
      [73.885668, 18.446803],
      [73.885667, 18.447021],
      [73.885666, 18.447164],
      [73.885623, 18.447459],
      [73.885484, 18.447851],
      [73.885262, 18.448248],
      [73.885112, 18.448512],
      [73.88499, 18.448726],
      [73.884706, 18.449207],
      [73.88453, 18.449477],
      [73.884502, 18.449519],
      [73.884369, 18.449787],
      [73.884242, 18.450003],
      [73.884231, 18.450033],
      [73.884188, 18.450153],
      [73.884125, 18.450517],
      [73.884085, 18.450883],
      [73.88407, 18.451134],
      [73.884054, 18.451392],
      [73.883909, 18.452372],
      [73.883832, 18.452855],
      [73.88381, 18.452919],
      [73.884214, 18.453163],
      [73.884256, 18.453189],
      [73.884795, 18.453562],
      [73.88491, 18.453646],
    ]);

    const path2 = turf.lineString([
      [73.883167, 18.44259],
      [73.884212, 18.442611],
      [73.88466, 18.44262],
      [73.885198, 18.44263],
      [73.885448, 18.44313],
      [73.885642, 18.443545],
      [73.885723, 18.443752],
    ]);

    const intersect = turf.lineOverlap(path1, path2);
    console.log(intersect);
  };

  useEffect(() => {
    checkForRideIntersection();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {!username ? (
        <div style={{ padding: "50px", textAlign: "center" }}>
          <h1>Welcome to Relyft - Ride Sharing App</h1>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setTempUsername(e.target.value)}
            style={{ padding: "10px", width: "200px" }}
          />
          <br />
          <button
            onClick={handleJoin}
            style={{ marginTop: "20px", padding: "10px 20px" }}
          >
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
