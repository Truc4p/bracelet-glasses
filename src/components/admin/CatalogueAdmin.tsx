import { useState } from "react";
import { Plus, Pencil, Trash2, RotateCcw, Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCatalogue } from "@/data/index";
import type { CrystalEntry } from "@/data/crystals";
import type { SpacerEntry } from "@/data/spacers";
import type { CharmEntry } from "@/data/charms";
import { CrystalForm, SpacerForm, CharmForm } from "./CrystalForm";
import StockBadge from "./StockBadge";

type AdminTab = "crystals" | "spacers" | "charms";
type ModalState =
  | { type: "add-crystal" }
  | { type: "edit-crystal"; entry: CrystalEntry }
  | { type: "add-spacer" }
  | { type: "edit-spacer"; entry: SpacerEntry }
  | { type: "add-charm" }
  | { type: "edit-charm"; entry: CharmEntry }
  | null;

const CatalogueAdmin = () => {
  const cat = useCatalogue();
  const [tab, setTab] = useState<AdminTab>("crystals");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const tabLabel = (t: AdminTab) =>
    ({ crystals: "Crystals", spacers: "Spacers", charms: "Charms" })[t];

  // ── Filtered lists ──
  const q = search.toLowerCase();
  const filteredCrystals = cat.crystals.filter((c) => c.name.toLowerCase().includes(q));
  const filteredSpacers = cat.spacers.filter((s) => s.name.toLowerCase().includes(q));
  const filteredCharms = cat.charms.filter((c) =>
    c.animal.toLowerCase().includes(q) || c.design.includes(q)
  );

  // ── Delete with confirmation ──
  const requestDelete = (id: string) => setConfirmDelete(id);
  const cancelDelete = () => setConfirmDelete(null);
  const confirmDeleteFn = (id: string) => {
    if (tab === "crystals") cat.deleteCrystal(id);
    else if (tab === "spacers") cat.deleteSpacer(id);
    else cat.deleteCharm(id);
    setConfirmDelete(null);
  };

  const closeModal = () => setModal(null);

  return (
    <div className="flex-1 flex flex-col animate-fade-in overflow-hidden">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h2 className="font-display text-base font-semibold">Catalogue Manager</h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-body">
            Add, edit, or remove items. Changes persist across sessions.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (window.confirm("Reset all catalogue data to factory defaults? This cannot be undone.")) {
              cat.resetToDefaults();
            }
          }}
          className="text-muted-foreground hover:text-destructive gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar tabs */}
        <div className="w-36 border-r border-border flex flex-col gap-1 p-3 shrink-0">
          {(["crystals", "spacers", "charms"] as AdminTab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(""); setModal(null); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tabLabel(t)}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${tabLabel(tab).toLowerCase()}...`}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
              />
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (tab === "crystals") setModal({ type: "add-crystal" });
                else if (tab === "spacers") setModal({ type: "add-spacer" });
                else setModal({ type: "add-charm" });
                setSearch("");
              }}
              className="gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add {tabLabel(tab).slice(0, -1)}
            </Button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Inline add/edit modal */}
            {modal && (
              <div className="mb-4 p-4 glass-panel rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold font-display">
                    {modal.type.startsWith("add") ? "New" : "Edit"}{" "}
                    {modal.type.includes("crystal") ? "Crystal" : modal.type.includes("spacer") ? "Spacer" : "Charm"}
                  </h3>
                  <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {modal.type === "add-crystal" && (
                  <CrystalForm onSave={(e) => { cat.addCrystal(e); closeModal(); }} onCancel={closeModal} />
                )}
                {modal.type === "edit-crystal" && (
                  <CrystalForm initial={modal.entry} onSave={(e) => { cat.updateCrystal(e); closeModal(); }} onCancel={closeModal} />
                )}
                {modal.type === "add-spacer" && (
                  <SpacerForm onSave={(e) => { cat.addSpacer(e); closeModal(); }} onCancel={closeModal} />
                )}
                {modal.type === "edit-spacer" && (
                  <SpacerForm initial={modal.entry} onSave={(e) => { cat.updateSpacer(e); closeModal(); }} onCancel={closeModal} />
                )}
                {modal.type === "add-charm" && (
                  <CharmForm onSave={(e) => { cat.addCharm(e); closeModal(); }} onCancel={closeModal} />
                )}
                {modal.type === "edit-charm" && (
                  <CharmForm initial={modal.entry} onSave={(e) => { cat.updateCharm(e); closeModal(); }} onCancel={closeModal} />
                )}
              </div>
            )}

            {/* Crystals table */}
            {tab === "crystals" && (
              <div className="space-y-1">
                {filteredCrystals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No crystals found.</p>
                )}
                {filteredCrystals.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/40 transition-colors group">
                    {/* Swatch / image */}
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover border border-border/50 shadow-sm flex-shrink-0"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = "none";
                          el.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 rounded-full border border-border/50 shadow-sm flex-shrink-0 ${c.image ? "hidden" : ""}`}
                      style={{ background: c.gradient || c.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                        {(c.tags ?? []).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            {tag}
                          </span>
                        ))}
                        <StockBadge stock={c.stock} />
                      </div>
                      <span className="text-xs text-muted-foreground">${c.price.toFixed(2)} / bead</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {confirmDelete === c.id ? (
                        <>
                          <Button size="sm" variant="destructive" onClick={() => confirmDeleteFn(c.id)} className="h-7 px-2 text-xs">Confirm</Button>
                          <Button size="sm" variant="ghost" onClick={cancelDelete} className="h-7 px-2 text-xs">Cancel</Button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setModal({ type: "edit-crystal", entry: c })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => requestDelete(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Spacers table */}
            {tab === "spacers" && (
              <div className="space-y-1">
                {filteredSpacers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No spacers found.</p>
                )}
                {filteredSpacers.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/40 transition-colors group">
                    <div className="w-8 h-8 rounded-full border border-border/50 shadow-sm flex-shrink-0" style={{ background: s.metallic }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{s.name}</span>
                        <StockBadge stock={s.stock} />
                      </div>
                      <span className="text-xs text-muted-foreground">${s.price.toFixed(2)} / spacer</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {confirmDelete === s.id ? (
                        <>
                          <Button size="sm" variant="destructive" onClick={() => confirmDeleteFn(s.id)} className="h-7 px-2 text-xs">Confirm</Button>
                          <Button size="sm" variant="ghost" onClick={cancelDelete} className="h-7 px-2 text-xs">Cancel</Button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setModal({ type: "edit-spacer", entry: s })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => requestDelete(s.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Charms table */}
            {tab === "charms" && (
              <div className="space-y-1">
                {filteredCharms.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No charms found.</p>
                )}
                {filteredCharms.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/40 transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center text-xl">{c.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{c.animal}</span>
                        <span className="text-xs text-muted-foreground capitalize">· {c.design}</span>
                        <StockBadge stock={c.stock} />
                      </div>
                      <span className="text-xs text-muted-foreground">${c.price.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {confirmDelete === c.id ? (
                        <>
                          <Button size="sm" variant="destructive" onClick={() => confirmDeleteFn(c.id)} className="h-7 px-2 text-xs">Confirm</Button>
                          <Button size="sm" variant="ghost" onClick={cancelDelete} className="h-7 px-2 text-xs">Cancel</Button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setModal({ type: "edit-charm", entry: c })} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => requestDelete(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer stats */}
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-body flex gap-4">
            <span>{cat.crystals.length} crystals</span>
            <span>{cat.spacers.length} spacers</span>
            <span>{cat.charms.length} charms</span>
            <span className="ml-auto">
              {cat.crystals.filter((c) => c.stock === 0).length > 0 && (
                <span className="text-destructive">
                  {cat.crystals.filter((c) => c.stock === 0).length} out of stock
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueAdmin;
