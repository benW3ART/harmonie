import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Design System - Rose Pastel
        primary: {
          DEFAULT: '#E8A4B8',
          50: '#FDF5F7',
          100: '#FBEAEF',
          200: '#F5CDD8',
          300: '#EFB0C1',
          400: '#E8A4B8',
          500: '#E08AA3',
          600: '#D4617F',
          700: '#B8405F',
          800: '#8F3249',
          900: '#662435',
        },
        secondary: {
          DEFAULT: '#F5E6D3',
          50: '#FEFCFA',
          100: '#FDF9F4',
          200: '#FAF0E4',
          300: '#F7E8D4',
          400: '#F5E6D3',
          500: '#EDD5B8',
          600: '#DDB989',
          700: '#CD9D5A',
          800: '#A67D3D',
          900: '#7A5C2D',
        },
        accent: {
          DEFAULT: '#FFD4A3',
          50: '#FFFBF5',
          100: '#FFF7EB',
          200: '#FFECD2',
          300: '#FFE0B8',
          400: '#FFD4A3',
          500: '#FFC47A',
          600: '#FFB052',
          700: '#FF9C29',
          800: '#FF8800',
          900: '#CC6D00',
        },
        background: '#FFFBF7',
        foreground: '#4A4A4A',
        muted: {
          DEFAULT: '#F5E6D3',
          foreground: '#6B6B6B',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#4A4A4A',
        },
        border: '#E8D4C8',
        input: '#E8D4C8',
        ring: '#E8A4B8',
        destructive: {
          DEFAULT: '#E57373',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#A8D5BA',
          foreground: '#1A472A',
        },
        warning: {
          DEFAULT: '#FFD4A3',
          foreground: '#7A5C2D',
        },
        info: {
          DEFAULT: '#A8C5E2',
          foreground: '#1E3A5F',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Quicksand', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2rem', { lineHeight: '1.25' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.375rem',
      },
      boxShadow: {
        'soft-sm': '0 1px 2px rgba(232, 164, 184, 0.1)',
        'soft': '0 4px 6px rgba(232, 164, 184, 0.15)',
        'soft-md': '0 6px 12px rgba(232, 164, 184, 0.15)',
        'soft-lg': '0 10px 15px rgba(232, 164, 184, 0.2)',
        'soft-xl': '0 20px 25px rgba(232, 164, 184, 0.25)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
