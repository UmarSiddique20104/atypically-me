import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },


      colors: {
        primary: {
          DEFAULT: '#F5F5F5',
          light: '#F5F5F5',
        },
        purple: {
          DEFAULT: '#DACAE9',
          light: '#DDCAED',
          lighter: '#BEAAD0'
        },
        lightOrange: {
          DEFAULT: '#F4EEE2',
        },
        orange: {
          DEFAULT: '#EBBFA4',
          mediumDark: '#DDA885',
          dark: '#D79569',
          darker: '#EAA881',

        },
        cyanBlue: {
          DEFAULT: '#BCD1EF',
          dark: '#9AAAC9',
        },
        yellow: {
          DEFAULT: '#ECD260 ',
          light: '#F1DF90 ',
        },
        green: {
          DEFAULT: '#D2E4C4',
          dark: '#B5C9A5',
        },


      },

      screens: {
        '3xl': '1440px',
        '4xl': '1920px',
        '5xl': '2560px',
      },

    },

    fontFamily: {
      montserrat: ["var(--font-montserrat)"],
      inter: ["var(--font-inter)"],
      roboto: ["var(--font-roboto)"],

    },
  },
  plugins:  [
    function({ addUtilities }:any) {
      const newUtilities = {
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none',  /* Firefox */
        },
      };
      addUtilities(newUtilities, ['responsive']);
    },
  ],
}
export default config;
