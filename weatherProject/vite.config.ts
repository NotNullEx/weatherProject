import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 외부 접근 허용
    port: 5173,
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
