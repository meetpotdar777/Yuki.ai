# Yuki.ai - Your Magical Anime Voice Assistant ✨

Yuki.ai is a high-performance, anime-themed AI assistant powered by the latest Gemini 3 and 2.5 series models. It provides a seamless, multi-modal experience combining real-time voice interaction, advanced reasoning, and creative image generation.

**Written by Me**

## 🌟 Key Features

- **Live Voice Interaction**: Powered by `gemini-2.5-flash-native-audio-preview-12-2025`, Yuki responds in real-time with human-like spoken audio.
- **Thinking Mode Chat**: Engage in deep reasoning tasks using `gemini-3-pro-preview` with an optional high-capacity thinking budget for complex problem solving.
- **Art Studio**: Generate high-quality 1K, 2K, or 4K anime-style images using `gemini-3-pro-image-preview`.
- **Photo Filter Magic**: Edit existing images using natural language prompts with `gemini-2.5-flash-image`.
- **Vision Lab**: Upload images for detailed analysis and style identification using Yuki's advanced computer vision capabilities.
- **Voice Transcription**: Record audio and receive instant, accurate text transcriptions.

## 🚀 Tech Stack

- **Frontend**: React 19, Tailwind CSS, TypeScript
- **AI Core**: `@google/genai` (Google Gemini SDK)
- **Audio Processing**: Web Audio API (PCM streaming and decoding)
- **Styling**: Google Fonts (Quicksand & Comfortaa), Glassmorphism UI

## 🛠️ Getting Started

### Prerequisites
- A modern web browser with Microphone and Camera permissions enabled.
- An API Key from Google AI Studio.

### Installation
1. Ensure you have the `process.env.API_KEY` configured in your environment.
2. The application uses ESM modules imported directly via `esm.sh` in the `index.html` import map.
3. Open `index.html` in a supported environment to launch the app.

## 🎨 UI/UX Design

Yuki.ai features a soft, pastel-toned interface designed to feel welcoming and "kawaii." 
- **Glassmorphism**: Backdrop blurs and translucent panels create a modern, lightweight feel.
- **Responsive Sidebar**: Easily switch between different AI modes.
- **Reactive Character**: The persistent character portrait changes based on whether Yuki is thinking, speaking, or waiting for you.

## 📜 Permissions
The app requests the following permissions to function fully:
- `microphone`: Required for Live Voice and Transcription.
- `camera`: Required for future video streaming features and image uploads.

## ⚖️ License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Created with ❤️ and magic. Written by Me.*