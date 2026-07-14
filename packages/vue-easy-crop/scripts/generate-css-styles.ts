/**
 * Auto-generates cssStyles.ts from styles.css.
 *
 * This avoids `?raw` import issues on Windows and ensures the CSS string
 * embedded in the library stays in sync with the source stylesheet.
 *
 * Run via: tsx scripts/generate-css-styles.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const cssPath = path.resolve(__dirname, '..', 'src', 'styles.css')
const outPath = path.resolve(__dirname, '..', 'src', 'cssStyles.ts')

const css = fs.readFileSync(cssPath, 'utf8')

const output = `// Auto-generated from styles.css — do not edit directly.
// Regenerate with: tsx scripts/generate-css-styles.ts
export const cssStyles = \`${css}\`
`

// Only write if changed (avoids unnecessary rebuilds)
if (fs.existsSync(outPath) && fs.readFileSync(outPath, 'utf8') === output) {
  console.log('cssStyles.ts is up to date.')
} else {
  fs.writeFileSync(outPath, output, 'utf8')
  console.log('cssStyles.ts regenerated from styles.css.')
}
