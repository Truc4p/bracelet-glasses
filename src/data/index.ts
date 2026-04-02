import { useState, useCallback, useEffect } from "react";
import { DEFAULT_CRYSTALS, type CrystalEntry } from "./crystals";
import { DEFAULT_SPACERS, type SpacerEntry } from "./spacers";
import { DEFAULT_CHARMS, type CharmEntry } from "./charms";
import { DEFAULT_FRAMES, type FrameEntry } from "./glasses";

export type { CrystalEntry, SpacerEntry, CharmEntry, FrameEntry };

// ── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "bino_catalogue_v3";

interface CatalogueStore {
  crystals: CrystalEntry[];
  spacers: SpacerEntry[];
  charms: CharmEntry[];
  frames: FrameEntry[];
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
  stored.forEach((s) => {
    const defaultItem = map.get(s.id);
    if (defaultItem) {
      // keep stored data, but if a property (like 'image') is missing in stored, use default
      map.set(s.id, { ...defaultItem, ...s });
    } else {
      map.set(s.id, s);
    }
  });
  return Array.from(map.values());
}

// ── Public hook ──────────────────────────────────────────────────────────────
export interface CatalogueState extends CatalogueStore {
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
  // Frame helpers
  addFrame: (entry: FrameEntry) => void;
  updateFrame: (entry: FrameEntry) => void;
  deleteFrame: (id: string) => void;
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
      frames: merge(DEFAULT_FRAMES, saved.frames ?? []),
    };
  });

  // Fetch frames from MongoDB backend over API
  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    // 1. Fetch frames first
    fetch(`${BACKEND_URL}/api/frames`)
      .then(res => res.json())
      .then(dbFrames => {
        if (dbFrames && Array.isArray(dbFrames) && dbFrames.length > 0) {
          setStore(prevStore => ({
            ...prevStore,
            frames: merge(DEFAULT_FRAMES, dbFrames)
          }));
        }
      })
      .catch(err => console.error("Could not load catalogue data from MongoDB backend:", err));
  }, []);

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

  // ── Frame mutations ──
  const addFrame = useCallback(
    (entry: FrameEntry) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/frames`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      }).catch(err => console.error("Failed to add frame to MongoDB", err));
      
      persist({ ...store, frames: [...store.frames, entry] });
    },
    [store, persist]
  );
  
  const updateFrame = useCallback(
    (entry: FrameEntry) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/frames/${entry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      }).catch(err => console.error("Failed to update frame in MongoDB", err));

      persist({
        ...store,
        frames: store.frames.map((f) => (f.id === entry.id ? entry : f)),
      });
    },
    [store, persist]
  );
  
  const deleteFrame = useCallback(
    (id: string) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/frames/${id}`, {
        method: "DELETE"
      }).catch(err => console.error("Failed to delete frame from MongoDB", err));

      persist({ ...store, frames: store.frames.filter((f) => f.id !== id) });
    },
    [store, persist]
  );

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    persist({
      crystals: [...DEFAULT_CRYSTALS],
      spacers: [...DEFAULT_SPACERS],
      charms: [...DEFAULT_CHARMS],
      frames: [...DEFAULT_FRAMES],
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
    addFrame,
    updateFrame,
    deleteFrame,
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
    frames: merge(DEFAULT_FRAMES, saved.frames ?? []),
  };
}

export { DEFAULT_CRYSTALS, DEFAULT_SPACERS, DEFAULT_CHARMS, DEFAULT_FRAMES };
