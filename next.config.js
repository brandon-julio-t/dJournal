// in next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908#issuecomment-1487801131
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = nextConfig;
