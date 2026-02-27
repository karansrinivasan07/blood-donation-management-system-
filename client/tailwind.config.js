/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                medical: {
                    primary: '#e11d48', // Red
                    secondary: '#2563eb', // Blue
                    accent: '#0ea5e9', // Light Blue
                    dark: '#0f172a',
                    light: '#f8fafc'
                }
            }
        },
    },
    plugins: [],
}
