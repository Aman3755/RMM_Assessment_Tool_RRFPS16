"use client";

export default function DashboardPage() {
  const streamlitUrl =
    process.env.NEXT_PUBLIC_STREAMLIT_URL ||
    "https://rmm-dashboard.onrender.com";

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={streamlitUrl}
        title="RMM Analytics Dashboard"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allow="fullscreen"
      />
    </div>
  );
}
