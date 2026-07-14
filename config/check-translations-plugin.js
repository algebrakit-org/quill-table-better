const fs = require('fs');
const path = require('path');

const LANGUAGE_DIR = path.resolve(__dirname, '../src/language');
const REFERENCE = 'en_US';

function extractKeys(file) {
  const src = fs.readFileSync(path.join(LANGUAGE_DIR, file), 'utf8');
  const keys = new Set();
  const re = /^\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    keys.add(m[1] ?? m[2] ?? m[3]);
  }
  return keys;
}

function collectWarnings() {
  const files = fs
    .readdirSync(LANGUAGE_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  const refKeys = extractKeys(`${REFERENCE}.ts`);
  const messages = [];
  for (const file of files) {
    const locale = file.replace(/\.ts$/, '');
    if (locale === REFERENCE) continue;
    const keys = extractKeys(file);
    const missing = [...refKeys].filter((k) => !keys.has(k));
    if (missing.length) {
      messages.push(`  ${locale}: missing ${missing.length} (${missing.join(', ')})`);
    }
  }
  return messages;
}

// Emits one webpack warning summarizing translation keys present in the
// reference locale but absent from other locales. It never fails the build;
// the runtime falls back to the reference locale for missing keys.
class CheckTranslationsPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('CheckTranslationsPlugin', (compilation) => {
      const messages = collectWarnings();
      if (!messages.length) return;
      const warning = new Error(
        `Missing translations (fallback to ${REFERENCE} at runtime):\n${messages.join('\n')}`
      );
      warning.name = 'CheckTranslationsWarning';
      warning.stack = undefined;
      compilation.warnings.push(warning);
    });
  }
}

module.exports = CheckTranslationsPlugin;
