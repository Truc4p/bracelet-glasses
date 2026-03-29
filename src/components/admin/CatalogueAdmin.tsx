import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, RotateCcw, Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCatalogue } from "@/data/index";
import type { CrystalEntry } from "@/data/crystals";
import type { SpacerEntry } from "@/data/spacers";
import type { CharmEntry } from "@/data/charms";
import type { FrameEntry } from "@/data/glasses";
import { CrystalForm, SpacerForm, CharmForm } from "./CrystalForm";
import { FrameForm } from "./FrameForm";
import StockBadge from "./StockBadge";

type AdminTab = "crystals" | "spacers" | "charms" | "glasses";
type ModalState =
  | { type: "add-crystal" }
  | { type: "edit-crystal"; entry: CrystalEntry }
  | { type: "add-spacer" }
  | { type: "edit-spacer"; entry: SpacerEntry }
  | { type: "add-charm" }
  | { type: "edit-charm"; entry: CharmEntry }
  | { type: "add-glasses" }
  | { type: "edit-glasses"; entry: FrameEntry }
  | null;

const CatalogueAdmin = () => {
  const cat = useCatalogue();
  const [tab, setTab] = useState<AdminTab>("crystals");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top when opening an edit/add modal
  useEffect(() => {
    if (modal && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [modal]);

  const tabLabel = (t: AdminTab) =>
    ({ crystals: "Crystals", spacers: "Spacers", charms: "Charms", glasses: "Glasses" })[t];

  // ── Filtered lists ──
  const q = search.toLowerCase();
  const filteredCrystals = cat.crystals.filter((c) => c.name.toLowerCase().includes(q));
  const filteredSpacers = cat.spacers.filter((s) => s.name.toLowerCase().includes(q));
  const filteredCharms = cat.charms.filter((c) =>
    c.animal.toLowerCase().includes(q) || c.design.includes(q)
  );
  const filteredGlasses = cat.frames?.filter((f) =>
    f.name.toLowerCase().includes(q)
  ) || [];

  // ── Delete with confirmation ──
  const requestDelete = (id: string) => setConfirmDelete(id);
  const cancelDelete = () => setConfirmDelete(null);
  const confirmDeleteFn = (id: string) => {
    if (tab === "crystals") cat.deleteCrystal(id);
    else if (tab === "spacers") cat.deleteSpacer(id);
    else if (tab === "glasses") cat.deleteFrame(id);
    else cat.deleteCharm(id);
    setConfirmDelete(null);
  };

  const closeModal = () => setModal(null);

  return (
    <div className="relative flex-1 w-full h-full flex flex-col animate-fade-in overflow-hidden">
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
          {(["glasses", "crystals", "spacers", "charms"] as AdminTab[]).map((t) => (
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
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body"
              />
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (tab === "crystals") setModal({ type: "add-crystal" });
                else if (tab === "spacers") setModal({ type: "add-spacer" });
                else if (tab === "glasses") setModal({ type: "add-glasses" });
                else setModal({ type: "add-charm" });
                setSearch("");
              }}
              className="gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add {tabLabel(tab).slice(0, tab === "glasses" ? tabLabel(tab).length : -1)}
            </Button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
            {/* Glasses table */}
            {tab === "glasses" && (
              <div className="space-y-1">
                {filteredGlasses.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No glasses found.</p>
                )}
                {filteredGlasses.map((f) => (
                  <div key={f.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${
                    modal?.type === "edit-glasses" && modal.entry.id === f.id
                      ? "bg-primary/15 ring-2 ring-primary border-transparent"
                      : "hover:bg-muted/80 focus-within:bg-muted/80"
                  }`}>
                    {/* Frame image */}
                    {f.image ? (
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-12 h-12 object-contain bg-muted/50 rounded pointer-events-none drop-shadow-sm"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted/50 rounded flex items-center justify-center text-xl shadow-sm">
                        {f.icon || "👓"}
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm truncate">{f.name}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                          {f.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{f.dimensions}</span>
                        <span>•</span>
                        <span>{Object.keys(f.shades || {}).length} shade profiles</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      {confirmDelete === f.id ? (
                        <div className="flex items-center gap-1 pr-2">
                          <span className="text-xs text-destructive font-medium mr-2 animate-in fade-in slide-in-from-right-2">Delete style?</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:bg-muted" onClick={cancelDelete}>
                            <X className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => confirmDeleteFn(f.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setModal({ type: "edit-glasses", entry: f })}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => requestDelete(f.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Crystals table */}
            {tab === "crystals" && (
              <div className="space-y-1">
                {filteredCrystals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No crystals found.</p>
                )}
                {filteredCrystals.map((c) => (
                  <div key={c.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${
                    modal?.type === "edit-crystal" && modal.entry.id === c.id
                      ? "bg-primary/15 ring-2 ring-primary border-transparent"
                      : "hover:bg-muted/80 focus-within:bg-muted/80"
                  }`}>
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
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
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
                  <div key={s.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${
                    modal?.type === "edit-spacer" && modal.entry.id === s.id
                      ? "bg-primary/15 ring-2 ring-primary border-transparent"
                      : "hover:bg-muted/80 focus-within:bg-muted/80"
                  }`}>
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover border border-border/50 shadow-sm flex-shrink-0"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = "none";
                          el.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 rounded-full border border-border/50 shadow-sm flex-shrink-0 ${s.image ? "hidden" : ""}`}
                      style={{ background: s.metallic }}
                    />
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
                  <div key={c.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${
                    modal?.type === "edit-charm" && modal.entry.id === c.id
                      ? "bg-primary/15 ring-2 ring-primary border-transparent"
                      : "hover:bg-muted/80 focus-within:bg-muted/80"
                  }`}>
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
                    <div className={`w-8 h-8 flex items-center justify-center text-xl ${c.image ? "hidden" : ""}`}>
                      {c.emoji}
                    </div>
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
            <span>{cat.frames?.length || 0} glasses</span>
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

      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200" onClick={closeModal}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-lg border border-border shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold font-display">
                {modal.type.startsWith("add") ? "New" : "Edit"}{" "}
                {modal.type.includes("crystal") ? "Crystal" : modal.type.includes("spacer") ? "Spacer" : modal.type.includes("charm") ? "Charm" : "Glasses"}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {modal.type === "add-glasses" && (
              <FrameForm key="add-glasses" onSave={(e) => { cat.addFrame(e); closeModal(); }} onCancel={closeModal} />
            )}
            {modal.type === "edit-glasses" && (
              <FrameForm key={`edit-glasses-${modal.entry.id}`} initial={modal.entry} onSave={(e) => { cat.updateFrame(e); closeModal(); }} onCancel={closeModal} />
            )}
            {modal.type === "add-crystal" && (
              <CrystalForm key="add-crystal" onSave={(e) => { cat.addCrystal(e); closeModal(); }} onCancel={closeModal} />
            )}
            {modal.type === "edit-crystal" && (
              <CrystalForm key={`edit-crystal-${modal.entry.id}`} initial={modal.entry} onSave={(e) => { cat.updateCrystal(e); closeModal(); }} onCancel={closeModal} />
            )}
            {modal.type === "add-spacer" && (
              <SpacerForm key="add-spacer" onSave={(e) => { cat.addSpacer(e); closeModal(); }} onCancel={closeModal} />
            )}
            {modal.type === "edit-spacer" && (
              <SpacerForm key={`edit-spacer-${modal.entry.id}`} initial={modal.entry} onSave={(e) => { cat.updateSpacer(e); closeModal(); }} onCancel={closeModal} />
            )}
            {modal.type === "add-charm" && (
              <CharmForm key="add-charm" onSave={(e) => { cat.addCharm(e); closeModal(); }} onCancel={closeModal} />
            )}
            {modal.type === "edit-charm" && (
              <CharmForm key={`edit-charm-${modal.entry.id}`} initial={modal.entry} onSave={(e) => { cat.updateCharm(e); closeModal(); }} onCancel={closeModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogueAdmin;
