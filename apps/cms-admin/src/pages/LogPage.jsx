import { useState, useEffect, useMemo, Fragment } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import { github } from "../config.js";

const CHANGELOG_PATH = "cms-admin/changelog.json";
const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50, 100];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function changesSummary(changes = []) {
  if (!changes.length) return "—";
  const fields = [...new Set(changes.map((c) => c.field))];
  return fields.join(", ");
}

export default function LogPage() {
  const { token } = useAdmin();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIdx, setExpandedIdx] = useState(null);

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

  function handleSearch(val) {
    setSearch(val);
    setCurrentPage(1);
  }

  function handlePageSize(val) {
    setPageSize(Number(val));
    setCurrentPage(1);
  }

  function exportCSV() {
    const headers = ["Date / Time", "User", "Page", "Section", "Field", "Action", "Label", "Before", "After"];
    const rows = filtered.flatMap((e) =>
        (e.changes ?? []).map((c) => [
        formatDate(e.timestamp),
        e.userEmail ?? "",
        e.page ?? "",
        e.section ?? "",
        c.field ?? "",
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

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Activity Log</h2>
        <button className="admin-btn admin-btn--ghost" onClick={exportCSV} disabled={!filtered.length}>
            Export CSV
        </button>
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
          <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--admin-bg)", borderBottom: "2px solid var(--admin-border)" }}>
                  {["Date / Time", "User", "Page", "Section", "Fields Changed", ""].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((entry, i) => {
                  const idx = (safePage - 1) * pageSize + i;
                  const expanded = expandedIdx === idx;
                  return (
                    <Fragment key={idx}>
                      <tr
                        style={{ borderBottom: "1px solid var(--admin-border)", cursor: "pointer", background: expanded ? "#f0f2f8" : "white" }}
                        onClick={() => setExpandedIdx(expanded ? null : idx)}
                      >
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>{formatDate(entry.timestamp)}</td>
                        <td style={{ padding: "12px 16px" }}>{entry.userEmail ?? "—"}</td>
                        <td style={{ padding: "12px 16px" }}>{entry.page ?? "—"}</td>
                        <td style={{ padding: "12px 16px" }}>{entry.section ?? "—"}</td>
                        <td style={{ padding: "12px 16px", color: "var(--admin-muted)" }}>{changesSummary(entry.changes)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--admin-blue)" }}>
                          {expanded ? "▲ Hide" : "▼ Details"}
                        </td>
                      </tr>
                      {expanded && (
                        <tr style={{ background: "#f0f2f8" }}>
                          <td colSpan={6} style={{ padding: "0 16px 16px 32px" }}>
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
                                      {c.field}{c.label ? ` › ${c.label}` : ""}
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
