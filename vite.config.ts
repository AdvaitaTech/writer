import { defineConfig } from "vite";
import path from "path";
import typescript from "@rollup/plugin-typescript";
import dts from 'vite-plugin-dts';
import {typescriptPaths} from "rollup-plugin-typescript-paths";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), dts({rollupTypes: true, copyDtsFiles: true})],
  server: {
    port: 3001,
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, "src/modules/core/Editor.tsx"),
      fileName: "main",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      plugins: [
        // typescriptPaths({
        //   preserveExtensions: true,
        // }),
        typescript({
          sourceMap: false,
          outDir: "dist",
          include: ["src/modules/core/**", "src/modules/ui/**"],
        }),
      ],
    },
  },
});
