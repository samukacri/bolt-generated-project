import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // Corrected import
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Check if environment variables are loaded correctly
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_KEY) {
    console.error("ERROR: VITE_SUPABASE_URL or VITE_SUPABASE_KEY is not defined in your .env file.");
    // You might even want to throw an error here to halt the build
    // throw new Error("Missing required environment variables.");
  }

  return {
    server: {
      host: '::',
      port: 8080,
    },
    define: {
      // Expose environment variables to the code
      'import.meta.env.VITE_GOOGLE_TTS_API_KEY': JSON.stringify(env.VITE_GOOGLE_TTS_API_KEY),
      'import.meta.env.VITE_BIBLE_API_KEY': JSON.stringify(env.VITE_BIBLE_API_KEY),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify(env.VITE_SUPABASE_KEY),
    },
    plugins: [
      react(), // Use the standard React plugin (Babel)
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envPrefix: ['VITE_'],
    envDir: process.cwd(),
  };
});
