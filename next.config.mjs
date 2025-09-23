// next.config.js (or next.config.mjs)
const nextConfig = {
  webpack: (config) => {
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.store = 'pack'; // ensure pack cache
      // @ts-ignore - Webpack types may complain
      config.cache.maxMemoryGenerations = 0; // reduce memory pressure
    }
    return config;
  },
};

module.exports = nextConfig;
