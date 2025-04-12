/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false, // Optional: if using custom reset
    },
    plugins: [],
    future: {
        // Avoid future CSS color formats like oklch
        hoverOnlyWhenSupported: false,
        useOkLCH: false,
    },
}

