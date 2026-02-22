"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const streamlitUrl =
    process.env.NEXT_PUBLIC_STREAMLIT_URL ||
    "https://rmm-dashboard.onrender.com"; // replace with your actual render URL if different

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Navigation Bar */}
      <div
        style={{
          padding: "12px 20px",
          background: "#0d47a1",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontWeight: 600 }}>
          RMM Analytics Dashboard
        </div>

        <button
          onClick={() => router.push("/")}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "none",
            background: "white",
            color: "#0d47a1",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back to Assessment
        </button>
      </div>

      {/* Streamlit iframe */}
      <iframe
        src={streamlitUrl}
        title="RMM Analytics Dashboard"
        style={{
          flex: 1,
          width: "100%",
          border: "none",
        }}
      />
    </div>
  );
}
