
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decode, encode, decodeAudioData } from '../utils/audioHelpers';
// Added missing Icons import to fix the error on line 127
import { Icons } from '../constants';

interface LiveSessionProps {
  onStateChange: (state: 'happy' | 'thinking' | 'speaking') => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ onStateChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    try {
      setError(null);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              onStateChange('speaking');
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) onStateChange('happy');
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live session error:', e);
            setError('Connection error. Please check your microphone and API key.');
            setIsActive(false);
          },
          onclose: () => {
            setIsActive(false);
            onStateChange('happy');
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are Yuki, a cheerful and helpful anime girl voice assistant. Be concise, expressive, and use occasional Japanese honorifics like -kun or -chan appropriately. Always remain in character.',
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to start voice session.');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    onStateChange('happy');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
      <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-pink-100 scale-110' : 'bg-gray-100'}`}>
        {isActive && (
          <div className="absolute inset-0 rounded-full animate-ping bg-pink-300 opacity-20"></div>
        )}
        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${isActive ? 'bg-pink-500 shadow-pink-200 shadow-2xl' : 'bg-gray-400'}`}>
          <Icons.Mic />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isActive ? 'Yuki is listening...' : 'Ready to talk?'}
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          {isActive 
            ? 'Just start speaking. I will respond to you in real-time with my own voice!' 
            : 'Click the button below to start a magical voice conversation.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 px-6 py-3 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={isActive ? stopSession : startSession}
        className={`px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all active:scale-95 ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-100' 
            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-pink-200'
        }`}
      >
        {isActive ? 'Stop Session' : 'Start Calling Yuki'}
      </button>
    </div>
  );
};

export default LiveSession;
