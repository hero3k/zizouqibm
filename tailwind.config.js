/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 荔枝主题色彩
        lychee: {
          pink: '#FF6B9D',
          green: '#4ECDC4',
          gold: '#FFD700',
          fire: '#FF5722',
        }
      },
      backgroundImage: {
        'gradient-lychee': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-pink': 'linear-gradient(135deg, #FF6B9D 0%, #FF8A80 100%)',
        'gradient-green': 'linear-gradient(135deg, #4ECDC4 0%, #26A69A 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { textShadow: '0 0 20px #FFD700, 0 0 30px #FFD700' },
          to: { textShadow: '0 0 30px #FFD700, 0 0 40px #FFD700' }
        }
      }
    },
  },
  plugins: [],
} 