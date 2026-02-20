"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { generateActionPlan, getMaturityLevel, MATURITY_LEVELS } from "@/lib/scoring";

const STORAGE_KEY = "rmm_assessment_responses";
const INFO_KEY = "rmm_respondent_info";
const ROUTING_KEY = "rmm_routing_block";

export default function ResultsPage() {
    const [results, setResults] = useState(null);
    const [respondentInfo, setRespondentInfo] = useState({});
    const [showResponses, setShowResponses] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const infoRaw = localStorage.getItem(INFO_KEY);
            const block = localStorage.getItem(ROUTING_KEY);

            if (raw && block) {
                const responses = JSON.parse(raw);
                setResults(generateActionPlan(responses, block));
            }
            if (infoRaw) setRespondentInfo(JSON.parse(infoRaw));
        } catch (e) {
            console.error("Results load error:", e);
        }
    }, []);

    const handleDownloadPDF = async () => {
        try {
            const responses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            const blockId = localStorage.getItem(ROUTING_KEY);
            const info = JSON.parse(localStorage.getItem(INFO_KEY) || "{}");
            const { exportToPDF } = await import("@/lib/pdfExport");
            exportToPDF(results, responses, info);
        } catch (e) {
            console.error("PDF export error:", e);
            alert("PDF generation failed. Please try again.");
        }
    };

    const handleReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(INFO_KEY);
        localStorage.removeItem(ROUTING_KEY);
        window.location.href = "/assessment";
    };

    if (!mounted) return null;

    if (!results) {
        return (
            <div className="assessment-main">
                <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }}>📋</div>
                    <h2>No results yet</h2>
                    <p style={{ color: "var(--gray-500)", marginBottom: 32 }}>
                        Please complete the assessment first.
                    </p>
                    <Link href="/assessment" className="btn btn-primary btn-lg">
                        Start Assessment
                    </Link>
                </div>
            </div>
        );
    }

    const { blockLabel, overallScore, maturityLevel, actionItems, totalAnswered, totalQuestions } = results;
    const highs = actionItems.filter((a) => a.priority === "High");
    const mediums = actionItems.filter((a) => a.priority === "Medium");
    const lows = actionItems.filter((a) => a.priority === "Low");

    return (
        <div className="results-main">
            <div className="container">

                {/* ── Header ────────────────────────────────────────────────────────── */}
                <div className="results-header">
                    <div className="results-header-content">
                        <h1>Assessment Complete</h1>
                        {respondentInfo.name && (
                            <p style={{ fontSize: "1rem", opacity: 0.85 }}>
                                Results for <strong>{respondentInfo.name}</strong>
                                {respondentInfo.organization && ` — ${respondentInfo.organization}`}
                            </p>
                        )}
                        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                            {blockLabel} · {totalAnswered} of {totalQuestions} questions answered
                        </p>
                    </div>
                    <div className="results-actions">
                        <button className="btn btn-secondary" onClick={handleDownloadPDF}>
                            ⬇ Download PDF
                        </button>
                        <button className="btn btn-ghost-light" onClick={() => window.print()}>
                            🖨 Print
                        </button>
                        <button className="btn btn-ghost-light" onClick={handleReset}>
                            ↺ Retake
                        </button>
                    </div>
                </div>

                {/* ── Maturity Score Card ───────────────────────────────────────────── */}
                <div className="score-section">
                    <div className="score-card-large">
                        <div className="score-value">
                            {overallScore !== null ? overallScore.toFixed(1) : "—"}
                            <span className="score-max"> / 5.0</span>
                        </div>
                        <div
                            className="score-badge"
                            style={{ background: maturityLevel?.color, display: "inline-block", padding: "4px 16px", borderRadius: 999, color: "#fff", fontWeight: 700, fontSize: "1rem", marginTop: 8 }}
                        >
                            Level {maturityLevel?.level}: {maturityLevel?.label}
                        </div>
                        <p className="score-description" style={{ marginTop: 12, fontSize: "0.9rem", color: "var(--gray-500)" }}>
                            {maturityLevel?.description}
                        </p>

                        {/* Maturity progress bar */}
                        <div className="maturity-bar-wrapper" style={{ marginTop: 24 }}>
                            <div className="maturity-bar-track">
                                <div
                                    className="maturity-bar-fill"
                                    style={{
                                        width: `${overallScore !== null ? (overallScore / 5) * 100 : 0}%`,
                                        background: maturityLevel?.color,
                                    }}
                                />
                            </div>
                            <div className="maturity-scale-labels">
                                {MATURITY_LEVELS.map((l) => (
                                    <span
                                        key={l.level}
                                        style={{
                                            color: overallScore >= l.min ? l.color : "var(--gray-300)",
                                            fontWeight: overallScore >= l.min && overallScore < (l.max + 0.01) ? 700 : 400,
                                        }}
                                    >
                                        {l.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Action Plan ───────────────────────────────────────────────────── */}
                <div className="action-plan-section">
                    <h2 className="section-heading">Recommended Action Plan</h2>
                    <p className="section-subheading">
                        {actionItems.length === 0
                            ? "No priority actions identified — your practices are performing at a high level across all dimensions."
                            : `${actionItems.length} improvement area${actionItems.length > 1 ? "s" : ""} identified. Focus on High priority items first.`}
                    </p>

                    {[
                        { label: "High Priority", items: highs, color: "#c62828", icon: "🔴" },
                        { label: "Medium Priority", items: mediums, color: "#e65100", icon: "🟡" },
                        { label: "Low Priority", items: lows, color: "#2e7d32", icon: "🟢" },
                    ].map(({ label, items, color, icon }) =>
                        items.length === 0 ? null : (
                            <div key={label} className="priority-group">
                                <h3 className="priority-group-label" style={{ color }}>
                                    {icon} {label} <span style={{ fontWeight: 400, fontSize: "0.85rem" }}>({items.length})</span>
                                </h3>
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`action-item priority-${item.priority.toLowerCase()}`}
                                    >
                                        <div className="action-item-header">
                                            <span className={`priority-badge priority-badge-${item.priority.toLowerCase()}`}>
                                                {item.priority}
                                            </span>
                                            <span className="action-score">
                                                Current score: <strong>{item.score}/5</strong>
                                            </span>
                                        </div>
                                        <h4 className="action-title">{item.title}</h4>
                                        <p className="action-desc">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* ── Response Summary (collapsible) ────────────────────────────────── */}
                <div className="responses-section">
                    <button
                        className="btn btn-outline"
                        onClick={() => setShowResponses((v) => !v)}
                    >
                        {showResponses ? "▲ Hide" : "▼ Show"} My Responses
                    </button>

                    {showResponses && (
                        <ResponsesTable blockId={results.blockId} />
                    )}
                </div>

                {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
                <div style={{ textAlign: "center", padding: "40px 0 60px" }}>
                    <button className="btn btn-primary btn-lg" onClick={handleDownloadPDF}>
                        ⬇ Download Full PDF Report
                    </button>
                </div>

            </div>
        </div>
    );
}

/* ── Response summary table ───────────────────────────────────────────────── */
const LEVEL_LABELS = { "1": "Level 1 – Initial", "2": "Level 2 – Developing", "3": "Level 3 – Defined", "4": "Level 4 – Managed", "5": "Level 5 – Optimizing", na: "N/A" };

function ResponsesTable({ blockId }) {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});

    useEffect(() => {
        import("@/data/questions").then(({ QUESTIONS_BY_BLOCK }) => {
            setQuestions(QUESTIONS_BY_BLOCK[blockId] ?? []);
        });
        try {
            setResponses(JSON.parse(localStorage.getItem("rmm_assessment_responses") || "{}"));
        } catch { }
    }, [blockId]);

    if (!questions.length) return null;

    return (
        <div className="responses-table-wrapper" style={{ marginTop: 20 }}>
            <table className="responses-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Your Response</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((q, i) => (
                        <tr key={q.id}>
                            <td style={{ textAlign: "center", color: "var(--gray-400)", width: 40 }}>{i + 1}</td>
                            <td style={{ fontSize: "0.85rem" }}>{q.text}</td>
                            <td style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                                {LEVEL_LABELS[responses[q.id]] ?? <em style={{ color: "var(--gray-400)" }}>—</em>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
