"use client";

import { useMemo, useState } from "react";

export default function DashboardPage() {
  const streamlitUrl =
    process.env.NEXT_PUBLIC_STREAMLIT_URL ||
    "https://rmm-dashboard-idejpyk5faxllb59nihwwt.streamlit.app/";

  const iframeSrc = useMemo(() => {
    // Streamlit sometimes uses query params, keep it simple
    return url.trim();
  }, [url]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 700 }}>Analytics Dashboard (Streamlit)</div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>URL</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: 320,
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.15)",
              outline: "none",
            }}
          />
          <a
            href={iframeSrc}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.15)",
              textDecoration: "none",
            }}
          >
            Open ↗
          </a>
        </div>
      </div>

      <iframe
        src={iframeSrc}
        title="Streamlit Dashboard"
        style={{ flex: 1, border: "none", width: "100%" }}
      />
    </div>
  );
}
