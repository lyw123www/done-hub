export const DEFAULT_BRAND_NAME = 'CX-Hub';
export const BRAND_TAGLINE = 'CODEX API';

const LEGACY_BRAND_NAMES = new Set(['Done Hub', 'DoneWave']);
const LEGACY_LOGO_PATHS = new Set(['/ms-icon-144x144.png']);

export function normalizeBrandName(name) {
  if (typeof name !== 'string') {
    return DEFAULT_BRAND_NAME;
  }

  const trimmedName = name.trim();
  if (!trimmedName || LEGACY_BRAND_NAMES.has(trimmedName)) {
    return DEFAULT_BRAND_NAME;
  }

  return trimmedName;
}

export function shouldUseCustomLogo(logo) {
  if (typeof logo !== 'string') {
    return false;
  }

  const trimmedLogo = logo.trim();
  return Boolean(trimmedLogo) && !LEGACY_LOGO_PATHS.has(trimmedLogo);
}

export function resolveBrandLogo(logo, fallbackLogo) {
  return shouldUseCustomLogo(logo) ? logo.trim() : fallbackLogo;
}

export function normalizeSiteInfo(siteInfo = {}) {
  return {
    ...siteInfo,
    system_name: normalizeBrandName(siteInfo.system_name),
    logo: shouldUseCustomLogo(siteInfo.logo) ? siteInfo.logo.trim() : ''
  };
}
