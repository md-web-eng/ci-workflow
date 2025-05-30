import path, { join, resolve } from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, loadEnv } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import svgr from 'vite-plugin-svgr';
// eslint-disable-next-line import/no-extraneous-dependencies
import tsconfigPaths from 'vite-tsconfig-paths';

import { readHtml } from './tasks/html';

const index = resolve(__dirname, 'src', 'html', 'index.html');
console.log('check -->', index);

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
  const envPrefix = ['VITE_', 'APP_ENV'];
  const env = loadEnv(mode, '.', envPrefix);

  const inputFiles = readHtml(path.resolve(__dirname, 'src/html'));

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const htmlPlugin = () => ({
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre' as const,
      transform: (html: string): string =>
        html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
    },
  });
  const imageOptions = {
    png: {
      // https://sharp.pixelplumbing.com/api-output#png
      quality: 90,
    },
    jpeg: {
      // https://sharp.pixelplumbing.com/api-output#jpeg
      quality: 90,
    },
    jpg: {
      // https://sharp.pixelplumbing.com/api-output#jpeg
      quality: 90,
    },
    tiff: {
      // https://sharp.pixelplumbing.com/api-output#tiff
      quality: 90,
    },
  };
  return {
    base: './', // ベースパス設定
    root: './src/html', // 開発ディレクトリ設定
    envDir: '../../', // rootが変更されてるので環境変数を設置するディレクトリも変更
    publicDir: '../public', // rootを変更したのでpublicディレクトリも変更
    // assetsInclude: '../assets/**/*',
    resolve: {
      alias: {
        '@/': `${__dirname}/src/`,
      },
    },
    esbuild: {
      drop: env.VITE_APP_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    plugins: [
      tsconfigPaths(),
      ViteEjsPlugin(),
      htmlPlugin(),
      svgr(),
      ViteImageOptimizer(imageOptions),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [join(__dirname, 'src/styles')],
        },
      },
      devSourcemap: true,
    },
    build: {
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      outDir: '../../dist',
      emptyOutDir: false,
      cssCodeSplit: false,
      rollupOptions: {
        input: inputFiles,
        output: {
          entryFileNames: `assets/js/main.js`,
          assetFileNames: (assetInfo) => {
            // console.log(assetInfo);
            let extType: string = assetInfo?.name?.split('.')[1] as string;
            // Webフォントファイルの振り分け
            if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
              extType = 'fonts';
            }
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images';
            }
            if (extType === 'css') {
              // ビルド時のCSS名を明記してコントロールする
              return 'assets/css/main.css';
            }
            return `assets/${extType}/[name].[ext]`;
          },
          chunkFileNames: `assets/js/[name].js`,
        },
      },
    },
  };
});
