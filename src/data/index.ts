import { useState, useCallback, useEffect } from "react";
import { DEFAULT_CRYSTALS, type CrystalEntry } from "./crystals";
import { DEFAULT_FRAMES, type FrameEntry } from "./glasses";

export interface TypeEntry {
  id: string; // The MongoDB ObjectId
  name: string;
  description: string;
}

export type { CrystalEntry, FrameEntry };

// ── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "bino_catalogue_v3";

interface CatalogueStore {
  crystals: CrystalEntry[];
  frames: FrameEntry[];
  types: TypeEntry[];
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

// ── Global State Management ──────────────────────────────────────────────────
let globalStore: CatalogueStore = (() => {
  const saved = loadFromStorage();
  return {
    crystals: merge(DEFAULT_CRYSTALS, saved.crystals ?? []),
    frames: merge(DEFAULT_FRAMES, saved.frames ?? []),
    types: merge([], saved.types ?? []),
  };
})();

let hasFetchedFromBackend = false;
const listeners = new Set<(store: CatalogueStore) => void>();

function setGlobalStore(newStore: CatalogueStore) {
  globalStore = newStore;
  saveToStorage(globalStore);
  listeners.forEach((listener) => listener(globalStore));
}

// ── Public hook ──────────────────────────────────────────────────────────────
export interface CatalogueState extends CatalogueStore {
  // Crystal helpers
  addCrystal: (entry: CrystalEntry) => void;
  updateCrystal: (entry: CrystalEntry) => void;
  deleteCrystal: (id: string) => void;
  // Frame helpers
  addFrame: (entry: FrameEntry) => void;
  updateFrame: (entry: FrameEntry) => void;
  deleteFrame: (id: string) => void;
  // Type helpers
  addType: (entry: TypeEntry) => void;
  updateType: (entry: TypeEntry) => void;
  deleteType: (id: string) => void;
  // Reset everything to defaults
  resetToDefaults: () => void;
}

export function useCatalogue(): CatalogueState {
  const [store, setStore] = useState<CatalogueStore>(globalStore);

  useEffect(() => {
    listeners.add(setStore);
    return () => {
      listeners.delete(setStore);
    };
  }, []);

  // Fetch frames from MongoDB backend over API
  useEffect(() => {
    if (hasFetchedFromBackend) return;
    hasFetchedFromBackend = true;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    // Fetch frames
    fetch(`${BACKEND_URL}/api/frames`)
      .then(res => res.json())
      .then(dbFrames => {
        if (dbFrames && Array.isArray(dbFrames) && dbFrames.length > 0) {
          setGlobalStore({
            ...globalStore,
            frames: merge(DEFAULT_FRAMES, dbFrames)
          });
        }
      })
      .catch(err => console.error("Could not load catalogue data from MongoDB backend:", err));

    // Fetch crystals
    fetch(`${BACKEND_URL}/api/crystals`)
      .then(res => res.json())
      .then(dbCrystals => {
        if (dbCrystals && Array.isArray(dbCrystals) && dbCrystals.length > 0) {
          setGlobalStore({
            ...globalStore,
            crystals: merge(DEFAULT_CRYSTALS, dbCrystals)
          });
        }
      })
      .catch(err => console.error("Could not load crystal data from MongoDB backend:", err));

    // Fetch types
    fetch(`${BACKEND_URL}/api/types`)
      .then(res => res.json())
      .then(dbTypes => {
        if (dbTypes && Array.isArray(dbTypes)) {
          setGlobalStore({
            ...globalStore,
            types: merge([], dbTypes)
          });
        }
      })
      .catch(err => console.error("Could not load type data from MongoDB backend:", err));
  }, []);

  // ── Crystal mutations ──
  const addCrystal = useCallback((entry: CrystalEntry) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/crystals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    }).catch(err => console.error("Failed to add crystal to MongoDB", err));

    setGlobalStore({ ...globalStore, crystals: [...globalStore.crystals, entry] });
  }, []);
  
  const updateCrystal = useCallback((entry: CrystalEntry) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/crystals/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    }).catch(err => console.error("Failed to update crystal in MongoDB", err));

    setGlobalStore({
      ...globalStore,
      crystals: globalStore.crystals.map((c) => (c.id === entry.id ? entry : c)),
    });
  }, []);
  
  const deleteCrystal = useCallback((id: string) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/crystals/${id}`, {
      method: "DELETE"
    }).catch(err => console.error("Failed to delete crystal from MongoDB", err));

    setGlobalStore({ ...globalStore, crystals: globalStore.crystals.filter((c) => c.id !== id) });
  }, []);

  // ── Frame mutations ──
  const addFrame = useCallback((entry: FrameEntry) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/frames`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    }).catch(err => console.error("Failed to add frame to MongoDB", err));
    
    setGlobalStore({ ...globalStore, frames: [...globalStore.frames, entry] });
  }, []);
  
  const updateFrame = useCallback((entry: FrameEntry) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/frames/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    }).catch(err => console.error("Failed to update frame in MongoDB", err));

    setGlobalStore({
      ...globalStore,
      frames: globalStore.frames.map((f) => (f.id === entry.id ? entry : f)),
    });
  }, []);
  
  const deleteFrame = useCallback((id: string) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/frames/${id}`, {
      method: "DELETE"
    }).catch(err => console.error("Failed to delete frame from MongoDB", err));

    setGlobalStore({ ...globalStore, frames: globalStore.frames.filter((f) => f.id !== id) });
  }, []);

  // ── Type mutations ──
  const addType = useCallback((entry: TypeEntry) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    })
    .then(res => res.json())
    .then(savedType => {
       setGlobalStore({ ...globalStore, types: [...globalStore.types, savedType] });
    })
    .catch(err => console.error("Failed to add type to MongoDB", err));
  }, []);
  
  const updateType = useCallback((entry: TypeEntry) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/types/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    }).catch(err => console.error("Failed to update type in MongoDB", err));

    setGlobalStore({
      ...globalStore,
      types: globalStore.types.map((t) => (t.id === entry.id ? entry : t)),
    });
  }, []);
  
  const deleteType = useCallback((id: string) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    fetch(`${BACKEND_URL}/api/types/${id}`, {
      method: "DELETE"
    }).catch(err => console.error("Failed to delete type from MongoDB", err));

    setGlobalStore({ ...globalStore, types: globalStore.types.filter((t) => t.id !== id) });
  }, []);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setGlobalStore({
      crystals: [...DEFAULT_CRYSTALS],
      frames: [...DEFAULT_FRAMES],
      types: [],
    });
  }, []);

  return {
    ...store,
    addCrystal,
    updateCrystal,
    deleteCrystal,
    addFrame,
    updateFrame,
    deleteFrame,
    addType,
    updateType,
    deleteType,
    resetToDefaults,
  };
}

// ── Singleton read helpers (for use outside React) ────────────────────────────
export function getCatalogueSnapshot(): CatalogueStore {
  return globalStore;
}

export { DEFAULT_CRYSTALS, DEFAULT_FRAMES };
