import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "./App.css";

// Custom Icons
const iconUrls = {
  pothole: "https://cdn-icons-png.flaticon.com/512/290/290968.png",
  traffic: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  water: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
  pollution: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
};
const createIcon = (url) =>
  new L.Icon({
    iconUrl: url,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.2/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.2/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.2/dist/images/marker-shadow.png",
});

function App() {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [accuracy, setAccuracy] = useState(0);
  const [reports, setReports] = useState([]);
  const [userType, setUserType] = useState("citizen");
  const [randomEvents, setRandomEvents] = useState([]);
  const [realTimeData, setRealTimeData] = useState({
    carbonEmission: 0,
    activeProjects: 0,
    roadIssues: 0,
  });

  // Geolocation
  useEffect(() => {
    navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setAccuracy(pos.coords.accuracy);
      },
      (err) => console.error(err.message)
    );
  }, []);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports");
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err.message);
      }
    };
    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  // Random events
  useEffect(() => {
    const events = [];
    const types = ["pothole", "traffic", "water", "pollution"];
    for (let i = 0; i < 6; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      events.push({
        type,
        position: [position[0] + latOffset, position[1] + lngOffset],
      });
    }
    setRandomEvents(events);
  }, [position]);

  // Real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        carbonEmission: Math.floor(Math.random() * 1000),
        activeProjects: Math.floor(Math.random() * 50),
        roadIssues: Math.floor(Math.random() * 20),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      {/* Hero */}
      <div className="hero">
        <h1>CityPulse</h1>
        <p>
          Real-time urban growth tracking, infrastructure monitoring, and
          citizen engagement for smarter cities.
        </p>
        <div className="hero-stats">
          <div><b>{realTimeData.activeProjects}</b><span>Active Projects</span></div>
          <div><b>{realTimeData.carbonEmission}</b><span>Carbon Emissions</span></div>
          <div><b>{realTimeData.roadIssues}</b><span>Road Issues</span></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Map */}
        <div className="map-section">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
            <Circle center={position} radius={accuracy} />

            {reports.map((r, i) => (
              <Marker key={i} position={[r.lat, r.lng]}>
                <Popup>
                  <b>{r.roadType} {r.roadNo}</b><br />
                  {r.description}
                </Popup>
              </Marker>
            ))}

            {randomEvents.map((e, i) => (
              <Marker key={i} position={e.position} icon={createIcon(iconUrls[e.type])}>
                <Popup>{e.type}</Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className="view-toggle">
            <button onClick={() => setUserType("citizen")}
              className={userType === "citizen" ? "active" : ""}>Citizen View</button>
            <button onClick={() => setUserType("official")}
              className={userType === "official" ? "active" : ""}>Official View</button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="side-panel">
          <div className="card">
            <h3>Live Alerts</h3>
            <ul>
              <li className="yellow">Heavy congestion on Main St</li>
              <li className="blue">Water maintenance scheduled</li>
              <li className="red">Road closure due to construction</li>
            </ul>
          </div>
          <div className="card">
            <h3>Project Status</h3>
            <p className="green">Completed: 23</p>
            <p className="blue">In Progress: 15</p>
            <p className="red">Delayed: 3</p>
            <p className="yellow">Planned: 8</p>
          </div>

          {/* Report Form */}
          {userType === "citizen" && (
            <CitizenReportForm position={position} accuracy={accuracy} />
          )}
        </div>
      </div>

      {/* Features */}
      <div className="features">
        <h2>Platform Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <a href="http://127.0.0.1:5000" target="_blank">AI Score</a> 
          </div>
          <div className="feature-card">
            <a href="http://127.0.0.1:5005" target="_blank">Satellite</a>
          </div>
          <div className="feature-card">
            <a href="http://127.0.0.1:5002" target="_blank">Digital Twin</a>
          </div>
          <div className="feature-card">
            <a href="http://127.0.0.1:8080" target="_blank">Budget</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Report Issue Form
function CitizenReportForm({ position, accuracy }) {
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [roadType, setRoadType] = useState("");
  const [roadNo, setRoadNo] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("country", country);
    formData.append("state", stateName);
    formData.append("city", city);
    formData.append("roadType", roadType);
    formData.append("roadNo", roadNo);
    formData.append("description", description);
    formData.append("lat", position[0]);
    formData.append("lng", position[1]);
    formData.append("timestamp", new Date().toISOString());
    if (file) formData.append("file", file);

    const res = await axios.post("http://localhost:5000/api/report", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(res.data.message || "✅ Report submitted successfully");
    setCountry("");
    setStateName("");
    setCity("");
    setRoadType("");
    setRoadNo("");
    setDescription("");
    setFile(null);
  } catch (err) {
    console.error("Error submitting report:", err.response?.data || err.message);
    alert("❌ Failed to submit report. Try again.");
  }
    }
  

  return (
    <form onSubmit={handleSubmit} className="report-form">
      <h3>Report an Issue</h3>
      <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} required />
      <input type="text" placeholder="State" value={stateName} onChange={e => setStateName(e.target.value)} required />
      <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
      <select value={roadType} onChange={e => setRoadType(e.target.value)} required>
        <option value="">--Select Road Type--</option>
        <option value="National Highway">National Highway</option>
        <option value="State Highway">State Highway</option>
        <option value="Municipality">Municipality</option>
        <option value="Gram Panchayat">Gram Panchayat</option>
      </select>
      <input type="text" placeholder="Road No" value={roadNo} onChange={e => setRoadNo(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files[0])} />
      <button type="submit" className="btn-primary">Submit Report</button>
    </form>
  );
}

export default App;
