import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Ops Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      borderColor: 'border-l-4 border-slate-400',
      activeColor: 'bg-slate-800/40 text-white',
    },
    {
      id: 'wildfire',
      label: 'Wildfire Detection',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
      borderColor: 'border-l-4 border-brand-fire',
      activeColor: 'bg-brand-fire/10 text-brand-fire font-medium',
    },
    {
      id: 'victim',
      label: 'Victim Detection',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      borderColor: 'border-l-4 border-brand-flood',
      activeColor: 'bg-brand-flood/10 text-brand-flood font-medium',
    },
    {
      id: 'flood',
      label: 'Flood Area Mapping',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V14a2 2 0 012-2h.08" />
        </svg>
      ),
      borderColor: 'border-l-4 border-brand-teal',
      activeColor: 'bg-brand-teal/10 text-brand-teal font-medium',
    },
  ];

  return (
    <aside className="w-64 border-r border-brand-border bg-brand-bg-secondary flex flex-col shrink-0 select-none z-20">
      <nav className="flex-1 py-4 space-y-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-6 py-3.5 text-sm transition-all hover:bg-brand-bg-tertiary text-left ${
                isActive
                  ? `${tab.borderColor} ${tab.activeColor}`
                  : 'border-l-4 border-transparent text-brand-secondary'
              }`}
            >
              <span className="mr-3.5">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-brand-border text-center text-[10px] text-brand-muted font-mono">
        v1.0.4 • ENVIRO-INTELLIGENCE
      </div>
    </aside>
  );
}
