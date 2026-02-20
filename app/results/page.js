"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QUESTIONS, SECTIONS, TOOL_CONFIG } from "@/data/questions";
import { generateActionPlan, computeScores, getReadinessLevel } from "@/lib/scoring";

const STORAGE_KEY = "rmm_assessment_responses";
const INFO_KEY = "rmm_respondent_info";

export default function ResultsPage() {
    const router = useRouter();
    const [responses, setResponses] = useState(null);
    const [respondentInfo, setRespondentInfo] = useState({});
    const [showResponses, setShowResponses] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const savedInfo = localStorage.getItem(INFO_KEY);
            if (saved) setResponses(JSON.parse(saved));
            if (savedInfo) setRespondentInfo(JSON.parse(savedInfo));
        } catch { }
    }, []);

    if (!mounted) return null;

    // Redirect if no responses
    if (responses !== null && Object.keys(responses).length === 0) {
        return (
            <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>⚠️</div>
                <h2>No responses found</h2>
                <p style={{ margin: "12px 0 28px" }}>
                    Please complete the assessment first.
                </p>
                <Link href="/assessment" className="btn btn-primary">
                    Go to Assessment
                </Link>
            </div>
        );
    }

    const actionPlan = responses ? generateActionPlan(responses) : [];
    const scores = responses ? computeScores(responses) : [];

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const { downloadPDF } = await import("@/lib/pdfExport");
            await downloadPDF(responses, respondentInfo);
        } catch (e) {
            console.error("PDF error:", e);
            alert("Could not generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const handleRetake = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(INFO_KEY);
        } catch { }
        router.push("/assessment");
    };

    const highPriority = actionPlan.filter((i) => i.priority === "High");
    const mediumPriority = actionPlan.filter((i) => i.priority === "Medium");
    const lowPriority = actionPlan.filter((i) => i.priority === "Low");

    return (
        <>
            {/* Results header */}
            <section className="results-header">
                <div className="container">
                    <div style={{ marginBottom: 8, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>
                        <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Home</Link>
                        {" → "} Results
                    </div>
                    <h1>Your Assessment Results</h1>
                    <p>
                        {respondentInfo.name && <strong>{respondentInfo.name}</strong>}
                        {respondentInfo.name && respondentInfo.organization && " · "}
                        {respondentInfo.organization}
                    </p>
                    <p style={{ marginTop: 6 }}>
                        {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
                    </p>
                </div>
            </section>

            <div className="red-rule" />

            <div className="results-main">
                <div className="container">

                    {/* ── Readiness Scores ── */}
                    <h2 style={{ marginBottom: 6 }}>Readiness Scores</h2>
                    <p style={{ marginBottom: 0, fontSize: "0.9rem" }}>
                        Based on your responses, here's how your agency rates across each dimension.
                    </p>

                    <div className="score-grid">
                        {scores.map((s) => {
                            const level = getReadinessLevel(s.score);
                            return (
                                <div className="score-card" key={s.id}>
                                    <div
                                        className="score-value"
                                        style={{ color: s.score !== null ? level.color : "#aaa" }}
                                    >
                                        {s.score !== null ? `${s.score}%` : "—"}
                                    </div>
                                    <div className="score-label">{s.label}</div>
                                    {s.score !== null && (
                                        <>
                                            <div className="score-track">
                                                <div
                                                    className="score-fill"
                                                    style={{
                                                        width: `${s.score}%`,
                                                        background: level.color,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className="score-level"
                                                style={{ background: level.color, marginTop: 8 }}
                                            >
                                                {level.label}
                                            </span>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Action Plan ── */}
                    <div className="action-plan-section">
                        <h2 className="section-heading">
                            Your Personalized <span>Action Plan</span>
                        </h2>
                        <p style={{ marginBottom: 24, fontSize: "0.92rem" }}>
                            {actionPlan.length} recommendation{actionPlan.length !== 1 ? "s" : ""} generated
                            based on your responses, ordered by priority.
                        </p>
                        <ActionGroup items={highPriority} label="🔴 High Priority" />
                        <ActionGroup items={mediumPriority} label="🟠 Medium Priority" />
                        <ActionGroup items={lowPriority} label="🟢 Continuing Improvement" />
                    </div>

                    {/* ── Download toolbar ── */}
                    <div className="download-toolbar">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                        >
                            {downloading ? "⏳ Generating PDF…" : "📄 Download PDF Report"}
                        </button>
                        <button className="btn btn-ghost" onClick={handleRetake}>
                            🔄 Retake Assessment
                        </button>
                        <button className="btn btn-secondary" onClick={() => window.print()}>
                            🖨 Print
                        </button>
                    </div>

                    {/* ── Response Summary (collapsible) ── */}
                    <div className="responses-summary" style={{ marginTop: 48 }}>
                        <button
                            className={`collapsible-trigger${showResponses ? " open" : ""}`}
                            onClick={() => setShowResponses((v) => !v)}
                        >
                            <span>View All Your Responses</span>
                            <span className="chevron">▼</span>
                        </button>

                        {showResponses && responses && (
                            <div className="collapsible-body">
                                <table className="response-table">
                                    <thead>
                                        <tr>
                                            <th>Question</th>
                                            <th>Your Response</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SECTIONS.map((section) => {
                                            const sectionQs = QUESTIONS.filter((q) => q.section === section.id);
                                            return [
                                                <tr className="response-section-header" key={`hdr-${section.id}`}>
                                                    <td colSpan={2}>{section.label}</td>
                                                </tr>,
                                                ...sectionQs.map((q) => {
                                                    const raw = responses[q.id];
                                                    let display = "—";
                                                    if (raw !== undefined && raw !== null && raw !== "") {
                                                        if (Array.isArray(raw)) {
                                                            display = raw.length > 0 ? raw.join(", ") : "—";
                                                        } else if (q.type === "radio" && q.options) {
                                                            const opt = q.options.find((o) => o.value === String(raw));
                                                            display = opt ? opt.label : String(raw);
                                                        } else {
                                                            display = String(raw);
                                                        }
                                                    }
                                                    return (
                                                        <tr key={q.id}>
                                                            <td>{q.text}</td>
                                                            <td>{display}</td>
                                                        </tr>
                                                    );
                                                }),
                                            ];
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Back to start */}
                    <div style={{ marginTop: 48, textAlign: "center" }}>
                        <Link href="/" style={{ color: "var(--gray-500)", fontSize: "0.85rem", textDecoration: "underline" }}>
                            ← Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ── Action Item Group ───────────────────────────────────────────────── */
function ActionGroup({ items, label }) {
    if (items.length === 0) return null;
    return (
        <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 14, color: "var(--gray-700)", fontWeight: 700, fontSize: "1rem" }}>
                {label}
            </h3>
            <div className="action-items">
                {items.map((item, i) => (
                    <div key={i} className={`action-item priority-${item.priority}`}>
                        <div className="action-item-header">
                            <span className={`priority-badge ${item.priority}`}>{item.priority}</span>
                            <h3>{item.title}</h3>
                        </div>
                        <div className="action-category">📂 {item.category}</div>
                        <p className="action-description">{item.description}</p>
                        <div className="action-steps">
                            {item.steps.map((step, si) => (
                                <div key={si} className="action-step">
                                    <span className="step-num">{si + 1}</span>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
