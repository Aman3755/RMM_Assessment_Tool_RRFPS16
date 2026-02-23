"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { generateActionPlan, MATURITY_LEVELS } from "@/lib/scoring";
import { QUESTIONS_BY_BLOCK } from "@/data/questions";

const STORAGE_KEY = "rmm_assessment_responses";
const INFO_KEY = "rmm_respondent_info";
const ROUTING_KEY = "rmm_routing_block";

const LEVEL_LABEL = {
    "1": "Level 1 – Initial",
    "2": "Level 2 – Developing",
    "3": "Level 3 – Defined",
    "4": "Level 4 – Managed",
    "5": "Level 5 – Optimizing",
    "na": "N/A",
};

export default function ResultsPage() {
    const [results, setResults] = useState(null);
    const [respondentInfo, setRespondentInfo] = useState({});
    const [responses, setResponses] = useState({});
    const [showResponses, setShowResponses] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const infoRaw = localStorage.getItem(INFO_KEY);
            const blockId = localStorage.getItem(ROUTING_KEY);
            const parsed = raw ? JSON.parse(raw) : {};

            setResponses(parsed);
            if (infoRaw) setRespondentInfo(JSON.parse(infoRaw));
            if (raw && blockId) setResults(generateActionPlan(parsed, blockId));
        } catch (e) {
            console.error("Results load error:", e);
        }
    }, []);

    const handleDownloadPDF = async () => {
        try {
            const blockId = localStorage.getItem(ROUTING_KEY);
            const info = JSON.parse(localStorage.getItem(INFO_KEY) || "{}");
            const { exportToPDF } = await import("@/lib/pdfExport");
            await exportToPDF(results, responses, info);
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

    const {
        blockLabel,
        overallScore,
        maturityLevel,
        actionItems,
        totalAnswered,
        totalQuestions,
        blockId,
    } = results;

    const highs = actionItems.filter((a) => a.priority === "High");
    const mediums = actionItems.filter((a) => a.priority === "Medium");
    const lows = actionItems.filter((a) => a.priority === "Low");

    const questions = QUESTIONS_BY_BLOCK[blockId] ?? [];

    return (
        <div className="results-main">
            <div className="container">

                {/* ── Header ─────────────────────────────────────────────────────── */}
                <div className="results-header-card">
                    <div>
                        <h1 style={{ color: "var(--blue)", marginBottom: 6 }}>Assessment Complete</h1>
                        {respondentInfo.name && (
                            <p style={{ fontWeight: 600, color: "var(--gray-700)" }}>
                                {respondentInfo.name}
                                {respondentInfo.organization && ` — ${respondentInfo.organization}`}
                            </p>
                        )}
                        <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginTop: 4 }}>
                            {blockLabel} · {totalAnswered} of {totalQuestions} questions answered
                        </p>
                    </div>
                    <div className="results-actions">
                        <button className="btn btn-secondary" onClick={handleDownloadPDF}>
                            ⬇ Download PDF
                        </button>
                        <Link href="/dashboard" className="btn btn-ghost" style={{ marginLeft: 12 }}>
                            View Analytics Dashboard →
                        </Link>
                        <button className="btn btn-ghost" onClick={() => window.print()}>
                            🖨 Print
                        </button>
                        <button className="btn btn-ghost" onClick={handleReset}>
                            ↺ Retake
                        </button>
                    </div>
                </div>

                {/* ── Maturity Score ────────────────────────────────────────────── */}
                <div className="score-section">
                    <div className="score-card-large">
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                            <span style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1, color: maturityLevel?.color || "var(--blue)" }}>
                                {overallScore !== null ? overallScore.toFixed(1) : "—"}
                            </span>
                            <span style={{ fontSize: "1.1rem", color: "var(--gray-400)", marginBottom: 8 }}>/ 5.0</span>
                        </div>

                        <div
                            style={{
                                display: "inline-block",
                                padding: "4px 16px",
                                borderRadius: 999,
                                background: maturityLevel?.color || "var(--blue)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                marginTop: 8,
                                marginBottom: 12,
                            }}
                        >
                            Level {maturityLevel?.level}: {maturityLevel?.label}
                        </div>

                        <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginBottom: 20 }}>
                            {maturityLevel?.description}
                        </p>

                        {/* Progress bar */}
                        <div style={{ background: "var(--gray-200)", borderRadius: 999, height: 12, overflow: "hidden" }}>
                            <div
                                style={{
                                    width: `${overallScore !== null ? (overallScore / 5) * 100 : 0}%`,
                                    height: "100%",
                                    background: maturityLevel?.color || "var(--blue)",
                                    borderRadius: 999,
                                    transition: "width 1s ease",
                                }}
                            />
                        </div>

                        {/* Scale labels */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 6,
                                fontSize: "0.75rem",
                                color: "var(--gray-400)",
                            }}
                        >
                            {MATURITY_LEVELS.map((l) => (
                                <span
                                    key={l.level}
                                    style={{ color: overallScore >= l.min ? l.color : "var(--gray-300)", fontWeight: overallScore >= l.min && overallScore <= l.max ? 700 : 400 }}
                                >
                                    {l.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Action Plan ───────────────────────────────────────────────── */}
                <div className="action-plan-section">
                    <h2 className="section-heading">Recommended Action Plan</h2>
                    <p style={{ color: "var(--gray-500)", marginBottom: 28, marginTop: -12 }}>
                        {actionItems.length === 0
                            ? "No priority actions identified — your practices are strong across all dimensions."
                            : `${actionItems.length} improvement area${actionItems.length !== 1 ? "s" : ""} identified. Focus on High priority items first.`}
                    </p>

                    {[
                        { label: "High Priority", items: highs, color: "#c62828", icon: "🔴" },
                        { label: "Medium Priority", items: mediums, color: "#e65100", icon: "🟡" },
                        { label: "Low Priority", items: lows, color: "#2e7d32", icon: "🟢" },
                    ].map(({ label, items, color, icon }) =>
                        items.length === 0 ? null : (
                            <div key={label} style={{ marginBottom: 32 }}>
                                <h3 style={{ color, marginBottom: 12, fontWeight: 700 }}>
                                    {icon} {label}{" "}
                                    <span style={{ fontWeight: 400, fontSize: "0.85rem", color: "var(--gray-500)" }}>
                                        ({items.length})
                                    </span>
                                </h3>
                                <div className="action-items">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`action-item priority-${item.priority}`}
                                        >
                                            <div className="action-item-header">
                                                <span className={`priority-badge ${item.priority}`}>
                                                    {item.priority}
                                                </span>
                                                <span style={{ fontSize: "0.82rem", color: "var(--gray-400)" }}>
                                                    Current score: <strong style={{ color: "var(--gray-700)" }}>{item.score} / 5</strong>
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: "1.02rem", marginBottom: 8 }}>{item.title}</h3>
                                            <p className="action-description">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* ── Response Summary ──────────────────────────────────────────── */}
                <div style={{ marginTop: 40 }}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowResponses((v) => !v)}
                        style={{ width: "100%", justifyContent: "space-between" }}
                    >
                        <span>{showResponses ? "▲ Hide" : "▼ Show"} My Responses</span>
                    </button>

                    {showResponses && (
                        <div
                            style={{
                                marginTop: 16,
                                background: "var(--white)",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--gray-200)",
                                overflow: "hidden",
                            }}
                        >
                            <table className="response-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: 40, textAlign: "center" }}>#</th>
                                        <th>Question</th>
                                        <th style={{ width: 200 }}>Your Response</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((q, i) => (
                                        <tr key={q.id}>
                                            <td style={{ textAlign: "center", color: "var(--gray-400)" }}>{i + 1}</td>
                                            <td>{q.text}</td>
                                            <td style={{ fontWeight: 500 }}>
                                                {LEVEL_LABEL[responses[q.id]] ?? (
                                                    <em style={{ color: "var(--gray-400)" }}>—</em>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── Bottom CTA ───────────────────────────────────────────────── */}
                <div style={{ textAlign: "center", padding: "40px 0 60px" }}>
                    <button className="btn btn-primary btn-lg" onClick={handleDownloadPDF}>
                        ⬇ Download Full PDF Report
                    </button>
                </div>
            </div>
        </div>
    );
}
