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
  const [store, setStore] = useState<CatalogueStore>(() => {
    const saved = loadFromStorage();
    return {
      crystals: merge(DEFAULT_CRYSTALS, saved.crystals ?? []),
      frames: merge(DEFAULT_FRAMES, saved.frames ?? []),
      types: merge([], saved.types ?? []),
    };
  });

  // Fetch frames from MongoDB backend over API
  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    // Fetch frames
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

    // Fetch crystals
    fetch(`${BACKEND_URL}/api/crystals`)
      .then(res => res.json())
      .then(dbCrystals => {
        if (dbCrystals && Array.isArray(dbCrystals) && dbCrystals.length > 0) {
          setStore(prevStore => ({
            ...prevStore,
            crystals: merge(DEFAULT_CRYSTALS, dbCrystals)
          }));
        }
      })
      .catch(err => console.error("Could not load crystal data from MongoDB backend:", err));

    // Fetch types
    fetch(`${BACKEND_URL}/api/types`)
      .then(res => res.json())
      .then(dbTypes => {
        if (dbTypes && Array.isArray(dbTypes)) {
          setStore(prevStore => ({
            ...prevStore,
            types: merge([], dbTypes)
          }));
        }
      })
      .catch(err => console.error("Could not load type data from MongoDB backend:", err));
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
    (entry: CrystalEntry) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/crystals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      }).catch(err => console.error("Failed to add crystal to MongoDB", err));

      persist({ ...store, crystals: [...store.crystals, entry] });
    },
    [store, persist]
  );
  
  const updateCrystal = useCallback(
    (entry: CrystalEntry) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/crystals/${entry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      }).catch(err => console.error("Failed to update crystal in MongoDB", err));

      persist({
        ...store,
        crystals: store.crystals.map((c) => (c.id === entry.id ? entry : c)),
      });
    },
    [store, persist]
  );
  
  const deleteCrystal = useCallback(
    (id: string) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/crystals/${id}`, {
        method: "DELETE"
      }).catch(err => console.error("Failed to delete crystal from MongoDB", err));

      persist({ ...store, crystals: store.crystals.filter((c) => c.id !== id) });
    },
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

  // ── Type mutations ──
  const addType = useCallback(
    (entry: TypeEntry) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      })
      .then(res => res.json())
      .then(savedType => {
         persist({ ...store, types: [...store.types, savedType] });
      })
      .catch(err => console.error("Failed to add type to MongoDB", err));
    },
    [store, persist]
  );
  
  const updateType = useCallback(
    (entry: TypeEntry) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/types/${entry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      }).catch(err => console.error("Failed to update type in MongoDB", err));

      persist({
        ...store,
        types: store.types.map((t) => (t.id === entry.id ? entry : t)),
      });
    },
    [store, persist]
  );
  
  const deleteType = useCallback(
    (id: string) => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
      fetch(`${BACKEND_URL}/api/types/${id}`, {
        method: "DELETE"
      }).catch(err => console.error("Failed to delete type from MongoDB", err));

      persist({ ...store, types: store.types.filter((t) => t.id !== id) });
    },
    [store, persist]
  );

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    persist({
      crystals: [...DEFAULT_CRYSTALS],
      frames: [...DEFAULT_FRAMES],
      types: [],
    });
  }, [persist]);

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
  const saved = loadFromStorage();
  return {
    crystals: merge(DEFAULT_CRYSTALS, saved.crystals ?? []),
    frames: merge(DEFAULT_FRAMES, saved.frames ?? []),
    types: merge([], saved.types ?? []),
  };
}

export { DEFAULT_CRYSTALS, DEFAULT_FRAMES };
