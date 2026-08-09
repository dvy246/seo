import type { PageSetup, BrandProfile } from '@/types';

const PAGE_SETUPS_KEY = 'metaforge:pageSetups';
const BRAND_KEY = 'metaforge:brandProfile';

export function loadPageSetups(): PageSetup[] {
  try {
    const raw = localStorage.getItem(PAGE_SETUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PageSetup[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePageSetupsList(setups: PageSetup[]): void {
  try {
    localStorage.setItem(PAGE_SETUPS_KEY, JSON.stringify(setups));
  } catch {
    // storage full or unavailable
  }
}

export function upsertPageSetup(setup: PageSetup): PageSetup[] {
  const setups = loadPageSetups();
  const idx = setups.findIndex((s) => s.id === setup.id);
  const updated = { ...setup, updatedAt: Date.now() };
  if (idx >= 0) {
    setups[idx] = updated;
  } else {
    setups.unshift(updated);
  }
  savePageSetupsList(setups);
  return setups;
}

export function deletePageSetup(id: string): PageSetup[] {
  const setups = loadPageSetups().filter((s) => s.id !== id);
  savePageSetupsList(setups);
  return setups;
}

export function loadBrandProfile(): BrandProfile | null {
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BrandProfile;
  } catch {
    return null;
  }
}

export function saveBrandProfile(brand: BrandProfile): void {
  try {
    localStorage.setItem(BRAND_KEY, JSON.stringify(brand));
  } catch {
    // noop
  }
}
