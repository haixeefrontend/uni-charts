import { presetHaixee } from '@haixee/unocss-preset'
import { defineConfig, presetUno, transformerDirectives, transformerVariantGroup, transformerCompileClass } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets: [
    presetUno(),
    presetHaixee({ elementPlus: true }),
    presetScrollbar({
      scrollbarWidth: '8px',
      scrollbarThumbColor: 'var(--el-scrollbar-bg-color, var(--el-text-color-secondary))',
      scrollbarThumbRadius: '12px',
      scrollbarTrackColor: 'transparent',
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass({ alwaysHash: true })],
  shortcuts: {
    'sb': 'scrollbar scrollbar-rounded scrollbar-thin',
    'sb-w-3': 'scrollbar scrollbar-rounded scrollbar-thumb-color-#eee scrollbar-w-4px scrollbar-h-4px',
  },
  theme: {
    breakpoints: {
      'sm': '768px',
      'md': '992px',
      'lg': '1200px',
      'xl': '1920px',
      '2xl': '2560px',
    },
  },
})
