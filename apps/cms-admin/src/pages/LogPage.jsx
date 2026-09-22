import { useState, useEffect, useMemo, Fragment } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import { github } from "../config.js";

const CHANGELOG_PATH = "cms-admin/changelog.json";
const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50, 100];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function formatKey(key) {
  if (!key) return "—";
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
}

function sectionsSummary(changes = []) {
  const sections = [...new Set(changes.map((c) => c.section).filter(Boolean))];
  return sections.length ? sections.map(formatKey).join(", ") : "—";
}

function changesSummary(changes = []) {
  if (!changes.length) return "—";
  const fields = [...new Set(changes.map((c) => c.field).filter(Boolean))];
  return fields.map(formatKey).join(", ");
}

const entryKey = (e) => (e.timestamp ?? "") + (e.userEmail ?? "");

function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = "Delete" }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "white", borderRadius: 14, padding: "36px 36px 28px",
          maxWidth: 420, width: "90%",
          boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#fef2f2", border: "1.5px solid #fca5a5",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, marginBottom: 20,
        }}>
          🗑️
        </div>

        <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "var(--admin-text)" }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 28px", color: "var(--admin-muted)", lineHeight: 1.65, fontSize: 14 }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "center" }}>
          <button
            className="admin-btn admin-btn--ghost"
            style={{ flex: 1, maxWidth: 160 }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="admin-btn"
            style={{
              flex: 1, maxWidth: 160,
              background: "var(--admin-red, #d32f2f)", color: "#fff", border: "none",
            }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LogPage() {
  const { token } = useAdmin();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm }

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    github
      .readFile(CHANGELOG_PATH, { branch: "main", token })
      .then(({ content }) => setEntries(JSON.parse(content)))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.userEmail?.toLowerCase().includes(q) ||
        e.page?.toLowerCase().includes(q) ||
        (e.section ?? "").toLowerCase().includes(q) ||
        e.timestamp?.toLowerCase().includes(q) ||
        changesSummary(e.changes).toLowerCase().includes(q)
    );
  }, [entries, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageData = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const pageKeys = pageData.map(entryKey);
  const allPageSelected = pageKeys.length > 0 && pageKeys.every((k) => selected.has(k));
  const somePageSelected = pageKeys.some((k) => selected.has(k));
  const allFilteredSelected = filtered.length > 0 && filtered.every((e) => selected.has(entryKey(e)));

  function handleSearch(val) {
    setSearch(val);
    setCurrentPage(1);
  }

  function handlePageSize(val) {
    setPageSize(Number(val));
    setCurrentPage(1);
  }

  function toggleSelect(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function togglePageSelect() {
    if (allPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        pageKeys.forEach((k) => next.delete(k));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        pageKeys.forEach((k) => next.add(k));
        return next;
      });
    }
  }

  function selectAllFiltered() {
    setSelected(new Set(filtered.map(entryKey)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function askConfirm({ title, message, onConfirm }) {
    setConfirmModal({ title, message, onConfirm });
  }

  function closeModal() {
    setConfirmModal(null);
  }

  function confirmDeleteSelected() {
    const count = selected.size;
    askConfirm({
      title: `Delete ${count} ${count === 1 ? "entry" : "entries"}?`,
      message: `You are about to permanently delete ${count} activity log ${count === 1 ? "entry" : "entries"}. This action cannot be reversed.`,
      onConfirm: async () => {
        closeModal();
        setDeleting(true);
        try {
          const { sha } = await github.readFile(CHANGELOG_PATH, { branch: "main", token });
          const remaining = entries.filter((e) => !selected.has(entryKey(e)));
          await github.writeFile(CHANGELOG_PATH, JSON.stringify(remaining, null, 2), {
            message: "CMS: delete log entries [skip ci]",
            sha,
            branch: "main",
            token,
          });
          setEntries(remaining);
          setSelected(new Set());
        } catch (err) {
          alert("Failed to delete: " + err.message);
        } finally {
          setDeleting(false);
        }
      },
    });
  }

  function confirmDeleteAll() {
    askConfirm({
      title: "Delete all log entries?",
      message: "You are about to permanently delete every entry in the activity log. This action cannot be reversed.",
      onConfirm: async () => {
        closeModal();
        setDeleting(true);
        try {
          const { sha } = await github.readFile(CHANGELOG_PATH, { branch: "main", token });
          await github.writeFile(CHANGELOG_PATH, "[]", {
            message: "CMS: clear activity log [skip ci]",
            sha,
            branch: "main",
            token,
          });
          setEntries([]);
          setSelected(new Set());
        } catch (err) {
          alert("Failed to delete: " + err.message);
        } finally {
          setDeleting(false);
        }
      },
    });
  }

  function exportCSV() {
    const headers = ["Date / Time", "User", "Page", "Section", "Field", "Action", "Label", "Before", "After"];
    const rows = filtered.flatMap((e) =>
      (e.changes ?? []).map((c) => [
        formatDate(e.timestamp),
        e.userEmail ?? "",
        e.page ?? "",
        c.section ? formatKey(c.section) : "",
        c.field ? formatKey(c.field) : "",
        c.action ?? "changed",
        c.label ?? "",
        c.before != null ? JSON.stringify(c.before) : "",
        c.after != null ? JSON.stringify(c.after) : "",
      ])
    );

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cms-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!token)
    return <p style={{ color: "var(--admin-muted)" }}>Enter a GitHub token in Setup first.</p>;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2
  );

  const COL_COUNT = 7;

  return (
    <div>
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={closeModal}
          confirmLabel="Delete"
        />
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ margin: 0 }}>Activity Log</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {selected.size > 0 && (
            <button
              className="admin-btn"
              style={{ background: "var(--admin-red, #d32f2f)", color: "#fff", border: "none" }}
              onClick={confirmDeleteSelected}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : `Delete selected (${selected.size})`}
            </button>
          )}
          <button className="admin-btn admin-btn--ghost" onClick={exportCSV} disabled={!filtered.length}>
            Export CSV
          </button>
          <button
            className="admin-btn admin-btn--ghost"
            style={{ color: "var(--admin-red, #d32f2f)", borderColor: "var(--admin-red, #d32f2f)" }}
            onClick={confirmDeleteAll}
            disabled={!entries.length || deleting}
          >
            Delete All
          </button>
        </div>
      </div>

      {/* Search + page size */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <input
          className="admin-input"
          style={{ flex: 1, minWidth: 220, maxWidth: 400 }}
          placeholder="Search by user, page, section, date…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--admin-muted)" }}>
          <span>Show</span>
          <select className="admin-input" style={{ width: "auto" }} value={pageSize} onChange={(e) => handlePageSize(e.target.value)}>
            {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>per page</span>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--admin-muted)" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", color: "var(--admin-muted)" }}>
          {search ? "No entries match your search." : "No activity logged yet."}
        </div>
      ) : (
        <>
          {somePageSelected && !allFilteredSelected && filtered.length > pageSize && (
            <div style={{ fontSize: 13, marginBottom: 8, color: "var(--admin-muted)" }}>
              {selected.size} {selected.size === 1 ? "entry" : "entries"} selected on this page.{" "}
              <button
                onClick={selectAllFiltered}
                style={{ background: "none", border: "none", color: "var(--admin-blue)", cursor: "pointer", padding: 0, fontSize: 13 }}
              >
                Select all {filtered.length} results
              </button>
            </div>
          )}
          {allFilteredSelected && filtered.length > pageSize && (
            <div style={{ fontSize: 13, marginBottom: 8, color: "var(--admin-muted)" }}>
              All {selected.size} entries selected.{" "}
              <button
                onClick={clearSelection}
                style={{ background: "none", border: "none", color: "var(--admin-blue)", cursor: "pointer", padding: 0, fontSize: 13 }}
              >
                Clear selection
              </button>
            </div>
          )}

          <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--admin-bg)", borderBottom: "2px solid var(--admin-border)" }}>
                  <th style={{ padding: "10px 16px", width: 36 }}>
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                      onChange={togglePageSelect}
                    />
                  </th>
                  {["Date / Time", "User", "Page", "Section", "Fields Changed"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                  <th style={{ width: 100, minWidth: 100 }} />
                </tr>
              </thead>
              <tbody>
                {pageData.map((entry, i) => {
                  const idx = (safePage - 1) * pageSize + i;
                  const key = entryKey(entry);
                  const expanded = expandedIdx === idx;
                  const isSelected = selected.has(key);
                  return (
                    <Fragment key={idx}>
                      <tr
                        style={{ borderBottom: "1px solid var(--admin-border)", cursor: "pointer", background: isSelected ? "#eef2ff" : expanded ? "#f0f2f8" : "white", verticalAlign: "middle" }}
                        onClick={() => setExpandedIdx(expanded ? null : idx)}
                      >
                        <td style={{ padding: "12px 16px" }} onClick={(e) => { e.stopPropagation(); toggleSelect(key); }}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(key)} onClick={(e) => e.stopPropagation()} />
                        </td>
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>{formatDate(entry.timestamp)}</td>
                        <td style={{ padding: "12px 16px" }}>{entry.userEmail ?? "—"}</td>
                        <td style={{ padding: "12px 16px" }}>{entry.page ?? "—"}</td>
                        <td style={{ padding: "12px 16px" }}>{sectionsSummary(entry.changes)}</td>
                        <td style={{ padding: "12px 16px", color: "var(--admin-muted)" }}>{changesSummary(entry.changes)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", whiteSpace: "nowrap", width: 90 }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "3px 10px", border: "1px solid var(--admin-border)", borderRadius: 6,
                            fontSize: 12, color: "var(--admin-blue)", fontWeight: 500,
                            background: expanded ? "var(--admin-bg)" : "white",
                          }}>
                            {expanded ? "▲ Hide" : "▼ Details"}
                          </span>
                        </td>
                      </tr>
                      {expanded && (
                        <tr style={{ background: "#f0f2f8" }}>
                          <td colSpan={COL_COUNT} style={{ padding: "0 16px 16px 32px" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                              <thead>
                                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                                  {["Field", "Action", "Before", "After"].map((h) => (
                                    <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "var(--admin-muted)" }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(entry.changes ?? []).map((c, ci) => (
                                  <tr key={ci} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                                    <td style={{ padding: "6px 10px", fontWeight: 600 }}>
                                      {[c.section && formatKey(c.section), c.field && formatKey(c.field), c.label].filter(Boolean).join(" › ")}
                                    </td>
                                    <td style={{ padding: "6px 10px", color: c.action === "added" ? "#178a4c" : c.action === "removed" ? "var(--admin-red)" : "var(--admin-muted)" }}>
                                      {c.action ?? "changed"}
                                    </td>
                                    <td style={{ padding: "6px 10px", color: "var(--admin-red)", maxWidth: 260, wordBreak: "break-word" }}>
                                      {c.before != null ? JSON.stringify(c.before) : "—"}
                                    </td>
                                    <td style={{ padding: "6px 10px", color: "#178a4c", maxWidth: 260, wordBreak: "break-word" }}>
                                      {c.after != null ? JSON.stringify(c.after) : "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, fontSize: 13, color: "var(--admin-muted)", flexWrap: "wrap", gap: 8 }}>
            <span>
              Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <button className="admin-btn admin-btn--ghost" style={{ padding: "6px 12px", fontSize: 13 }} disabled={safePage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                ← Prev
              </button>
              {pageNumbers.reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, []).map((p, i) =>
                p === "…" ? (
                  <span key={`gap-${i}`} style={{ padding: "6px 4px" }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    style={{ padding: "6px 12px", fontSize: 13, border: "1px solid var(--admin-border)", borderRadius: 8, cursor: "pointer", background: p === safePage ? "var(--admin-blue)" : "white", color: p === safePage ? "white" : "var(--admin-text)", fontWeight: p === safePage ? 700 : 400 }}
                  >
                    {p}
                  </button>
                )
              )}
              <button className="admin-btn admin-btn--ghost" style={{ padding: "6px 12px", fontSize: 13 }} disabled={safePage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
