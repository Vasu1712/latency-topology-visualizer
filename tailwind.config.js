
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
            fontFamily: {
        sfpro: ["SF-Pro", "system-ui"]
      },
      colors: {
        aws: '#ff9900',
        gcp: '#34a853',
        azure: '#3ccbf4',
        lightgray: '#9a9a9e',
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6b7280',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#0f172a',
        mainbg: '#0f0f11',
        fadeblu: '#94b8ff',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        border: '#9a9a9e',
        input: '#9a9a9e',
        ring: '#3b82f6',
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};
