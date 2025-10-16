import React from 'react';
import { Platform } from '../types';
import { PLATFORMS } from '../constants';
import { PlusIcon } from './icons/PlusIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface SidebarProps {
  selectedPlatform: Platform;
  setSelectedPlatform: (platform: Platform) => void;
  onAddNew: () => void;
  isSidebarVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedPlatform, setSelectedPlatform, onAddNew, isSidebarVisible, onClose }) => {
  return (
    <aside className={`bg-slate-950 flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarVisible ? 'w-64 p-4' : 'w-0 p-0'}`}>
      <div className="flex items-center justify-between mb-10 pl-1 min-w-[224px]">
         <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg mr-3 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Script.io</h1>
         </div>
         <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white" title="Collapse sidebar">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-grow min-w-[224px]">
        <nav>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Platforms</h2>
            <ul>
            {PLATFORMS.map((platform) => (
                <li key={platform.name}>
                <button
                    onClick={() => setSelectedPlatform(platform.name)}
                    title={`Switch to ${platform.name} scripts`}
                    className={`w-full flex items-center p-3 rounded-lg my-1 transition-all duration-200 text-base ${
                    selectedPlatform === platform.name
                        ? `bg-slate-700/50 text-white font-semibold shadow-inner`
                        : `text-slate-400 hover:bg-slate-800/50 hover:text-white`
                    }`}
                >
                    <span className={platform.color}>{platform.icon}</span>
                    <span className="ml-4 font-medium">{platform.name}</span>
                </button>
                </li>
            ))}
            </ul>
        </nav>
      </div>
      <div className="min-w-[224px]">
        <button 
            onClick={onAddNew}
            title="Create a new script for the selected platform"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center text-base">
            <PlusIcon className="w-5 h-5 mr-2"/>
            New Script
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;