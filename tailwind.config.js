/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 赛博朋克配色
        cyber: {
          bg: '#0a0a12',
          panel: '#12121f',
          border: '#1e1e35',
          neon: '#00ffd1',        // 青绿霓虹
          pink: '#ff2e88',        // 品红
          purple: '#b14bff',      // 紫
          yellow: '#ffe94b',      // 霓虹黄
          blue: '#4bc7ff',        // 电蓝
          dim: '#6b6b8a',
          text: '#e6e6ff',
        },
      },
      boxShadow: {
        'neon-green': '0 0 8px rgba(0,255,209,0.6), 0 0 20px rgba(0,255,209,0.3)',
        'neon-pink': '0 0 8px rgba(255,46,136,0.6), 0 0 20px rgba(255,46,136,0.3)',
        'neon-purple': '0 0 8px rgba(177,75,255,0.6), 0 0 20px rgba(177,75,255,0.3)',
        'neon-blue': '0 0 8px rgba(75,199,255,0.6), 0 0 20px rgba(75,199,255,0.3)',
      },
      animation: {
        'flicker': 'flicker 2.4s infinite',
        'scan': 'scan 6s linear infinite',
        'blink': 'blink 1s steps(2) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
