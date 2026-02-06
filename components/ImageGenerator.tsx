
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ImageSize } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = async () => {
    // Note: window.aistudio.hasSelectedApiKey is assumed to exist in this environment
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      return true; // Proceed assuming success per instructions
    }
    return true;
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);

    try {
      await checkApiKey();
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: size
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
      if (imagePart) {
        setResult(`data:image/png;base64,${imagePart.inlineData.data}`);
      } else {
        throw new Error('No image was generated. Please try a different prompt.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setError(err.message || 'Artistic malfunction! Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/40 border border-pink-100 rounded-3xl p-8 backdrop-blur-md shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Art Studio 🎨</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Image Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A magical forest with neon butterflies in anime style..."
              className="w-full p-4 rounded-xl border border-pink-100 bg-white/60 focus:ring-2 focus:ring-pink-300 focus:outline-none h-32 resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold text-gray-600 mb-2">Resolution</label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-3 rounded-xl border transition-all ${
                      size === s 
                        ? 'bg-pink-500 border-pink-500 text-white shadow-lg' 
                        : 'bg-white border-pink-100 text-gray-500 hover:border-pink-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={generating}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${
                generating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
              }`}
            >
              {generating ? 'Summoning Art...' : 'Generate Art'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-[10px] text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Pro feature requires a billing-enabled API key.
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-pink-400 underline ml-1">Learn more</a>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white p-4 rounded-3xl shadow-2xl animate-scale-in">
          <img src={result} alt="Generated Art" className="w-full rounded-2xl border border-pink-50" />
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-gray-400">Resolution: {size}</span>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = result;
                link.download = 'yuki-art.png';
                link.click();
              }}
              className="text-pink-500 text-sm font-bold hover:underline"
            >
              Download Masterpiece
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
