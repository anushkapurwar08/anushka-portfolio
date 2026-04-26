import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#F8E8EE',
        cream: '#FFF8F0',
        lilac: '#D8B4F8',
        lilacDeep: '#8B5CC0',
        ink: '#2D2D2D',
        muted: '#6B6B6B',
        sage: '#C9DABF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        deva: ['var(--font-deva)', 'serif'],
      },
      boxShadow: {
        soft: '0 6px 30px -10px rgba(45,45,45,0.18)',
        glow: '0 0 0 4px rgba(216,180,248,0.25)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
    },
  },
  plugins: [],
}
export default config
