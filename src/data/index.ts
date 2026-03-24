import { useState, useCallback, useEffect } from "react";
import { DEFAULT_CRYSTALS, type CrystalEntry } from "./crystals";
import { DEFAULT_SPACERS, type SpacerEntry } from "./spacers";
import { DEFAULT_CHARMS, type CharmEntry } from "./charms";

export type { CrystalEntry, SpacerEntry, CharmEntry };

// ── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "bino_catalogue_v1";

interface CatalogueStore {
  crystals: CrystalEntry[];
  spacers: SpacerEntry[];
  charms: CharmEntry[];
}

function loadFromStorage(): Partial<CatalogueStore> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(data: CatalogueStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
}

/** Merge stored overrides on top of defaults by id */
function merge<T extends { id: string }>(defaults: T[], stored: T[]): T[] {
  const map = new Map(defaults.map((d) => [d.id, d]));
  // Apply stored overrides (update existing + add new)
  stored.forEach((s) => map.set(s.id, s));
  return Array.from(map.values());
}

// ── Public hook ──────────────────────────────────────────────────────────────
export interface CatalogueState {
  crystals: CrystalEntry[];
  spacers: SpacerEntry[];
  charms: CharmEntry[];
  // Crystal helpers
  addCrystal: (entry: CrystalEntry) => void;
  updateCrystal: (entry: CrystalEntry) => void;
  deleteCrystal: (id: string) => void;
  // Spacer helpers
  addSpacer: (entry: SpacerEntry) => void;
  updateSpacer: (entry: SpacerEntry) => void;
  deleteSpacer: (id: string) => void;
  // Charm helpers
  addCharm: (entry: CharmEntry) => void;
  updateCharm: (entry: CharmEntry) => void;
  deleteCharm: (id: string) => void;
  // Reset everything to defaults
  resetToDefaults: () => void;
}

export function useCatalogue(): CatalogueState {
  const [store, setStore] = useState<CatalogueStore>(() => {
    const saved = loadFromStorage();
    return {
      crystals: merge(DEFAULT_CRYSTALS, saved.crystals ?? []),
      spacers: merge(DEFAULT_SPACERS, saved.spacers ?? []),
      charms: merge(DEFAULT_CHARMS, saved.charms ?? []),
    };
  });

  // Persist whenever store changes
  useEffect(() => {
    saveToStorage(store);
  }, [store]);

  const persist = useCallback((next: CatalogueStore) => {
    setStore(next);
  }, []);

  // ── Crystal mutations ──
  const addCrystal = useCallback(
    (entry: CrystalEntry) =>
      persist({ ...store, crystals: [...store.crystals, entry] }),
    [store, persist]
  );
  const updateCrystal = useCallback(
    (entry: CrystalEntry) =>
      persist({
        ...store,
        crystals: store.crystals.map((c) => (c.id === entry.id ? entry : c)),
      }),
    [store, persist]
  );
  const deleteCrystal = useCallback(
    (id: string) =>
      persist({ ...store, crystals: store.crystals.filter((c) => c.id !== id) }),
    [store, persist]
  );

  // ── Spacer mutations ──
  const addSpacer = useCallback(
    (entry: SpacerEntry) =>
      persist({ ...store, spacers: [...store.spacers, entry] }),
    [store, persist]
  );
  const updateSpacer = useCallback(
    (entry: SpacerEntry) =>
      persist({
        ...store,
        spacers: store.spacers.map((s) => (s.id === entry.id ? entry : s)),
      }),
    [store, persist]
  );
  const deleteSpacer = useCallback(
    (id: string) =>
      persist({ ...store, spacers: store.spacers.filter((s) => s.id !== id) }),
    [store, persist]
  );

  // ── Charm mutations ──
  const addCharm = useCallback(
    (entry: CharmEntry) =>
      persist({ ...store, charms: [...store.charms, entry] }),
    [store, persist]
  );
  const updateCharm = useCallback(
    (entry: CharmEntry) =>
      persist({
        ...store,
        charms: store.charms.map((c) => (c.id === entry.id ? entry : c)),
      }),
    [store, persist]
  );
  const deleteCharm = useCallback(
    (id: string) =>
      persist({ ...store, charms: store.charms.filter((c) => c.id !== id) }),
    [store, persist]
  );

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    persist({
      crystals: [...DEFAULT_CRYSTALS],
      spacers: [...DEFAULT_SPACERS],
      charms: [...DEFAULT_CHARMS],
    });
  }, [persist]);

  return {
    ...store,
    addCrystal,
    updateCrystal,
    deleteCrystal,
    addSpacer,
    updateSpacer,
    deleteSpacer,
    addCharm,
    updateCharm,
    deleteCharm,
    resetToDefaults,
  };
}

// ── Singleton read helpers (for use outside React) ────────────────────────────
export function getCatalogueSnapshot(): CatalogueStore {
  const saved = loadFromStorage();
  return {
    crystals: merge(DEFAULT_CRYSTALS, saved.crystals ?? []),
    spacers: merge(DEFAULT_SPACERS, saved.spacers ?? []),
    charms: merge(DEFAULT_CHARMS, saved.charms ?? []),
  };
}

export { DEFAULT_CRYSTALS, DEFAULT_SPACERS, DEFAULT_CHARMS };
