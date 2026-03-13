import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDF8EC', 100: '#F8EDD0', 200: '#F0D9A0', 300: '#E5C265',
          400: '#D4A832', 500: '#C8A84B', 600: '#A8882A', 700: '#856A1E',
          800: '#5C4A15', 900: '#352A0B',
        },
        obsidian: {
          50: '#F5F5F5', 100: '#E8E8E8', 200: '#C8C8C8', 300: '#9A9A9A',
          400: '#6B6B6B', 500: '#3D3D3D', 600: '#252525', 700: '#1A1A1A',
          800: '#111111', 900: '#0A0A0B',
        },
        surface: {
          bg: '#FAFAF8', card: '#FFFFFF', subtle: '#F5F3EE',
          border: '#E8E3D8', divider: '#F0EBE0',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      boxShadow: {
        gold:      '0 4px 24px rgba(200,168,75,0.30)',
        'gold-lg': '0 8px 48px rgba(200,168,75,0.40)',
        card:      '0 2px 4px rgba(10,10,11,0.08), 0 1px 2px rgba(10,10,11,0.04)',
        'lg-soft': '0 8px 24px rgba(10,10,11,0.12)',
        'xl-soft': '0 16px 48px rgba(10,10,11,0.16)',
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      backgroundImage: {
        'grid-gold': "linear-gradient(rgba(200,168,75,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(200,168,75,0.07) 1px, transparent 1px)",
      },
      backgroundSize: { grid: '80px 80px' },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}

export default config
