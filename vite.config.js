import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';

import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

import ElementPlus from 'unplugin-element-plus/vite'

import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep'],
        })
      ],
    }),
    Icons({
      autoInstall: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将'@'设置为项目src目录的别名
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8800/api',  // 目标服务器（后端）
        changeOrigin: true,  // 允许跨域
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      },
    },
  },
});