import { useState, useEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext.jsx";
import { loadPageContent, savePageContent } from "../../utils/savePageContent.js";
import { HOME_SECTION_EDITORS, SECTION_LABELS, ALL_SECTION_KEYS } from "../../sections/home/registry.js";

const CONTENT_PATH = "pages/home.json";

export default function HomePageEditor() {
  const { token, toast, setDirty, userEmail } = useAdmin();
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(ALL_SECTION_KEYS[0]);
  const loadedTokenRef = useRef(null);

  useEffect(() => {
    if (!token || loadedTokenRef.current === token) return;
    loadedTokenRef.current = token;
    setLoading(true);
    loadPageContent(CONTENT_PATH, token)
      .then((data) => {
        setOriginal(data);
        setForm(data);
      })
      .catch((err) => toast(err.message, "err"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!original || !form) return;
    setDirty(JSON.stringify(original) !== JSON.stringify(form));
  }, [form, original]);

  if (!token) return <p style={{ color: "var(--admin-muted)" }}>Enter a GitHub token in Setup first.</p>;
  if (loading) return <p style={{ color: "var(--admin-muted)" }}>Loading…</p>;
  if (!form) return null;

  function updateSection(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleSection(key) {
    setForm((f) => {
      const active = f.sections ?? [];
      const next = active.includes(key) ? active.filter((k) => k !== key) : [...active, key];
      return { ...f, sections: next };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await savePageContent({
        token,
        contentPath: CONTENT_PATH,
        before: original,
        after: form,
        page: "Home",
        userEmail,
      });
      setOriginal(form);
      setDirty(false);
      toast("Home page saved — live in a few seconds", "ok");
    } catch (err) {
      toast(err.message, "err");
    } finally {
      setSaving(false);
    }
  }

  const activeSections = form.sections ?? [];
  const ActiveEditor = HOME_SECTION_EDITORS[activeTab];

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--admin-bg)",
          marginLeft: -40,
          marginRight: -40,
          padding: "16px 40px 10px",
          marginBottom: 14,
          boxShadow: "0 4px 8px -2px rgba(0,0,0,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Home</h2>
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 2, borderBottom: "2px solid var(--admin-border)" }}>
          {ALL_SECTION_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "8px 16px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: 13.5,
                fontWeight: activeTab === key ? 700 : 400,
                color: activeTab === key ? "var(--admin-blue)" : "var(--admin-muted)",
                borderBottom: activeTab === key ? "2px solid var(--admin-blue)" : "2px solid transparent",
                marginBottom: -2,
                transition: "color 0.15s",
                fontFamily: "inherit",
              }}
            >
              {SECTION_LABELS[key]}
              {!activeSections.includes(key) && (
                <span style={{ marginLeft: 5, fontSize: 9, opacity: 0.5 }}>●</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active section editor */}
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--admin-border)" }}>
          <h3 style={{ margin: 0 }}>{SECTION_LABELS[activeTab]}</h3>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={activeSections.includes(activeTab)}
              onChange={() => toggleSection(activeTab)}
            />
            Visible on page
          </label>
        </div>
        {ActiveEditor && (
          <ActiveEditor data={form[activeTab]} onChange={(val) => updateSection(activeTab, val)} />
        )}
      </div>
    </div>
  );
}
