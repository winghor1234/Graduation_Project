import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    // ✅ Cloudinary ຈັດການ optimize ຮູບເອງຢູ່ແລ້ວ — ໃຫ້ browser ໂຫຼດກົງ
    // ບໍ່ຕ້ອງຜ່ານ /_next/image (server-side fetch), ກັນ error ຕອນ server
    // resolve DNS ຫາ res.cloudinary.com ບໍ່ໄດ້ (network/DNS ຂອງ dev server ເອງ)
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
