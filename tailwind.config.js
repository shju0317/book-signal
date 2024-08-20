/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      container:{
        center: true
      },
      colors: {
        primary: "#f57e53", // 메인색상
        secondary: "#C2C2C2", // 글자색상(회색)
        success: "#34b012", 
        warning: "#fc5230",
        background: "#FCF4EF",
        box: "#EEEEEE",
      },
      fontFamily: {
        pretendard: ['Pretendard-Regular', 'Arial', 'sans-serif'],
        logo: ['Cafe24Moyamoya-Regular-v1.0', 'Arial', 'sans-serif']
      },
      screens: {
        'xs': '480px',  // 초소형 화면
        'sm': '640px',  // 모바일
        'md': '768px',  // 태블릿
        'lg': '1024px', // 작은 데스크탑
        'xl': '1280px', // 큰 데스크탑
        '2xl': '1536px', // 매우 큰 화면
        '3xl': '1920px'  // 초대형 화면
      },
    },
  },
  plugins: [],
}

