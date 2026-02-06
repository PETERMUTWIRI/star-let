/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /* 1. keep what you already had  */
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      /* 2. ADD ImgBB domains          */
      { protocol: 'https', hostname: '**.ibb.co' },
      { protocol: 'https', hostname: 'i.ibb.co' },
    ],
    /* 3. optional: bigger quality   */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  /* 4. your old redirects – untouched */
  async redirects() {
    return [
      {
        source: '/events/upcoming',
        destination: '/events',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;