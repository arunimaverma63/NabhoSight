import React, { useEffect, useRef, useState } from 'react';

const MOCK_HOTSPOTS = [
  { id: 'wf-1', name: 'Western Ridge Forest, Zone 3', lat: 34.0522, lng: -118.2437, brightness: 345.2, confidence: 'high', timestamp: '2026-06-27 12:45:00 UTC' },
  { id: 'wf-2', name: 'Dry Creek Canyon, Sector B', lat: 34.1205, lng: -118.3002, brightness: 320.8, confidence: 'medium', timestamp: '2026-06-27 14:12:00 UTC' },
  { id: 'wf-3', name: 'Pine Hills Reserve, Sector 8', lat: 33.9852, lng: -118.1021, brightness: 298.5, confidence: 'low', timestamp: '2026-06-27 16:30:00 UTC' },
  { id: 'wf-4', name: 'Eastern Foothills, Zone C', lat: 34.2054, lng: -118.0523, brightness: 358.4, confidence: 'high', timestamp: '2026-06-27 18:22:00 UTC' }
];

export default function WildfireModule({ addToast, logActivity }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  
  const [hotspots, setHotspots] = useState(MOCK_HOTSPOTS);
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Center Los Angeles coordinates for our mock data
    const map = window.L.map(mapContainerRef.current, {
      center: [34.08, -118.18],
      zoom: 10,
      zoomControl: false
    });

    window.L.control.zoom({ position: 'bottomright' }).addTo(map);

    // CartoDB Dark Matter Tile Layer
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers based on filtered hotspots
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => map.removeLayer(marker));
    markersRef.current = {};

    const filtered = hotspots.filter(h => {
      const regionMatch = filterRegion === 'all' || h.name.toLowerCase().includes(filterRegion);
      const confMatch = filterConfidence === 'all' || h.confidence === filterConfidence;
      return regionMatch && confMatch;
    });

    filtered.forEach((hotspot) => {
      const markerColor = hotspot.confidence === 'high' ? '#ef4444' : 
                          hotspot.confidence === 'medium' ? '#f59e0b' : '#9ca3af';

      const pulseStyle = `
        background-color: ${markerColor};
        box-shadow: 0 0 0 0 ${markerColor}b3;
      `;

      // Create a divIcon for pulsing effect
      const customIcon = window.L.divIcon({
        className: 'custom-pulsing-icon',
        html: `<div class="pulsing-marker w-4 h-4 rounded-full border-2 border-white" style="${pulseStyle}"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const popupHtml = `
        <div class="p-2 text-slate-100 bg-brand-bg-tertiary border border-brand-border rounded shadow font-sans text-xs min-w-[180px]">
          <h4 class="font-bold text-white mb-1 border-b border-brand-border pb-1">${hotspot.name}</h4>
          <div class="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 font-mono">
            <span class="text-brand-secondary">Lat/Lng:</span>
            <span class="text-right text-white">${hotspot.lat.toFixed(4)}, ${hotspot.lng.toFixed(4)}</span>
            <span class="text-brand-secondary">Brightness:</span>
            <span class="text-right text-brand-fire">${hotspot.brightness}K</span>
            <span class="text-brand-secondary">Confidence:</span>
            <span class="text-right ${
              hotspot.confidence === 'high' ? 'text-brand-fire-alert font-bold' : 
              hotspot.confidence === 'medium' ? 'text-brand-warning' : 'text-slate-400'
            } uppercase">${hotspot.confidence}</span>
          </div>
          <div class="mt-2 text-[10px] text-brand-muted text-right">${hotspot.timestamp}</div>
        </div>
      `;

      const marker = window.L.marker([hotspot.lat, hotspot.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: false,
          className: 'custom-leaflet-popup'
        });

      markersRef.current[hotspot.id] = marker;
    });
  }, [hotspots, filterRegion, filterConfidence]);

  const handleCardClick = (hotspot) => {
    const map = mapInstanceRef.current;
    const marker = markersRef.current[hotspot.id];
    if (map && marker) {
      map.setView([hotspot.lat, hotspot.lng], 12, { animate: true, duration: 1.5 });
      setTimeout(() => {
        marker.openPopup();
      }, 300);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    addToast('Wildfire Module', 'Contacting NASA FIRMS stream via backend...', 'info');
    
    setTimeout(() => {
      setIsRefreshing(false);
      const newHotspot = {
        id: `wf-${Date.now()}`,
        name: 'Southern Canyon Path, Zone A',
        lat: 34.0205 + (Math.random() - 0.5) * 0.2,
        lng: -118.2002 + (Math.random() - 0.5) * 0.2,
        brightness: 330.5 + Math.floor(Math.random() * 30),
        confidence: Math.random() > 0.4 ? 'high' : 'medium',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      };
      
      setHotspots(prev => [newHotspot, ...prev]);
      addToast('Detection Complete', `New wildfire hotspot registered in stream.`, 'success');
      logActivity('wildfire', `NASA FIRMS Stream refresh triggered: new active hotspot detected`, newHotspot.confidence.toUpperCase());
    }, 2000);
  };

  const handleDispatch = (e, hotspot) => {
    e.stopPropagation();
    addToast('Dispatch Alert Sent', `First Responders routed to ${hotspot.name}`, 'warning');
    logActivity('wildfire', `Responders dispatched to hotspot ${hotspot.name}`, `${hotspot.lat.toFixed(2)}, ${hotspot.lng.toFixed(2)}`);
  };

  const filteredHotspots = hotspots.filter(h => {
    const regionMatch = filterRegion === 'all' || h.name.toLowerCase().includes(filterRegion);
    const confMatch = filterConfidence === 'all' || h.confidence === filterConfidence;
    return regionMatch && confMatch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-brand-bg-primary">
      {/* Top Filter Bar */}
      <div className="h-14 border-b border-brand-border bg-brand-bg-secondary px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-4">
          <span className="text-xs uppercase font-bold tracking-wider text-brand-fire">
            🔥 Hotspot Streams
          </span>
          <div className="flex items-center space-x-2">
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="text-xs bg-brand-bg-tertiary border border-brand-border rounded py-1 px-2.5 text-white"
            >
              <option value="all">All Regions</option>
              <option value="forest">Forest Zones</option>
              <option value="canyon">Canyon Sectors</option>
              <option value="foothills">Foothills</option>
            </select>
            <select
              value={filterConfidence}
              onChange={(e) => setFilterConfidence(e.target.value)}
              className="text-xs bg-brand-bg-tertiary border border-brand-border rounded py-1 px-2.5 text-white"
            >
              <option value="all">All Confidences</option>
              <option value="high">High Confidence</option>
              <option value="medium">Medium Confidence</option>
              <option value="low">Low Confidence</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 text-xs bg-brand-bg-tertiary hover:bg-brand-bg-tertiary/80 border border-brand-border px-3 py-1.5 rounded text-white font-medium"
        >
          <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-fire' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
          </svg>
          <span>{isRefreshing ? 'Fetching NASA Stream...' : 'Refresh NASA FIRMS'}</span>
        </button>
      </div>

      {/* Main Panel - Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Half: Map */}
        <div className="flex-1 relative bg-brand-bg-primary h-1/2 md:h-full">
          <div ref={mapContainerRef} className="absolute inset-0 z-10" />
          {/* Overlay Map Coordinates */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none bg-brand-bg-primary/90 border border-brand-border px-3 py-1.5 rounded text-[10px] font-mono text-brand-secondary flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-brand-fire rounded-full animate-pulse"></span>
            <span>Live Stream bounds: USA Southwest (CartoDB Dark)</span>
          </div>
        </div>

        {/* Right Half: Alert Feed Panel */}
        <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-brand-border bg-brand-bg-secondary flex flex-col h-1/2 md:h-full">
          <div className="p-4 border-b border-brand-border shrink-0 flex justify-between items-center bg-brand-bg-secondary">
            <span className="text-xs uppercase font-bold tracking-wider text-white">Active Alert Feed ({filteredHotspots.length})</span>
            <span className="text-[10px] font-mono text-brand-muted">Sorted by confidence</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredHotspots.length > 0 ? (
              filteredHotspots.map((hotspot) => {
                const isHigh = hotspot.confidence === 'high';
                const isMed = hotspot.confidence === 'medium';
                const pillColor = isHigh ? 'bg-red-900/30 text-red-400 border-red-800' :
                                  isMed ? 'bg-amber-900/30 text-amber-400 border-amber-800' :
                                  'bg-slate-800/40 text-slate-400 border-slate-700';

                return (
                  <div
                    key={hotspot.id}
                    onClick={() => handleCardClick(hotspot)}
                    className="p-3.5 bg-brand-bg-tertiary/40 border border-brand-border hover:border-brand-fire/50 rounded transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-brand-fire" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        <h4 className="text-xs font-semibold text-white group-hover:text-brand-fire transition-colors truncate max-w-[180px]">
                          {hotspot.name}
                        </h4>
                      </div>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 border rounded ${pillColor}`}>
                        {hotspot.confidence}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 my-3 text-[10px] font-mono text-brand-secondary border-t border-brand-border/40 pt-2.5">
                      <span>Coordinates:</span>
                      <span className="text-right text-white">{hotspot.lat.toFixed(3)}, {hotspot.lng.toFixed(3)}</span>
                      <span>Temp (Kelvin):</span>
                      <span className="text-right text-brand-fire">{hotspot.brightness}K</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-brand-border/40 pt-2.5">
                      <span className="text-[9px] font-mono text-brand-muted">{hotspot.timestamp}</span>
                      <button
                        onClick={(e) => handleDispatch(e, hotspot)}
                        className="text-[9px] uppercase font-bold tracking-wider bg-brand-fire/20 hover:bg-brand-fire/35 border border-brand-fire text-brand-fire px-2.5 py-1 rounded transition-colors"
                      >
                        Dispatch Alert
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-brand-muted">
                <svg className="w-8 h-8 text-brand-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs">No active hotspots match the filter settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
