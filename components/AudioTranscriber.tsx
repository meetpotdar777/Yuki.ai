
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { blobToBase64 } from '../utils/audioHelpers';

const AudioTranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        handleTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscription(null);
    } catch (err) {
      console.error(err);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64 = await blobToBase64(blob);

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { inlineData: { data: base64, mimeType: 'audio/webm' } },
          { text: "Transcribe this audio perfectly. Do not add any filler text." }
        ]
      });

      setTranscription(response.text || "No speech detected.");
    } catch (err) {
      console.error(err);
      setTranscription("Failed to transcribe audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Voice Transcription 📝</h2>
        <p className="text-gray-500 mt-2">Speak into the mic and I'll write it down for you.</p>
      </div>

      <div className="relative">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
            isRecording 
              ? 'bg-red-500 scale-125 animate-pulse' 
              : 'bg-gradient-to-br from-pink-400 to-purple-500 hover:scale-110 active:scale-95'
          }`}
        >
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <div className="absolute -bottom-10 left-0 right-0 text-center text-xs font-bold text-gray-400">
          {isRecording ? 'HOLDING...' : 'HOLD TO RECORD'}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-pink-500 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
          <span className="text-sm font-bold uppercase tracking-widest">Processing Audio</span>
        </div>
      )}

      {transcription && (
        <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-lg border border-pink-100 animate-scale-in">
          <p className="text-gray-800 text-lg leading-relaxed text-center italic">
            "{transcription}"
          </p>
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => navigator.clipboard.writeText(transcription)}
              className="text-xs font-bold text-pink-400 hover:text-pink-600 transition-colors uppercase"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioTranscriber;
