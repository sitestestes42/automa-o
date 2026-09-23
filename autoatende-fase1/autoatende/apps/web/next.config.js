/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // transpila o pacote compartilhado de tipos/DTOs
  transpilePackages: ["@autoatende/shared"],
};

module.exports = nextConfig;
