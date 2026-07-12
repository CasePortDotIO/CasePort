/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    // Scene images are static PNGs served from /public; no remote loader needed.
    unoptimized: true,
  },
};

export default nextConfig;
