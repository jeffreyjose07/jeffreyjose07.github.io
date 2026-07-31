import { bundledLanguages, createHighlighter } from 'shiki';

/** Punchier than Dark+ so token colors read clearly on the dark blog chrome. */
export const SHIKI_THEME = 'one-dark-pro';

const LANG_ALIASES = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'tsx',
  jsx: 'jsx',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  shellscript: 'bash',
  zsh: 'bash',
  console: 'bash',
  yml: 'yaml',
  md: 'markdown',
  gradle: 'groovy',
  kt: 'kotlin',
  kts: 'kotlin',
  cplusplus: 'cpp',
  'c++': 'cpp',
  plaintext: 'text',
  plain: 'text',
  txt: 'text',
  svg: 'xml',
  dockerfile: 'docker',
  '': 'text',
};

/**
 * Languages we eagerly load — covers every fence tag used in this blog
 * plus common companions. Unknown langs still load on demand from Shiki's bundle.
 */
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
  'docker',
  'dockerfile',
  'properties',
  'ini',
  'toml',
  'text',
  'cpp',
  'c',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'scala',
  'graphql',
  'http',
  'nginx',
  'makefile',
  'log',
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

/** Best-effort guess when authors omit a fence language (201+ unlabeled blocks). */
export function guessLang(code = '') {
  const sample = String(code).slice(0, 4000);

  if (/@(Transactional|Service|RestController|Autowired|Override|Entity|Table|Version)\b/.test(sample)
    || /\bpublic\s+(class|interface|enum|void|static)\b/.test(sample)
    || /\bpackage\s+[\w.]+;/.test(sample)) {
    return 'java';
  }
  if (/^\s*<(!DOCTYPE|html|svg|div|span|section|button|img)\b/im.test(sample)
    || /<\/[a-zA-Z][\w-]*>/.test(sample)) {
    return sample.trimStart().startsWith('<svg') ? 'xml' : 'html';
  }
  if (/^\s*[{[]/.test(sample.trim()) && /"[^"]+"\s*:/.test(sample)) return 'json';
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\b/i.test(sample.trim())) return 'sql';
  if (/^\s*(apiVersion|kind|metadata|spec):\s/m.test(sample)
    || (/^\s*[\w.-]+:\s*.+$/m.test(sample) && !/;/.test(sample) && !/\b(function|const|let)\b/.test(sample))) {
    return 'yaml';
  }
  if (/^\s*(\.|#)[\w-]+[\s\S]*\{/.test(sample)
    || /@(media|keyframes|import)\b/.test(sample)) {
    return 'css';
  }
  if (/\b(import|export)\s+.+\s+from\s+['"]/.test(sample)
    || /\b(interface|type)\s+\w+\s*=/.test(sample)
    || /:\s*(string|number|boolean|React\.)/.test(sample)) {
    return 'typescript';
  }
  if (/\b(const|let|var|function|=>|require\()\b/.test(sample)) return 'javascript';
  if (/^\s*(#include|using\s+namespace|std::)/m.test(sample)
    || /\b(int|void|bool)\s+\w+\s*\(/.test(sample) && /;/.test(sample)) {
    return 'cpp';
  }
  if (/^\s*[.$]\s|^\.\/|^npm |^npx |^git |^docker |gradlew|curl |export JAVA_HOME/m.test(sample)) {
    return 'bash';
  }
  if (/^\s*\w+\.\w+\s*=/.test(sample) || /^\s*spring\./m.test(sample)) return 'properties';

  return 'text';
}

function canLoadLang(lang) {
  return lang === 'text' || Object.prototype.hasOwnProperty.call(bundledLanguages, lang);
}

/**
 * Highlight a fenced code block with Shiki (VS Code TextMate grammars).
 * Unknown / omitted languages are guessed, then fall back to plaintext.
 */
export async function highlightCode(code, infostring = '') {
  const highlighter = await getHighlighter();
  const normalized = String(code).replace(/\n$/, '');

  let lang = resolveLang(infostring);
  if (!lang || lang === 'text') {
    const guessed = guessLang(normalized);
    if (guessed !== 'text') lang = guessed;
  }
  if (!canLoadLang(lang)) {
    lang = guessLang(normalized);
  }
  if (!canLoadLang(lang)) lang = 'text';

  const toHtml = async (candidate) => {
    const loaded = highlighter.getLoadedLanguages();
    if (!loaded.includes(candidate) && candidate !== 'text') {
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
  if (!html && lang !== 'text') {
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
