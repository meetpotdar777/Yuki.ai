
import React from 'react';

interface CharacterVisualProps {
  emotion: 'happy' | 'thinking' | 'speaking';
}

const CharacterVisual: React.FC<CharacterVisualProps> = ({ emotion }) => {
  // Using a stylized placeholder from Picsum for now, but in a real app this would be a Lottie or Rive file
  const getAvatarUrl = () => {
    switch (emotion) {
      case 'thinking': return 'https://picsum.photos/seed/yuki_think/400/600';
      case 'speaking': return 'https://picsum.photos/seed/yuki_talk/400/600';
      default: return 'https://picsum.photos/seed/yuki_happy/400/600';
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
      <div className="relative overflow-hidden rounded-2xl w-64 h-96 border-4 border-white shadow-2xl">
        <img 
          src={getAvatarUrl()} 
          alt="Yuki-chan" 
          className={`w-full h-full object-cover transition-transform duration-700 ${emotion === 'speaking' ? 'scale-105' : 'scale-100'}`}
        />
        {/* Overlay for status effects */}
        {emotion === 'thinking' && (
          <div className="absolute top-4 right-4 animate-bounce">
            <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-purple-600 shadow-sm border border-purple-100">
              Thinking...
            </span>
          </div>
        )}
        {emotion === 'speaking' && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-1 h-6 bg-pink-400 rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterVisual;
