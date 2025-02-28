import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['kkms4001.iptime.org'],
    // host: 'kkms4001.iptme.org', // 외부 접근 허용
    host:'0.0.0.0',
    port: 21183,
    proxy: {
      "/api": {
        target: "https://apihub.kma.go.kr",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // 올바른 경로 유지
      },
    },
  },
});
