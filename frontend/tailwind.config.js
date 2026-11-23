/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Core dark palette ──────────────────────────────────────
        bg: {
          primary:   '#080807',
          secondary: '#100F0E',
          card:      '#151312',
          elevated:  '#1C1917',
        },
        // ── Text palette ───────────────────────────────────────────
        ink: {
          primary:   '#F5F2EF',
          secondary: '#A9A29D',
          muted:     '#77716C',
        },
        // ── Borders ────────────────────────────────────────────────
        border: {
          DEFAULT: '#302A26',
          light:   '#3D3530',
          subtle:  '#1E1A17',
        },
        // ── Accent palette ─────────────────────────────────────────
        accent: {
          primary:   '#E87542',
          secondary: '#F19A6D',
          warm:      '#F3E9A1',
          glow:      '#E87542',
        },
        // ── Chart / neutral ────────────────────────────────────────
        chart: {
          neutral: '#A8A29E',
          dim:     '#57534E',
        },
        // ── Legacy aliases (keeps existing components working) ─────
        carbon: {
          50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',
          400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',
          800:'#1e293b',900:'#0f172a',950:'#080807',
        },
        forest: {
          500:'#E87542',600:'#d4652f',
        },
      },

      fontFamily: {
        sans:    ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },

      backgroundImage: {
        'warm-glow':     'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(232,117,66,0.18) 0%, transparent 70%)',
        'hero-frame':    'linear-gradient(180deg, #080807 0%, #0E0C0A 100%)',
        'card-dark':     'linear-gradient(135deg, rgba(28,25,23,0.9) 0%, rgba(21,19,18,0.95) 100%)',
        'orange-btn':    'linear-gradient(135deg, #E87542 0%, #d4652f 100%)',
        'sidebar-bg':    'linear-gradient(180deg, #100F0E 0%, #080807 100%)',
      },

      animation: {
        'pulse-slow':   'pulse 4s cubic-bezier(.4,0,.6,1) infinite',
        'float':        'float 6s ease-in-out infinite',
        'fade-in':      'fade-in .5s ease-out',
        'slide-up':     'slide-up .4s ease-out',
        'glow-pulse':   'glow-pulse 4s ease-in-out infinite',
      },

      keyframes: {
        float:        { '0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-10px)'} },
        'fade-in':    { '0%':{opacity:'0'},'100%':{opacity:'1'} },
        'slide-up':   { '0%':{transform:'translateY(20px)',opacity:'0'},'100%':{transform:'translateY(0)',opacity:'1'} },
        'glow-pulse': { '0%,100%':{opacity:'.3'},'50%':{opacity:'.7'} },
      },

      boxShadow: {
        'orange-sm':  '0 0 12px rgba(232,117,66,.2)',
        'orange-md':  '0 0 28px rgba(232,117,66,.25)',
        'card':       '0 2px 16px rgba(0,0,0,.4), 0 1px 4px rgba(0,0,0,.3)',
        'sidebar':    '1px 0 0 #302A26',
      },

      borderRadius: {
        '4xl':'2rem','5xl':'2.5rem',
      },
    },
  },
  plugins: [],
}
