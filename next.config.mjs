/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.foodsafetykorea.go.kr",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "www.foodsafetykorea.go.kr",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "gnoefovruutfyrunuxkk.supabase.co",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "img1.kakaocdn.net",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        port: "",
        pathname: "/**"
      }
    ],
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
