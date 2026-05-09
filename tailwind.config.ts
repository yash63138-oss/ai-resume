import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde7ff',
          200: '#c2d2ff',
          300: '#9db3ff',
          400: '#7489ff',
          500: '#4f5eff',
          600: '#3b3ef5',
          700: '#2e2dd8',
          800: '#2626ae',
          900: '#252789',
          950: '#161653',
        },
        accent: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
        },
        surface: {
          DEFAULT: '#0f0f23',
          card: '#16163a',
          elevated: '#1e1e4a',
          border: '#2a2a5a',
          muted: '#3a3a6a',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4f5eff 0%, #8b5cf6 50%, #ec4899 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0f0f23 0%, #16163a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(79,94,255,0.1) 0%, rgba(139,92,246,0.05) 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(240,100%,74%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(266,100%,74%,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,74%,0.2) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(79, 94, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'brand': '0 0 30px rgba(79, 94, 255, 0.3)',
        'brand-lg': '0 0 60px rgba(79, 94, 255, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(79, 94, 255, 0.2)',
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.4)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.4)',
        'inset-brand': 'inset 0 0 30px rgba(79, 94, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
