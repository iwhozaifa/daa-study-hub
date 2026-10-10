import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// The site lives at https://iwhozaifa.github.io/daa-study-hub/, so every URL starts with /daa-study-hub
const basePath = '/daa-study-hub';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export', // plain HTML/CSS/JS in out/, hosted free on GitHub Pages
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default withMDX(config);
