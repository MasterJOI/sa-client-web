/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js}",
  ],
  important: true,
  theme: {
    extend: {
      backgroundImage: {
        atomic: `url('assets/img/background-crop.svg')`
      },
      "colors": {
        "link": "#0048d9",
        "success": {
          "20": "#f9fcf8",
          "50": "#f0f8ed",
          "100": "#e2f1da",
          "200": "#c5e2b6",
          "300": "#a7d491",
          "400": "#8ac66c",
          "500": "#395f25",
          "600": "#579339",
          "700": "#416e2b",
          "800": "#2c491d",
          "900": "#16250e",
          "950": "#0b1207"
        },
        "alert": {
          "20": "#fef6f6",
          "50": "#fde7e8",
          "100": "#fbd0d1",
          "200": "#f7a1a4",
          "300": "#f47176",
          "400": "#f04248",
          "500": "#e21219",
          "600": "#bd0f15",
          "700": "#8e0b10",
          "800": "#5e080b",
          "900": "#2f0405",
          "950": "#180203"
        },
        "gray": {
          "0": "#ffffff",
          "20": "#fafafa",
          "50": "#f2f2f2",
          "100": "#e6e6e6",
          "200": "#cccccc",
          "300": "#b3b3b3",
          "400": "#999999",
          "500": "#636363",
          "600": "#666666",
          "700": "#4d4d4d",
          "800": "#333333",
          "900": "#1a1a1a",
          "950": "#0d0d0d"
        },
        "primary": {
          "20": "#fffdf5",
          "50": "#fff9e6",
          "100": "#fef3cd",
          "200": "#fde89b",
          "300": "#fcdc69",
          "400": "#fbd137",
          "500": "#fcd95c",
          "600": "#c89e04",
          "700": "#967603",
          "800": "#644f02",
          "900": "#322701",
          "950": "#191400"
        },
        "secondary": {
          "20": "#fffbf5",
          "50": "#fff5e6",
          "100": "#feeacd",
          "200": "#fdd69b",
          "300": "#fcc169",
          "400": "#fbad37",
          "500": "#fcbc5c",
          "600": "#c87a04",
          "700": "#965b03",
          "800": "#643d02",
          "900": "#321e01",
          "950": "#190f00"
        }
      },
      "fontSize": {
        'body': ['1rem', {
          lineHeight: '1.2rem',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'label': ['1rem', {
          lineHeight: '1.4rem',
          letterSpacing: '0',
          fontWeight: '600',
        }],
        'input-message': ['0.75rem', {
          lineHeight: '0.75rem',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'cta': ['1rem', {
          lineHeight: '1rem',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'title': ['1.1875rem', {
          lineHeight: '1,425rem',
          letterSpacing: '0',
          fontWeight: '600',
        }],
        "base": "1rem",
        "lg": "1.1875rem",
        "xl": "1.4375rem",
        "2xl": "1.75rem",
        "3xl": "2.0625rem",
        "4xl": "2.5rem",
        "5xl": "3rem",
        "6xl": "3.5625rem"
      },
      "fontFamily": {
        "inter": "Inter",
        "kharkiv-tone": "KharkivTone"
      },
      "boxShadow": {
        "Soft": "0px 4px 20px 0px rgba(0,0,0,0.12)"
      },
      "borderRadius": {
        "none": "0",
        "xs": "0.0625rem",
        "sm": "0.1875rem",
        "default": "0.25rem",
        "lg": "0.3125rem",
        "xl": "0.375rem",
        "2xl": "0.5rem",
        "3xl": "0.75rem",
        "4xl": "1rem",
        "5xl": "1.5rem",
        "6xl": "3.125rem",
        "full": "9999px"
      },
      animation: {
        'input-message': 'input-message-animation 300ms'
      },
      keyframes: {
        'input-message-animation': {
          '0%': { opacity: 0, transform: 'translateY(-6px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' },
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require('tailwindcss-font-inter')
  ],
}


