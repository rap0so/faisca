import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MDX files are imported as lesson content modules.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactCompiler: true,
  // better-sqlite3 is a native module — keep it external on the server bundle.
  serverExternalPackages: ["better-sqlite3"],
  // Local media (self-hosted audio in /public/media) needs permissive CORS so the
  // sandboxed preview iframe (opaque origin) can analyse it via Web Audio with
  // <audio crossorigin="anonymous">. Still 100% local — no external requests.
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

const withMDX = createMDX({
  // Plugins go here later if needed — all local, no CDN.
  options: {},
});

export default withMDX(nextConfig);
