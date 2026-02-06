
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { blobToBase64 } from '../utils/audioHelpers';

const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim()) return;
    setIsProcessing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = await blobToBase64(selectedImage);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: selectedImage.type } },
            { text: prompt }
          ]
        }
      });

      const editedPart = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
      if (editedPart) {
        setResultImage(`data:image/png;base64,${editedPart.inlineData.data}`);
      }
    } catch (err) {
      console.error(err);
      alert('Oh no! Yuki failed to edit the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/40 p-8 rounded-3xl border border-pink-100 shadow-xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Photo Filter Magic ✨</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/50 flex flex-col items-center justify-center relative overflow-hidden group">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-500 mx-auto mb-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Select a photo to edit</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">What should Yuki change?</label>
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a retro filter' or 'Make it anime style'"
                className="w-full p-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <button
              onClick={handleEdit}
              disabled={!selectedImage || !prompt || isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                isProcessing ? 'bg-gray-400' : 'bg-pink-500 hover:bg-pink-600 shadow-lg'
              }`}
            >
              {isProcessing ? 'Editing...' : 'Apply Magic'}
            </button>
          </div>

          <div className="bg-white/60 rounded-2xl border border-pink-50 p-4 flex flex-col items-center justify-center relative min-h-[300px]">
            {resultImage ? (
              <>
                <img src={resultImage} className="max-w-full rounded-xl shadow-lg mb-4" alt="Result" />
                <button 
                  onClick={() => setResultImage(null)}
                  className="text-pink-500 text-sm font-bold hover:underline"
                >
                  Clear Result
                </button>
              </>
            ) : (
              <p className="text-gray-400 italic text-sm text-center">
                Your edited photo will appear here! Yuki is ready when you are.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
