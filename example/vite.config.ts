import { copyFileSync } from 'node:fs'

import uniModule from '@dcloudio/vite-plugin-uni'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

import packageJson from './package.json'
import unoConfig from './uno.config'

// @ts-expect-error
const uni: typeof uniModule = uniModule.default || uniModule

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [
    uni(),
    dts({
      entryRoot: 'src',
      exclude: [
        'src/App.vue',
        'src/main.ts',
        'src/pages/**/*.vue',
      ],
      afterBuild() {
        // Publint requires a .d.cts type definition file
        // https://publint.dev/rules#export_types_invalid_format
        copyFileSync('dist/index.d.ts', 'dist/index.d.cts')
      },
    }),
    unocss({ ...unoConfig, mode: 'vue-scoped' }),
    AutoImport({
      imports: [
        'vue',
      ],
      dts: true,
      eslintrc: {
        enabled: true,
      },
    }),
  ],
  esbuild: {
    banner: `/*!
 * ${packageJson.name} v${packageJson.version}
 * (c) ${new Date().getFullYear()} Haixee Frontend Team
 */`,
  },
}))
