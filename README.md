# Hack Wall

[**🚀 Live Demo**](https://marcjoha.github.io/hack-wall/)

A dynamic, sci-fi inspired countdown timer and dashboard for hackathons. Features immersive backgrounds (Matrix Rain, Starfield), soundscapes, and a highly configurable display.

## Features

- **Dynamic Backgrounds**: Choose from Matrix Rain, Starfield, Aurora, and more.
- **Soundscapes**: Integrated audio themes including Cyberpunk Drone, Deep Space, and more.
- **Configurable Timer**: Set specific end times or durations.
- **Keyboard Shortcuts**: Control the dashboard without a mouse (Arrow keys to change themes, Escape to config).
- **Responsive Design**: Adapts to various screen sizes, perfect for projectors or large monitors.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hack-wall.git
   cd hack-wall
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Start the development server:

```bash
npm run dev
```

Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory, ready to be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Controls

| Key | Action |
| :--- | :--- |
| **Escape** | Stop timer/audio and return to Configuration Screen |
| **Arrow Right/Left** | Cycle through Background Styles |
| **Arrow Up/Down** | Cycle through Soundscapes |

## Technologies

- **Vite**: Next Generation Frontend Tooling
- **TypeScript**: Typed JavaScript for better tooling and safety
- **Pico CSS**: Minimal CSS framework for semantic HTML
- **Canvas API**: For high-performance visual effects

## License

MIT
