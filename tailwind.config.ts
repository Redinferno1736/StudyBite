import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                turquoise: '#40E0D0',
                lightBlue: '#B0E0E6',
                royalGreen: '#4169E1',
            },
        },
    },
    plugins: [],
};

export default config;
