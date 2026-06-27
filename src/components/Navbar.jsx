import { useState, useEffect } from 'react';

export default function Navbar({ statuses = {} }) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 border-b border-brand-border bg-brand-bg-secondary px-6 flex items-center justify-between shrink-0 select-none shadow-md z-30">
      {/* Sahayta Logo & Glow */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center">
          {/* Subtle logo pulse glow */}
          <div className="absolute inset-0 bg-brand-fire-alert/20 rounded-full blur-md animate-pulse"></div>
          <svg className="w-7 h-7 text-brand-fire relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <span className="font-sans font-bold text-lg tracking-wider text-white">
            SAHAYTA <span className="text-brand-fire font-medium text-sm">NABHOSIGHT</span>
          </span>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="hidden md:flex items-center space-x-6 text-xs text-brand-secondary font-sans">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${statuses.wildfire !== 'degraded' ? 'bg-brand-safe shadow-[0_0_8px_rgba(16,185,129,0.7)]' : 'bg-brand-fire-alert shadow-[0_0_8px_rgba(239,68,68,0.7)]'} animate-pulse`}></span>
          <span>Wildfire Module</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${statuses.victim !== 'degraded' ? 'bg-brand-safe shadow-[0_0_8px_rgba(16,185,129,0.7)]' : 'bg-brand-fire-alert shadow-[0_0_8px_rgba(239,68,68,0.7)]'} animate-pulse`}></span>
          <span>Victim Detection</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${statuses.flood !== 'degraded' ? 'bg-brand-safe shadow-[0_0_8px_rgba(16,185,129,0.7)]' : 'bg-brand-fire-alert shadow-[0_0_8px_rgba(239,68,68,0.7)]'} animate-pulse`}></span>
          <span>Flood Area Mapping</span>
        </div>
      </div>

      {/* UTC Live Clock */}
      <div className="flex items-center space-x-2 text-xs font-mono text-brand-teal bg-brand-bg-primary/60 border border-brand-border px-3 py-1 rounded">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{utcTime}</span>
      </div>
    </header>
  );
}
