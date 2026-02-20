"use client";
export const dynamic = "force-dynamic";

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        padding: 40,
                        fontFamily: "system-ui, sans-serif",
                        textAlign: "center",
                        background: "#f8f9fb",
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: 16 }}>⚠️</div>
                    <h2 style={{ color: "#003f87", marginBottom: 12 }}>Something went wrong</h2>
                    <p style={{ color: "#677089", marginBottom: 32, maxWidth: 480 }}>
                        An error occurred while loading this page. Your responses have been saved and
                        will be restored when you return.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            background: "#003f87",
                            color: "#fff",
                            border: "none",
                            padding: "12px 28px",
                            borderRadius: 8,
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
