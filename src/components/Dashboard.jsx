import React from 'react';

export default function Dashboard({ setActiveTab, activities, healthStats }) {
  const modules = [
    {
      id: 'wildfire',
      title: 'Wildfire Detection',
      desc: 'Real-time FIRMS hotspot mapping and hazard alerting using Java stream feeds.',
      badge: 'NASA FIRMS Stream',
      color: 'hover:border-brand-fire/50',
      activeColor: 'text-brand-fire',
      lastRun: '1m ago',
      bgEffect: (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-tr from-brand-fire/20 to-transparent blur-2xl animate-ember-slow"></div>
        </div>
      ),
      icon: (
        <svg className="w-8 h-8 text-brand-fire" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      )
    },
    {
      id: 'victim',
      title: 'Victim Detection',
      desc: 'Identify trapped flood survivors from drone aerial imagery via Roboflow AI inference.',
      badge: 'YOLOv8 Inference',
      color: 'hover:border-brand-flood/50',
      activeColor: 'text-brand-flood',
      lastRun: '15m ago',
      bgEffect: (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[conic-gradient(from_0deg,rgba(59,130,246,0.08)_0deg,transparent_90deg)] animate-radar-sweep origin-center rounded-full"></div>
        </div>
      ),
      icon: (
        <svg className="w-8 h-8 text-brand-flood" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    },
    {
      id: 'flood',
      title: 'Flood Area Mapping',
      desc: 'Segment flood-impacted regions and calculate surface areas from satellite images.',
      badge: 'U-Net Semantic',
      color: 'hover:border-brand-teal/50',
      activeColor: 'text-brand-teal',
      lastRun: '1h ago',
      bgEffect: (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-teal/10 animate-wave-slow pointer-events-none"></div>
        </div>
      ),
      icon: (
        <svg className="w-8 h-8 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V14a2 2 0 012-2h.08" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-brand-bg-primary">
      {/* Welcome Banner */}
      <div className="border border-brand-border bg-gradient-to-r from-brand-bg-secondary to-brand-bg-tertiary p-6 rounded-lg relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-flood/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">SAHAYTA EMERGENCY OPERATIONS CONTROL (SEOC)</h2>
          <p className="text-xs text-brand-secondary mt-1 max-w-2xl leading-relaxed">
            Integrated AI dashboard monitoring environmental threats, wildfire hotspots, and automated flood rescue coordination. Use the navigation deck on the left to enter operational environments.
          </p>
        </div>
      </div>

      {/* Module Quick Nav Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveTab(mod.id)}
            className={`relative p-6 bg-brand-bg-secondary border border-brand-border rounded-lg text-left transition-all duration-300 shadow-md ${mod.color} hover:translate-y-[-4px] group`}
          >
            {mod.bgEffect}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-brand-bg-tertiary rounded-lg border border-brand-border">
                  {mod.icon}
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 border border-brand-border bg-brand-bg-primary rounded text-brand-secondary">
                  {mod.badge}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-brand-secondary mt-1.5 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted border-t border-brand-border/60 pt-3">
                <span>LAST RUN: {mod.lastRun}</span>
                <span className="flex items-center space-x-1 text-white group-hover:underline">
                  <span>Enter environment</span>
                  <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 border border-brand-border bg-brand-bg-secondary rounded-lg p-6 shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-brand-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <svg className="w-4 h-4 text-brand-warning animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Recent Activity Feed</span>
            </h3>
            <span className="text-[10px] font-mono text-brand-muted uppercase">Updates Live</span>
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[220px] pr-1">
            {activities.length > 0 ? (
              activities.map((act, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-brand-bg-tertiary/40 border border-brand-border/60 rounded">
                  <div className="flex items-start space-x-3">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      act.module === 'wildfire' ? 'bg-brand-fire' :
                      act.module === 'victim' ? 'bg-brand-flood' : 'bg-brand-teal'
                    }`} />
                    <div>
                      <p className="text-xs text-white leading-relaxed">{act.message}</p>
                      <span className="text-[10px] font-mono text-brand-muted uppercase mt-1 block">
                        {act.module} • {act.timestamp}
                      </span>
                    </div>
                  </div>
                  {act.detail && (
                    <span className="text-[10px] font-mono bg-brand-bg-primary border border-brand-border px-1.5 py-0.5 rounded text-brand-secondary shrink-0">
                      {act.detail}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-brand-muted py-10">
                No recent activity records.
              </div>
            )}
          </div>
        </div>

        {/* System Health Monitoring Panel */}
        <div className="border border-brand-border bg-brand-bg-secondary rounded-lg p-6 shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-brand-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <svg className="w-4 h-4 text-brand-safe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span>System Health</span>
            </h3>
            <span className="text-[10px] font-mono text-brand-safe uppercase">ONLINE</span>
          </div>

          <div className="flex-grow space-y-4">
            {/* Java Backend */}
            <div className="flex items-center justify-between p-3 bg-brand-bg-tertiary/40 border border-brand-border/60 rounded">
              <div>
                <p className="text-xs font-semibold text-white">Java Spring Backend</p>
                <p className="text-[10px] text-brand-muted">Core API & NASA FIRMS Sync</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-brand-safe">{healthStats.javaBackend.latency}ms</span>
                <span className="block text-[8px] uppercase font-bold text-brand-safe tracking-wider">OK</span>
              </div>
            </div>

            {/* FastAPI Service */}
            <div className="flex items-center justify-between p-3 bg-brand-bg-tertiary/40 border border-brand-border/60 rounded">
              <div>
                <p className="text-xs font-semibold text-white">Python FastAPI Service</p>
                <p className="text-[10px] text-brand-muted">Imagery & Segmentation Masking</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-brand-safe">{healthStats.pythonFastAPI.latency}ms</span>
                <span className="block text-[8px] uppercase font-bold text-brand-safe tracking-wider">OK</span>
              </div>
            </div>

            {/* Roboflow API */}
            <div className="flex items-center justify-between p-3 bg-brand-bg-tertiary/40 border border-brand-border/60 rounded">
              <div>
                <p className="text-xs font-semibold text-white">Roboflow Model Endpoint</p>
                <p className="text-[10px] text-brand-muted">Survivors Bounding Boxes AI</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-brand-safe">{healthStats.roboflow.latency}ms</span>
                <span className="block text-[8px] uppercase font-bold text-brand-safe tracking-wider">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
