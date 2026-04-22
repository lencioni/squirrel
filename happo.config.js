import { defineConfig } from 'happo';
import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, 'dist/happo');

export default defineConfig({
  apiKey: process.env.HAPPO_API_KEY,
  apiSecret: process.env.HAPPO_API_SECRET,
  targets: {
    'chrome-desktop': {
      type: 'chrome',
      viewport: '1024x768',
    },
    'chrome-mobile': {
      type: 'chrome',
      viewport: '390x844',
    },
    accessibility: {
      type: 'accessibility',
      viewport: '390x844',
    },
  },
  integration: {
    type: 'custom',
    build: async () => {
      await build({
        configFile: false,
        build: {
          outDir,
          emptyOutDir: true,
          lib: {
            entry: path.resolve(__dirname, 'happo/examples.js'),
            name: 'happoExamples',
            formats: ['iife'],
            fileName: () => 'index.js',
          },
        },
      });

      fs.copyFileSync(
        path.resolve(__dirname, 'styles.css'),
        path.join(outDir, 'styles.css'),
      );

      fs.copyFileSync(
        path.resolve(__dirname, 'public/logo.svg'),
        path.join(outDir, 'logo.svg'),
      );

      fs.writeFileSync(
        path.join(outDir, 'iframe.html'),
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <script src="index.js"></script>
  </body>
</html>`,
      );

      return { rootDir: outDir, entryPoint: 'index.js' };
    },
  },
});
