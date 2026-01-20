/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-serif': ['Noto Serif KR', 'serif'],
        'nanum': ['Nanum Myeongjo', 'serif'],
        'pretendard': ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}