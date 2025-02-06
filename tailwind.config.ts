import flowbitePlugin from 'flowbite/plugin'

import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',
	theme: {
		extend: {
      colors: {
        // flowbite-svelte
        primary: {
          "50":  "#f5f6f3",
          "100": "#e9ebe5",
          "200": "#d2d5cb",
          "300": "#b7b9af",
          "400": "#868a7c",
          "500": "#5f6157",
          "600": "#494b42",
          "700": "#353730",
          "800": "#232520",
          "900": "#151613"
        }
        ,
        secondary: {
          50: '#070707',
          100: '#0f0d0d',
          200: '#171412',
          300: '#201d17',
          400: '#29271b',
          500: '#33331f',
          600: '#3a3d22',
          700: '#3e4825',
          800: '#384239',
          900: '#3f5427',
          text1:'#bdd5a9',
          text:"#bb7d25"
        },
      },
    }
	},

	plugins: [flowbitePlugin]
} as Config;
