import { translations } from './translations';

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj);
}

function interpolate(str, params = {}) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`));
}

export function t(lang, key, params) {
  const dict = translations[lang] || translations.en;
  const fallback = translations.en;

  const value = getNested(dict, key) ?? getNested(fallback, key) ?? key;
  return typeof value === 'string' ? interpolate(value, params) : String(value);
}