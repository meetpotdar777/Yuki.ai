
import React from 'react';
import { AppMode } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMode, setActiveMode, isOpen, toggle }) => {
  const menuItems = [
    { id: AppMode.LIVE, label: 'Live Voice', icon: Icons.Mic },
    { id: AppMode.CHAT, label: 'Chat Assistant', icon: Icons.Chat },
    { id: AppMode.IMAGE_GEN, label: 'Art Studio', icon: Icons.Image },
    { id: AppMode.IMAGE_EDIT, label: 'Photo Filter', icon: Icons.Edit },
    { id: AppMode.ANALYZE, label: 'Vision Lab', icon: Icons.Image },
    { id: AppMode.TRANSCRIPT, label: 'Transcribe', icon: Icons.Mic },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white/50 backdrop-blur-lg border-r border-pink-100 flex flex-col`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold shadow-pink-200 shadow-lg">
          Y
        </div>
        {isOpen && <span className="font-bold text-gray-700 font-['Comfortaa']">Menu</span>}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMode(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-200' 
                  : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
              }`}
            >
              <Icon />
              {isOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-pink-100">
        <button 
          onClick={toggle}
          className="w-full py-2 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
        >
          {isOpen ? 'Collapse' : '→'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
