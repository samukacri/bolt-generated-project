import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    define: {
      // Expor variáveis de ambiente para o código
      'import.meta.env.VITE_GOOGLE_TTS_API_KEY': JSON.stringify(env.VITE_GOOGLE_TTS_API_KEY)
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Adicionar configuração de variáveis de ambiente
    envPrefix: ['VITE_'],
    envDir: process.cwd(),
  };
});
