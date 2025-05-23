// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  // images: { // 必要であればコメントを解除
  //   unoptimized: true,
  // },
  // 他に必要なNext.jsの設定があればここに追加
};

export default nextConfig;
