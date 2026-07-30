import { createHighlighter } from 'shiki';

/** VS Code Dark+ — same tokenizer theme IntelliJ/VS Code users recognize. */
export const SHIKI_THEME = 'dark-plus';

const LANG_ALIASES = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'tsx',
  jsx: 'jsx',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  gradle: 'groovy',
  kt: 'kotlin',
  plaintext: 'text',
  plain: 'text',
  console: 'bash',
  '': 'text',
};

/** Languages loaded once for this blog's corpus. */
export const SHIKI_LANGS = [
  'javascript',
  'typescript',
  'tsx',
  'jsx',
  'java',
  'kotlin',
  'groovy',
  'python',
  'bash',
  'shell',
  'json',
  'yaml',
  'xml',
  'html',
  'css',
  'scss',
  'sql',
  'markdown',
  'diff',
  'dockerfile',
  'properties',
  'ini',
  'toml',
  'text',
];

let highlighterPromise = null;

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME],
      langs: SHIKI_LANGS,
    });
  }
  return highlighterPromise;
}

export function resolveLang(infostring = '') {
  const raw = String(infostring || '').trim().split(/\s+/)[0].toLowerCase();
  return LANG_ALIASES[raw] || raw || 'text';
}

/**
 * Highlight a fenced code block with Shiki (VS Code TextMate grammars).
 * Unknown languages fall back to plaintext so one bad fence never breaks the build.
 */
export async function highlightCode(code, infostring = '') {
  const highlighter = await getHighlighter();
  const lang = resolveLang(infostring);
  const normalized = String(code).replace(/\n$/, '');

  const toHtml = async (candidate) => {
    const loaded = highlighter.getLoadedLanguages();
    if (!loaded.includes(candidate)) {
      try {
        await highlighter.loadLanguage(candidate);
      } catch {
        return null;
      }
    }
    try {
      return highlighter.codeToHtml(normalized, {
        lang: candidate,
        theme: SHIKI_THEME,
      });
    } catch {
      return null;
    }
  };

  let html = await toHtml(lang);
  let usedLang = lang;
  if (!html) {
    html = await toHtml('text');
    usedLang = 'text';
  }
  if (!html) {
    const escaped = normalized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<div class="code-block-wrap" data-lang="text"><pre class="shiki-fallback"><code>${escaped}</code></pre></div>\n`;
  }

  return `<div class="code-block-wrap" data-lang="${usedLang}"><span class="code-lang" aria-hidden="true">${usedLang}</span>${html}</div>\n`;
}
