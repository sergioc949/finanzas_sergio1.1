import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Empaqueta el build en un único `index.html` con el JS y el CSS en línea,
 * para que la app también funcione abriendo el archivo directamente (file://).
 */
function singleFile(): Plugin {
  return {
    name: 'gastos-single-file',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const html = Object.values(bundle).find((file) => file.fileName.endsWith('.html'))
      if (!html || html.type !== 'asset' || typeof html.source !== 'string') return

      let source = html.source
      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk' && file.fileName.endsWith('.js')) {
          const script = file.code.replaceAll('</script', '<\\/script')
          source = source.replace(
            new RegExp(`<script[^>]*src="[^"]*${file.fileName}"[^>]*></script>`),
            () => `<script type="module">${script}</script>`,
          )
          delete bundle[file.fileName]
        }
        if (file.type === 'asset' && file.fileName.endsWith('.css')) {
          source = source.replace(
            new RegExp(`<link[^>]*href="[^"]*${file.fileName}"[^>]*>`),
            () => `<style>${String(file.source)}</style>`,
          )
          delete bundle[file.fileName]
        }
      }
      html.source = source
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: el build funciona en cualquier subcarpeta y también en file://.
  base: './',
  plugins: [react(), tailwindcss(), singleFile()],
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    chunkSizeWarningLimit: 2000,
  },
})
