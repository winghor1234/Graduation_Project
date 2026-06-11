// import type { Config } from "tailwindcss"
// import animate from "tailwindcss-animate"

// const config: Config = {
//   content: ["./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [animate],
// }

// export default config


import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

const config: Config = {
  // 💡 ຖ້າໃນໂປຣເຈັກຂອງທ່ານບໍ່ໄດ້ໃຊ້ໂຟນເດີ src ແຕ່ເປັນໂຟນເດີ app/ ຫຼື components/ ຢູ່ດ້ານນອກຫຼັກ 
  // ແນະນຳໃຫ້ເພີ່ມ Path ເຂົ້າໄປໃນ content ແບບນີ້ເພື່ອປ້ອງກັນບໍ່ໃຫ້ Class ຂອງ Tailwind ບໍ່ສະແດງຜົນ:
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",       // ເພີ່ມ Path ນີ້ (ຖ້າມີ)
    "./components/**/*.{js,ts,jsx,tsx}" // ເພີ່ມ Path ນີ້ (ຖ້າມີ)
  ],
  theme: {
    extend: {
      // ⚡ ເພີ່ມ fontFamily ໄວ້ບ່ອນນີ້
      fontFamily: {
        lao: ["var(--font-noto-lao)", "sans-serif"],
      },
    },
  },
  plugins: [animate],
}

export default config