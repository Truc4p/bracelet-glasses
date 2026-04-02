import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, RotateCcw, Search, X, ArrowLeft } from "lucide-react";
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
  | null;

const CatalogueAdmin = () => {
  const cat = useCatalogue();
  const [tab, setTab] = useState<AdminTab>("glasses");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [isEditingFrame, setIsEditingFrame] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleFrameExpansion = (id: string, e?: React.MouseEvent) => {
    if (e) {
      if ((e.target as HTMLElement).closest('button')) return;
    }
    setSelectedFrameId(id);
    setIsEditingFrame(false);
  };

  // Scroll to top when opening an edit/add modal or page
  useEffect(() => {
    if ((modal || selectedFrameId) && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [modal, selectedFrameId, isEditingFrame]);

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
              onClick={() => { setTab(t); setSearch(""); setModal(null); setSelectedFrameId(null); setIsEditingFrame(false); }}
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
            {tab === "glasses" && selectedFrameId ? (
              (() => {
                if (selectedFrameId === "new") {
                  return (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedFrameId(null); setIsEditingFrame(false); }}>
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <div className="flex items-center gap-4">
                        <div>
                          <h2 className="text-xl font-bold font-display">New Frame</h2>
                          <p className="text-sm text-muted-foreground">Add a new glasses style</p>
                        </div>
                      </div>
                    </>
                  );
                }

                const frame = cat.frames?.find((f) => f.id === selectedFrameId);
                if (!frame) return <div className="flex-1 max-w-xs h-8" />;
                return (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => {
                        if (isEditingFrame) setIsEditingFrame(false);
                        else setSelectedFrameId(null);
                      }}>
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                      {frame.frameImages && frame.frameImages.length > 0 ? (
                        <img src={frame.frameImages[0]} alt={frame.name} className="w-16 h-16 object-contain bg-muted/50 rounded drop-shadow" crossOrigin="anonymous" />
                      ) : (
                        <div className="w-16 h-16 bg-muted/50 rounded flex items-center justify-center text-2xl shadow-sm">👓</div>
                      )}
                      <div>
                        <h2 className="text-xl font-bold font-display">{frame.name}</h2>
                        <p className="text-sm text-muted-foreground">${frame.price} • {frame.id}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {frame.lensColors?.length || 0} colors
                        </p>
                      </div>
                    </div>
                    {!isEditingFrame && (
                      <div className="ml-auto flex items-center gap-2">
                        {confirmDelete === frame.id ? (
                          <>
                            <span className="text-xs text-destructive font-medium mr-2 animate-in fade-in">Delete?</span>
                            <Button variant="ghost" size="sm" onClick={cancelDelete}>Cancel</Button>
                            <Button variant="destructive" size="sm" onClick={() => { confirmDeleteFn(frame.id); setSelectedFrameId(null); }}>Confirm</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => setIsEditingFrame(true)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => requestDelete(frame.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                );
              })()
            ) : modal ? (
              <>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold font-display">
                      {modal.type.startsWith("add") ? "New" : "Edit"}{" "}
                      {modal.type.includes("crystal") ? "Crystal" : modal.type.includes("spacer") ? "Spacer" : "Charm"}
                    </h2>
                  </div>
                </div>
                {modal.type.startsWith("edit") && (
                  <div className="ml-auto flex items-center gap-2">
                    {confirmDelete === ("entry" in modal ? modal.entry.id : null) ? (
                      <>
                        <span className="text-xs text-destructive font-medium mr-2 animate-in fade-in">Delete?</span>
                        <Button variant="ghost" size="sm" onClick={cancelDelete}>Cancel</Button>
                        <Button variant="destructive" size="sm" onClick={() => { 
                          confirmDeleteFn("entry" in modal ? modal.entry.id : ""); 
                          closeModal(); 
                        }}>Confirm</Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => requestDelete("entry" in modal ? modal.entry.id : "")}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
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
            )}
            {!(tab === "glasses" && selectedFrameId) && !modal && (
              <Button
                size="sm"
                onClick={() => {
                  if (tab === "crystals") setModal({ type: "add-crystal" });
                  else if (tab === "spacers") setModal({ type: "add-spacer" });
                  else if (tab === "glasses") { setSelectedFrameId("new"); setIsEditingFrame(true); }
                  else setModal({ type: "add-charm" });
                  setSearch("");
                }}
                className="gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add {tabLabel(tab).slice(0, tab === "glasses" ? tabLabel(tab).length : -1)}
              </Button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
            {/* Glasses table */}
            {tab === "glasses" && selectedFrameId ? (
              // Detail/Edit Page
              <div className="animate-in slide-in-from-right-2 fade-in max-w-4xl mx-auto pt-2 pb-8 w-full">
                {selectedFrameId === "new" ? (
                  <FrameForm
                    onSave={(e) => { cat.addFrame(e); setSelectedFrameId(null); setIsEditingFrame(false); }}
                    onCancel={() => { setSelectedFrameId(null); setIsEditingFrame(false); }}
                  />
                ) : isEditingFrame ? (
                  (() => {
                    const frame = cat.frames?.find((f) => f.id === selectedFrameId);
                    if (!frame) return <p>Frame not found</p>;
                    return (
                      <FrameForm
                        key={`edit-glasses-${frame.id}`}
                        initial={frame}
                        onSave={(e) => { cat.updateFrame(e); setIsEditingFrame(false); }}
                        onCancel={() => setIsEditingFrame(false)}
                      />
                    );
                  })()
                ) : (
                  (() => {
                    const frame = cat.frames?.find((f) => f.id === selectedFrameId);
                    if (!frame) return <p>Frame not found</p>;
                    return (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Images ({frame.frameImages?.length || 0})</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {(frame.frameImages || []).map((img, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3 p-3 rounded-lg bg-background border border-border text-center shadow-sm">
                              {img ? (
                                <img src={img} alt={`Frame image ${idx + 1}`} className="w-full h-24 object-contain rounded drop-shadow-sm" crossOrigin="anonymous" />
                              ) : (
                                <div className="w-full h-24 rounded bg-muted flex flex-col items-center justify-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                  <span>No</span>
                                  <span>Image</span>
                                </div>
                              )}
                              <span className="text-sm font-medium w-full truncate px-1" title={img}>
                                {img.split('/').pop() || `Image ${idx + 1}`}
                              </span>
                            </div>
                          ))}
                          {(frame.frameImages?.length || 0) === 0 && (
                            <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                              No images configured. Click Edit to add some.
                            </div>
                          )}
                        </div>

                        <div className="mt-8 border-t border-border pt-6">
                          <h3 className="text-lg font-semibold mb-4">Colors ({frame.lensColors?.length || 0})</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {(frame.lensColors || []).map((lc, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-3 p-3 rounded-lg bg-background border border-border text-center shadow-sm">
                                {lc.image ? (
                                  <img src={lc.image} alt={lc.colorName} className="w-full h-24 object-contain rounded drop-shadow-sm" crossOrigin="anonymous" />
                                ) : (
                                  <div className="w-full h-24 rounded bg-muted flex flex-col items-center justify-center text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                    <span>No</span>
                                    <span>Image</span>
                                  </div>
                                )}
                                <span className="text-sm font-medium w-full truncate px-1" title={lc.colorName}>
                                  {lc.colorName || `Color ${idx + 1}`}
                                </span>
                              </div>
                            ))}
                            {(frame.lensColors?.length || 0) === 0 && (
                              <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                                No lens colors configured. Click Edit to add some.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            ) : tab === "glasses" && !selectedFrameId && (
              <div className="space-y-1">
                {filteredGlasses.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No glasses found.</p>
                )}
                {filteredGlasses.map((f) => {
                  return (
                  <div key={f.id} className="flex flex-col gap-1">
                    <div 
                      onClick={(e) => toggleFrameExpansion(f.id, e)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group cursor-pointer ${
                      selectedFrameId === f.id
                        ? "bg-primary/15 ring-2 ring-primary border-transparent"
                        : "hover:bg-muted/80 focus-within:bg-muted/80"
                    }`}>
                      {/* Frame image */}
                      {f.frameImages && f.frameImages.length > 0 ? (
                        <img
                          src={f.frameImages[0]}
                          alt={f.name}
                          className="w-12 h-12 object-contain bg-muted/50 rounded pointer-events-none drop-shadow-sm"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted/50 rounded flex items-center justify-center text-xl shadow-sm">
                          👓
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
                      </div>

                      {/* Actions */}
                      {/* Removed Edit/Delete */}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}

            {/* Crystals table */}
            {tab === "crystals" && !modal && (
              <div className="space-y-1">
                {filteredCrystals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No crystals found.</p>
                )}
                {filteredCrystals.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => setModal({ type: "edit-crystal", entry: c })}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${
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
                      style={{ background: "hsl(var(--muted))" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">${c.price.toFixed(2)} / bead</span>
                    </div>
                    {/* Removed Edit/Delete */}
                  </div>
                ))}
              </div>
            )}

            {/* Spacers table */}
            {tab === "spacers" && !modal && (
              <div className="space-y-1">
                {filteredSpacers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No spacers found.</p>
                )}
                {filteredSpacers.map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => setModal({ type: "edit-spacer", entry: s })}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${
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
                    {/* Removed Edit/Delete */}
                  </div>
                ))}
              </div>
            )}

            {/* Charms table */}
            {tab === "charms" && !modal && (
              <div className="space-y-1">
                {filteredCharms.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No charms found.</p>
                )}
                {filteredCharms.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => setModal({ type: "edit-charm", entry: c })}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group ${
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
                    {/* Removed Edit/Delete */}
                  </div>
                ))}
              </div>
            )}

            {/* Inline Modal Forms */}
            {modal && tab !== "glasses" && (
              <div className="animate-in slide-in-from-right-2 fade-in max-w-4xl mx-auto pt-2 pb-8 w-full">
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
            )}
          </div>

          {/* Footer stats */}
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-body flex gap-4">
            <span>{cat.frames?.length || 0} glasses</span>
            <span>{cat.crystals.length} crystals</span>
            <span>{cat.spacers.length} spacers</span>
            <span>{cat.charms.length} charms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogueAdmin;
