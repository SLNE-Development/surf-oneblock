import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  // MDX wird zur Laufzeit aus content/ gelesen (next-mdx-remote/rsc),
  // damit neue Dateien keine Code-Änderung brauchen.
  serverExternalPackages: ["gray-matter"],
};

export default nextConfig;
