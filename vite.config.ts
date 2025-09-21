import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

// Obtenir le répertoire du module actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  
  // Configuration de résolution des imports
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'client/src') },
      { find: '@shared', replacement: path.resolve(__dirname, 'shared') },
      { find: '@assets', replacement: path.resolve(__dirname, 'attached_assets') },
    ],
  },
  
  // Racine du projet client
  root: path.resolve(__dirname, 'client'),
  
  // Configuration du build
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot'],
        },
      },
    },
  },
  
  // Configuration du serveur de développement
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    fs: {
      strict: true,
      allow: [path.resolve(__dirname, 'client'), path.resolve(__dirname, 'shared')],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  
  // Configuration de l'optimisation des dépendances
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      // Permet d'utiliser les dernières fonctionnalités JavaScript
      target: 'es2020',
    },
  },
  
  // Configuration du préchargement des modules
  preview: {
    port: 3000,
    strictPort: true,
  },
  
  // Configuration de la mise en cache
  cacheDir: path.resolve(__dirname, 'node_modules/.vite'),
  
  // Configuration des variables d'environnement
  envDir: path.resolve(__dirname),
  
  // Configuration des assets
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.fbx'],
  
  // Configuration des logs
  logLevel: mode === 'development' ? 'info' : 'warn',
  
  // Configuration CSS
  css: {
    devSourcemap: mode === 'development',
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
}));
