import { defineConfig } from 'vite';

export default defineConfig({
  base: '/OpenFIDS/',
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api/airFlyTab': {
        target: 'https://www.tsa.gov.tw',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Strip accept-encoding so the TSA server doesn't compress responses.
            // The Vite proxy decompresses gzip automatically, but HiNetCDN/ASP.NET
            // may behave differently (return empty results) when gzip is negotiated.
            proxyReq.setHeader('accept-encoding', 'identity');
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            // console.log('[proxy] Response status:', proxyRes.statusCode);
          });
        }
      },
    },
  },
});
