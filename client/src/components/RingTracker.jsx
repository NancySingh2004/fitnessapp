import React, { useState, useEffect } from 'react';
import '../css/RingTracker.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RingTracker = () => {
  const [steps, setSteps] = useState(0);
  const [heartData, setHeartData] = useState([]);
  const [sleepHours, setSleepHours] = useState(0);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const interval = setInterval(() => {
      const newRate = 60 + Math.floor(Math.random() * 60);
      const timestamp = new Date().toLocaleTimeString();
      setHeartData(prev => [...prev.slice(-20), { time: timestamp, bpm: newRate }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('⚠️ You must be logged in to submit data.');
    try {
      await fetch(`${API_BASE}/api/ring`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ steps, sleepHours })
      });
      alert('✅ Fitness data submitted!');
    } catch (err) {
      alert('❌ Error submitting data');
    }
  };

  const requestBluetoothHeartRate = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }]
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleHeartRateChanged);
    } catch (err) {
      console.error('Bluetooth error:', err);
      alert("⚠️ Bluetooth heart rate not supported or permission denied.");
    }
  };

  const saveHeartRate = async (bpm) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/heart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bpm, timestamp: new Date().toISOString() })
      });
    } catch (err) {
      console.error('Failed to save heart rate:', err);
    }
  };

  const handleHeartRateChanged = (event) => {
    const value = event.target.value;
    const bpm = value.getUint8(1);
    setHeartData(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), bpm }]);
    saveHeartRate(bpm);
  };

  return (
    <div className="ring-container">
      <h2>💍 Smart Fitness Ring Tracker</h2>

      <div className="rings">
        <div className="ring">
          <CircularProgressbar
            value={(steps / 10000) * 100}
            text={`${steps} steps`}
            styles={buildStyles({
              pathColor: '#4ade80',
              textColor: '#fff',
              trailColor: '#333'
            })}
          />
        </div>
        <div className="ring">
          <CircularProgressbar
            value={(sleepHours / 8) * 100}
            text={`${sleepHours}h sleep`}
            styles={buildStyles({
              pathColor: '#60a5fa',
              textColor: '#fff',
              trailColor: '#333'
            })}
          />
        </div>
      </div>

      <div className="input-group">
        <input
          type="number"
          value={steps}
          onChange={e => setSteps(Number(e.target.value))}
          placeholder="Steps today"
        />
        <input
          type="number"
          value={sleepHours}
          onChange={e => setSleepHours(Number(e.target.value))}
          placeholder="Sleep hours"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div className="chart-wrapper">
        <h4>❤️ Heart Rate (Live)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={heartData}>
            <XAxis dataKey="time" hide={true} />
            <YAxis domain={[50, 140]} />
            <Tooltip />
            <Line type="monotone" dataKey="bpm" stroke="#f87171" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <button onClick={requestBluetoothHeartRate} className="bluetooth-btn">
          🔗 Connect Heart Device
        </button>
      </div>
    </div>
  );
};

export default RingTracker;
