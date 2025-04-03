module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['msclubsliit.org'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};
