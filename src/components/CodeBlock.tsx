'use client';
import { useState } from 'react';

type TokenType = 'kw' | 'str' | 'num' | 'cmt' | 'fn' | 'key' | 'op' | 'type' | 'var' | 'pct' | 'dns-field' | 'dns-value' | 'dns-sep' | 'plain';

interface Token {
  t: TokenType;
  v: string;
}

// ------- Per-language tokenizers -------

function tokenizeJSON(code: string): Token[] {
  const out: Token[] = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    // whitespace / newlines
    if (/\s/.test(ch)) {
      out.push({ t: 'plain', v: ch });
      i++;
      continue;
    }

    // string
    if (ch === '"') {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === '"') { j++; break; }
        j++;
      }
      const str = code.slice(i, j);
      // peek ahead past whitespace for colon
      let k = j;
      while (k < code.length && (code[k] === ' ' || code[k] === '\t')) k++;
      out.push({ t: code[k] === ':' ? 'key' : 'str', v: str });
      i = j;
      continue;
    }

    // number
    if (/[\d\-]/.test(ch) && (ch !== '-' || /\d/.test(code[i + 1] ?? ''))) {
      let j = i + 1;
      while (j < code.length && /[\d.eE+\-]/.test(code[j])) j++;
      out.push({ t: 'num', v: code.slice(i, j) });
      i = j;
      continue;
    }

    // booleans / null
    const boolMatch = code.slice(i).match(/^(true|false|null)/);
    if (boolMatch) {
      out.push({ t: 'kw', v: boolMatch[0] });
      i += boolMatch[0].length;
      continue;
    }

    // punctuation
    if ('{}[],:'.includes(ch)) {
      out.push({ t: 'pct', v: ch });
      i++;
      continue;
    }

    out.push({ t: 'plain', v: ch });
    i++;
  }

  return out;
}

function tokenizeGeneric(code: string, lang: string): Token[] {
  const out: Token[] = [];

  const KW_PY = /^(from|import|def|class|if|elif|else|for|while|return|with|as|in|not|and|or|True|False|None|async|await|try|except|raise|pass|break|continue|lambda|yield|global|nonlocal|del|assert|finally|is)\b/;
  const KW_JS = /^(const|let|var|function|class|if|else|for|while|return|import|export|from|async|await|new|typeof|instanceof|true|false|null|undefined|this|super|extends|static|get|set|of|in|default|switch|case|break|continue|throw|try|catch|finally|delete|void|yield)\b/;
  const KW_GO = /^(func|var|const|type|struct|interface|package|import|if|else|for|return|nil|true|false|make|new|go|chan|map|range|select|case|switch|break|continue|defer|goto|fallthrough)\b/;
  const KW_PHP = /^(function|class|if|else|elseif|for|foreach|while|return|new|echo|use|namespace|true|false|null|public|private|protected|static|abstract|interface|extends|implements|try|catch|finally|throw)\b/;

  const kwMap: Record<string, RegExp> = {
    python: KW_PY,
    javascript: KW_JS,
    typescript: KW_JS,
    go: KW_GO,
    php: KW_PHP,
  };
  const kwRe = kwMap[lang] ?? KW_JS;

  let i = 0;
  while (i < code.length) {
    const rest = code.slice(i);

    // single-line comment
    if (rest.startsWith('//') || rest.startsWith('#')) {
      const end = code.indexOf('\n', i);
      const cmt = end === -1 ? code.slice(i) : code.slice(i, end);
      out.push({ t: 'cmt', v: cmt });
      i += cmt.length;
      continue;
    }

    // multi-line /* ... */
    if (rest.startsWith('/*')) {
      const end = code.indexOf('*/', i + 2);
      const cmt = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      out.push({ t: 'cmt', v: cmt });
      i += cmt.length;
      continue;
    }

    // Python docstring / triple-quoted
    if (rest.startsWith('"""') || rest.startsWith("'''")) {
      const q = rest.slice(0, 3);
      const end = code.indexOf(q, i + 3);
      const s = end === -1 ? code.slice(i) : code.slice(i, end + 3);
      out.push({ t: 'str', v: s });
      i += s.length;
      continue;
    }

    // template literal (backtick)
    if (code[i] === '`') {
      let j = i + 1;
      while (j < code.length && code[j] !== '`') {
        if (code[j] === '\\') j++;
        j++;
      }
      out.push({ t: 'str', v: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // string " or '
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === q) { j++; break; }
        j++;
      }
      out.push({ t: 'str', v: code.slice(i, j) });
      i = j;
      continue;
    }

    // PHP variable
    if (lang === 'php' && code[i] === '$') {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      out.push({ t: 'var', v: code.slice(i, j) });
      i = j;
      continue;
    }

    // number
    if (/\d/.test(code[i]) || (code[i] === '0' && /[xXbBoO]/.test(code[i + 1] ?? ''))) {
      let j = i;
      if (code[j] === '0' && /[xX]/.test(code[j+1] ?? '')) {
        j += 2;
        while (j < code.length && /[0-9a-fA-F]/.test(code[j])) j++;
      } else {
        while (j < code.length && /[\d.eE+\-_]/.test(code[j])) j++;
      }
      out.push({ t: 'num', v: code.slice(i, j) });
      i = j;
      continue;
    }

    // identifier (keyword, function, type, plain)
    if (/[a-zA-Z_]/.test(code[i])) {
      const kwMatch = rest.match(kwRe);
      if (kwMatch) {
        out.push({ t: 'kw', v: kwMatch[0] });
        i += kwMatch[0].length;
        continue;
      }
      let j = i;
      while (j < code.length && /[\w]/.test(code[j])) j++;
      const word = code.slice(i, j);
      // peek for '(' → function call
      let k = j;
      while (k < code.length && (code[k] === ' ' || code[k] === '\t')) k++;
      if (code[k] === '(') {
        out.push({ t: 'fn', v: word });
      } else if (/^[A-Z]/.test(word) && lang !== 'python') {
        out.push({ t: 'type', v: word });
      } else {
        out.push({ t: 'plain', v: word });
      }
      i = j;
      continue;
    }

    out.push({ t: 'plain', v: code[i] });
    i++;
  }

  return out;
}

function tokenizeDNS(code: string): Token[] {
  return code.split('\n').flatMap((line, li) => {
    const tokens: Token[] = [];
    if (li > 0) tokens.push({ t: 'plain', v: '\n' });
    if (!line.trim()) return tokens;

    // Comments
    if (line.trimStart().startsWith(';')) {
      tokens.push({ t: 'cmt', v: line });
      return tokens;
    }

    // TXT value inside quotes
    const txtMatch = line.match(/^(.+?TXT\s+)(["'].+["'])\s*$/);
    if (txtMatch) {
      const prefix = txtMatch[1];
      const value = txtMatch[2];
      // tokenize prefix: domain + TYPE
      const parts = prefix.split(/\s+/);
      parts.forEach((p, pi) => {
        if (pi > 0) tokens.push({ t: 'plain', v: ' ' });
        if (/^[A-Z]+$/.test(p)) {
          tokens.push({ t: 'kw', v: p });
        } else if (p === 'IN') {
          tokens.push({ t: 'type', v: p });
        } else {
          tokens.push({ t: 'dns-field', v: p });
        }
      });
      tokens.push({ t: 'plain', v: ' ' });
      // tokenize TXT content: "v=nais1; key=value; ..."
      tokens.push({ t: 'pct', v: '"' });
      const inner = value.slice(1, -1);
      inner.split(';').forEach((seg, si) => {
        if (si > 0) tokens.push({ t: 'dns-sep', v: '; ' });
        const eqIdx = seg.indexOf('=');
        if (eqIdx !== -1) {
          tokens.push({ t: 'dns-field', v: seg.slice(0, eqIdx).trim() });
          tokens.push({ t: 'dns-sep', v: '=' });
          tokens.push({ t: 'dns-value', v: seg.slice(eqIdx + 1).trim() });
        } else {
          tokens.push({ t: 'dns-value', v: seg.trim() });
        }
      });
      tokens.push({ t: 'pct', v: '"' });
      return tokens;
    }

    // Fallback: plain
    tokens.push({ t: 'plain', v: line });
    return tokens;
  });
}

function tokenizeBash(code: string): Token[] {
  const out: Token[] = [];
  const BASH_KW = /^(if|then|else|elif|fi|for|while|do|done|case|esac|in|function|return|local|export|source|echo|curl|mkdir|cd|ls|cat|set|unset|readonly|shift|true|false)\b/;

  let i = 0;
  while (i < code.length) {
    const rest = code.slice(i);

    if (rest.startsWith('#')) {
      const end = code.indexOf('\n', i);
      const cmt = end === -1 ? rest : code.slice(i, end);
      out.push({ t: 'cmt', v: cmt });
      i += cmt.length;
      continue;
    }

    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === q) { j++; break; }
        j++;
      }
      out.push({ t: 'str', v: code.slice(i, j) });
      i = j;
      continue;
    }

    if (code[i] === '$') {
      let j = i + 1;
      if (code[j] === '{') {
        j++;
        while (j < code.length && code[j] !== '}') j++;
        j++;
      } else {
        while (j < code.length && /[\w]/.test(code[j])) j++;
      }
      out.push({ t: 'var', v: code.slice(i, j) });
      i = j;
      continue;
    }

    if (/[a-zA-Z_]/.test(code[i])) {
      const kwMatch = rest.match(BASH_KW);
      if (kwMatch) {
        out.push({ t: 'kw', v: kwMatch[0] });
        i += kwMatch[0].length;
        continue;
      }
      let j = i;
      while (j < code.length && /[\w\-\.]/.test(code[j])) j++;
      out.push({ t: 'plain', v: code.slice(i, j) });
      i = j;
      continue;
    }

    out.push({ t: 'plain', v: code[i] });
    i++;
  }

  return out;
}

function tokenize(code: string, lang: string): Token[] {
  if (lang === 'json') return tokenizeJSON(code);
  if (lang === 'dns') return tokenizeDNS(code);
  if (lang === 'bash' || lang === 'shell') return tokenizeBash(code);
  if (['python', 'javascript', 'typescript', 'go', 'php'].includes(lang))
    return tokenizeGeneric(code, lang);
  return [{ t: 'plain', v: code }];
}

// ------- Render tokens -------

function renderTokens(tokens: Token[]): React.ReactNode {
  return tokens.map((tok, i) => {
    if (tok.t === 'plain') return <span key={i}>{tok.v}</span>;
    return (
      <span key={i} className={`tok-${tok.t}`}>
        {tok.v}
      </span>
    );
  });
}

// ------- Component -------

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const LANG_LABELS: Record<string, string> = {
  json: 'JSON',
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  go: 'Go',
  php: 'PHP',
  bash: 'Bash',
  shell: 'Shell',
  dns: 'DNS',
  http: 'HTTP',
  yaml: 'YAML',
  text: 'Text',
};

export default function CodeBlock({
  code,
  language = 'text',
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trimEnd());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const tokens = tokenize(code, language);
  const label = LANG_LABELS[language] ?? language;
  const lines = code.split('\n');

  return (
    <div className="code-block my-5 group">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: '#21262d', background: '#161b22' }}
      >
        <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
          {filename && <span className="text-slate-300">{filename}</span>}
          {!filename && <span>{label}</span>}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <polyline points="1,6 4.5,9.5 11,2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="4" y="4" width="7" height="7" rx="1" />
                <path d="M8 4V3a1 1 0 00-1-1H1a1 1 0 00-1 1v6a1 1 0 001 1h1" strokeLinecap="round" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto" style={{ padding: '1.125rem 1.375rem', margin: 0 }}>
        {showLineNumbers ? (
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="flex">
                <span
                  className="select-none text-right pr-4 text-slate-600 text-xs"
                  style={{ minWidth: '2rem', lineHeight: '1.7' }}
                >
                  {idx + 1}
                </span>
                <span>{renderTokens(tokenize(line, language))}</span>
              </div>
            ))}
          </code>
        ) : (
          <code>{renderTokens(tokens)}</code>
        )}
      </pre>
    </div>
  );
}
