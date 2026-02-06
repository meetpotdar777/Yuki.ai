
import React, { useState, useEffect } from 'react';
import { AppMode } from './types';
import Sidebar from './components/Sidebar';
import LiveSession from './components/LiveSession';
import ChatBot from './components/ChatBot';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import ImageAnalyzer from './components/ImageAnalyzer';
import AudioTranscriber from './components/AudioTranscriber';
import CharacterVisual from './components/CharacterVisual';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.LIVE);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Character emotional state (placeholder for future reactivity)
  const [emotion, setEmotion] = useState<'happy' | 'thinking' | 'speaking'>('happy');

  return (
    <div className="flex h-screen w-full bg-white/30 backdrop-blur-xl">
      <Sidebar 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        isOpen={isSidebarOpen} 
        toggle={() => setSidebarOpen(!isSidebarOpen)} 
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-pink-100/50 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-['Comfortaa']">
              Yuki.ai
            </span>
          </div>
          <div className="text-sm font-medium text-pink-500/80">
            Current Status: Online & Sparkly ✨
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto h-full">
              {activeMode === AppMode.LIVE && <LiveSession onStateChange={setEmotion} />}
              {activeMode === AppMode.CHAT && <ChatBot />}
              {activeMode === AppMode.IMAGE_GEN && <ImageGenerator />}
              {activeMode === AppMode.IMAGE_EDIT && <ImageEditor />}
              {activeMode === AppMode.ANALYZE && <ImageAnalyzer />}
              {activeMode === AppMode.TRANSCRIPT && <AudioTranscriber />}
            </div>
          </div>

          {/* Persistent Character Portrait */}
          <div className="hidden lg:flex w-80 flex-col items-center justify-center p-4 border-l border-pink-100/50 bg-white/20">
            <CharacterVisual emotion={emotion} />
            <div className="mt-6 p-4 rounded-2xl bg-white/60 shadow-lg border border-pink-50 text-center">
              <p className="text-pink-600 text-sm italic">
                "{activeMode === AppMode.LIVE ? "I'm listening! Let's talk about anything." : "How can I help you today, senpai?"}"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
