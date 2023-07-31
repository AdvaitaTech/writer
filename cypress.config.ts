import { defineConfig } from "cypress";
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
  component: {
    specPattern: '**/*.spec.{js,jsx,ts,tsx}',
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      on('file:preprocessor', vitePreprocessor())
    },
  },
});
