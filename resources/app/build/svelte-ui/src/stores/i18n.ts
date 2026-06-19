import { writable, derived, get } from 'svelte/store';
import zhTW from './locales/zh-TW';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

export type LocaleCode = 'zh-TW' | 'zh-CN' | 'en-US';

const LOCALE_MAP: Record<LocaleCode, Record<string, string>> = {
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  'en-US': enUS,
};

function detectLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem('k4_locale') as LocaleCode | null;
    if (saved && saved in LOCALE_MAP) return saved;
  } catch {}
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('zh-tw') || nav.startsWith('zh-hk') || nav.startsWith('zh-mo')) return 'zh-TW';
  if (nav.startsWith('zh')) return 'zh-CN';
  return 'en-US';
}

export const locale = writable<LocaleCode>(detectLocale());
const dict = derived(locale, ($loc) => LOCALE_MAP[$loc] || zhCN);

export function setLocale(code: LocaleCode) {
  locale.set(code);
  try { localStorage.setItem('k4_locale', code); } catch {}
}

/** Translate a key with optional {var} substitution. Re-evaluates when locale changes. */
export function t(key: string, vars?: Record<string, string | number>): string {
  let result = get(dict)[key] || `{${key}}`;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      result = result.replace(`{${k}}`, String(v));
    });
  }
  return result;
}

/** Get current locale code */
export function getLocale(): LocaleCode {
  return get(locale);
}

/** List of available locales */
export const LOCALES: { code: LocaleCode; label: string }[] = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en-US', label: 'English' },
];
