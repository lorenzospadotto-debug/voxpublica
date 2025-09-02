/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
'./app/**/*.{js,jsx}',
'./components/**/*.{js,jsx}',
],
theme: {
extend: {
colors: {
   voxbg: "#fcf4e4", // sfondo VoxPublica
vp: {
primary: '#E8532E',
dark: '#1E2A33',
bg: '#F5F1E8',
deep: '#0F1C24'
}
}
},
},
plugins: [],
};
module.exports = {
  theme: {
    extend: {
      colors: {
        voxbg: "#fcf4e4", // sfondo VoxPublica
      },
    },
  },
};
