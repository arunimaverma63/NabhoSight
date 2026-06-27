import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WildfireModule from './components/WildfireModule';
import VictimModule from './components/VictimModule';
import FloodModule from './components/FloodModule';
import { ToastContainer } from './components/Toast';

const INITIAL_ACTIVITIES = [
  { module: 'wildfire', message: 'NASA FIRMS stream synced with Java Spring API.', timestamp: '10m ago', detail: 'SUCCESS' },
  { module: 'flood', message: 'FastAPI segmentation model weights initialized successfully.', timestamp: '25m ago', detail: 'U-NET' },
  { module: 'victim', message: 'Roboflow YOLOv8 victim classification endpoint connected.', timestamp: '40m ago', detail: 'ACTIVE' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Live fluctuating latency metrics to make the command center feel real
  const [healthStats, setHealthStats] = useState({
    javaBackend: { status: 'online', latency: 24 },
    pythonFastAPI: { status: 'online', latency: 45 },
    roboflow: { status: 'online', latency: 120 }
  });

  // Periodically fluctuate server latency values slightly
  useEffect(() => {
    const timer = setInterval(() => {
      setHealthStats(prev => ({
        javaBackend: {
          status: 'online',
          latency: Math.max(12, Math.min(60, prev.javaBackend.latency + Math.floor(Math.random() * 9 - 4)))
        },
        pythonFastAPI: {
          status: 'online',
          latency: Math.max(30, Math.min(90, prev.pythonFastAPI.latency + Math.floor(Math.random() * 11 - 5)))
        },
        roboflow: {
          status: 'online',
          latency: Math.max(90, Math.min(220, prev.roboflow.latency + Math.floor(Math.random() * 21 - 10)))
        }
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const addToast = (title, message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (module, message, detail = '') => {
    const newAct = {
      module,
      message,
      detail,
      timestamp: 'Just now'
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 8)]); // keep last 9 entries
  };

  // Status updates for LEDs
  const statuses = {
    wildfire: healthStats.javaBackend.latency > 55 ? 'degraded' : 'online',
    victim: healthStats.roboflow.latency > 200 ? 'degraded' : 'online',
    flood: healthStats.pythonFastAPI.latency > 85 ? 'degraded' : 'online',
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-brand-bg-primary font-sans text-gray-200">
      {/* Top Banner Navigation */}
      <Navbar statuses={statuses} />

      {/* Main Split Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav Deck */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Ops Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'dashboard' && (
            <Dashboard 
              setActiveTab={setActiveTab} 
              activities={activities} 
              healthStats={healthStats} 
            />
          )}

          {activeTab === 'wildfire' && (
            <WildfireModule 
              addToast={addToast} 
              logActivity={logActivity} 
            />
          )}

          {activeTab === 'victim' && (
            <VictimModule 
              addToast={addToast} 
              logActivity={logActivity} 
            />
          )}

          {activeTab === 'flood' && (
            <FloodModule 
              addToast={addToast} 
              logActivity={logActivity} 
            />
          )}
        </main>
      </div>

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
