
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { blobToBase64 } from '../utils/audioHelpers';

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setAnalysis(null);
    }
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64 = await blobToBase64(image);

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: image.type } },
            { text: "Analyze this image in detail. What do you see? If it's anime-related, identify the style or characters." }
          ]
        },
        config: {
          systemInstruction: 'You are Yuki, a visual expert. Describe images with enthusiasm and detail.'
        }
      });

      setAnalysis(response.text || 'I see many wonderful things, but my processing missed the details.');
    } catch (err) {
      console.error(err);
      setAnalysis('Gomenasai! I could not analyze this image right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white/60 p-8 rounded-3xl border border-pink-100 shadow-xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Vision Lab 👁️
        </h2>

        <div className="space-y-6">
          <div className="relative h-64 border-4 border-dashed border-pink-100 rounded-3xl overflow-hidden flex items-center justify-center bg-pink-50/20 group hover:border-pink-300 transition-all">
            {preview ? (
              <img src={preview} className="w-full h-full object-contain" alt="Target" />
            ) : (
              <div className="text-center">
                <p className="text-gray-400 font-medium">Drop an image here</p>
                <p className="text-xs text-gray-300">or click to browse</p>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={onSelect}
            />
          </div>

          <button
            onClick={analyze}
            disabled={!image || loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
              loading ? 'bg-gray-300' : 'bg-pink-500 hover:bg-pink-600 active:scale-95'
            }`}
          >
            {loading ? 'Analyzing with AI Vision...' : 'Analyze Image'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-pink-50 animate-fade-in">
          <h3 className="text-sm font-bold text-pink-500 mb-3 uppercase tracking-wider">Analysis Report</h3>
          <div className="prose text-gray-700 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
