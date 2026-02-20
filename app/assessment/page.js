"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "rmm_assessment_responses";
const INFO_KEY = "rmm_respondent_info";
const ROUTING_KEY = "rmm_routing_block";

/* ── Maturity option colours ──────────────────────────────────────────────── */
const MATURITY_LABELS = ["1 — Initial", "2 — Developing", "3 — Defined", "4 — Managed", "5 — Optimizing", "N/A"];
const MATURITY_COLORS = {
    "1": { border: "#c62828", bg: "rgba(198,40,40,0.06)" },
    "2": { border: "#e65100", bg: "rgba(230,81,0,0.06)" },
    "3": { border: "#f9a825", bg: "rgba(249,168,37,0.06)" },
    "4": { border: "#2e7d32", bg: "rgba(46,125,50,0.07)" },
    "5": { border: "#0d47a1", bg: "rgba(13,71,161,0.06)" },
    "na": { border: "#9e9e9e", bg: "rgba(100,100,100,0.05)" },
};

/* ── Inline question data ─────────────────────────────────────────────────── */
// Hardcoded here to avoid any SSR module resolution issues with @/data/questions
const ROUTING_OPTIONS = [
    { value: "program_management", label: "Managing research projects (scope, schedule, reviews, deliverables)", block: "Block 1: Program Management" },
    { value: "evaluation", label: "Evaluating research outcomes, impact, or implementation", block: "Block 2: Evaluation & Impact Measurement" },
    { value: "invoicing", label: "Processing invoices, payments, or administrative documentation", block: "Block 3: Invoicing Process" },
];

const ROUTING_TEXT = "Which functional area best reflects your primary responsibilities?";

/* ── Main component ───────────────────────────────────────────────────────── */
export default function AssessmentPage() {
    const router = useRouter();

    // Guard: render nothing until client-side hydration is complete
    const [mounted, setMounted] = useState(false);
    const [phase, setPhase] = useState("intro");
    const [responses, setResponses] = useState({});
    const [respondentInfo, setRespondentInfo] = useState({ name: "", organization: "", role: "" });
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [blockLabel, setBlockLabel] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showError, setShowError] = useState(false);

    // Hydrate from localStorage only after mount
    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const savedInfo = localStorage.getItem(INFO_KEY);
            const savedBlock = localStorage.getItem(ROUTING_KEY);
            if (saved) setResponses(JSON.parse(saved));
            if (savedInfo) setRespondentInfo(JSON.parse(savedInfo));
            if (savedBlock) {
                setSelectedBlock(savedBlock);
                const opt = ROUTING_OPTIONS.find((o) => o.value === savedBlock);
                if (opt) setBlockLabel(opt.block);
            }
        } catch { /* ignore */ }
    }, []);

    // Persist responses
    useEffect(() => {
        if (!mounted) return;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(responses)); } catch { }
    }, [responses, mounted]);

    // Load questions for selected block (dynamic import avoids SSR bundling issues)
    useEffect(() => {
        if (!selectedBlock) return;
        import("@/data/questions").then(({ QUESTIONS_BY_BLOCK }) => {
            setQuestions(QUESTIONS_BY_BLOCK[selectedBlock] ?? []);
        }).catch(console.error);
    }, [selectedBlock]);

    // Don't render anything until we're client-side
    if (!mounted) {
        return (
            <div className="assessment-main">
                <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
                    <p style={{ color: "var(--gray-500)" }}>Loading…</p>
                </div>
            </div>
        );
    }

    /* ── Helpers ────────────────────────────────────────────────────────────── */
    const totalQ = questions.length;
    const progress = totalQ > 0 ? (currentIndex / totalQ) * 100 : 0;
    const question = questions[currentIndex];

    const setAnswer = useCallback((id, value) => {
        setResponses((prev) => ({ ...prev, [id]: value }));
        setShowError(false);
    }, []);

    const canAdvance = () => {
        if (!question) return false;
        const val = responses[question.id];
        return val !== undefined && val !== null && val !== "";
    };

    /* ── Navigation ─────────────────────────────────────────────────────────── */
    const handleIntroNext = () => {
        try { localStorage.setItem(INFO_KEY, JSON.stringify(respondentInfo)); } catch { }
        setPhase("routing");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRoutingSelect = (blockId) => {
        setSelectedBlock(blockId);
        const opt = ROUTING_OPTIONS.find((o) => o.value === blockId);
        if (opt) setBlockLabel(opt.block);
        try { localStorage.setItem(ROUTING_KEY, blockId); } catch { }
        setCurrentIndex(0);
        setPhase("questions");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNext = () => {
        if (!canAdvance()) { setShowError(true); return; }
        if (currentIndex < totalQ - 1) {
            setCurrentIndex((i) => i + 1);
            setShowError(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            router.push("/results");
        }
    };

    const handleBack = () => {
        setShowError(false);
        if (currentIndex > 0) setCurrentIndex((i) => i - 1);
        else setPhase("routing");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ── PHASE: INTRO ───────────────────────────────────────────────────────── */
    if (phase === "intro") {
        return (
            <div className="assessment-main">
                <div className="container">
                    <div className="question-card">
                        <div className="intro-screen">
                            <div className="intro-icon">📋</div>
                            <h2 style={{ marginBottom: 12 }}>Before You Begin</h2>
                            <p style={{ maxWidth: 520, margin: "0 auto 28px", fontSize: "0.95rem" }}>
                                Please tell us a little about yourself. This information will appear
                                on your PDF report. All fields are optional.
                            </p>

                            <div className="form-grid" style={{ textAlign: "left", maxWidth: 520, margin: "0 auto" }}>
                                {[
                                    { key: "name", label: "Your Name", placeholder: "Jane Smith" },
                                    { key: "organization", label: "Agency / Organization", placeholder: "TDOT Research Office" },
                                    { key: "role", label: "Your Role / Title", placeholder: "Research Manager" },
                                ].map((f) => (
                                    <div
                                        className="form-group"
                                        key={f.key}
                                        style={{ gridColumn: f.key === "organization" ? "1 / -1" : undefined }}
                                    >
                                        <label className="form-label">{f.label}</label>
                                        <input
                                            className="form-input"
                                            placeholder={f.placeholder}
                                            value={respondentInfo[f.key]}
                                            onChange={(e) => setRespondentInfo((prev) => ({ ...prev, [f.key]: e.target.value }))}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-primary btn-lg" style={{ marginTop: 32 }} onClick={handleIntroNext}>
                                Continue →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── PHASE: ROUTING ─────────────────────────────────────────────────────── */
    if (phase === "routing") {
        return (
            <div className="assessment-main">
                <div className="container">
                    <div className="question-card">
                        <div className="question-section-tag">🔀 Routing</div>
                        <div className="question-text" style={{ marginBottom: 28 }}>
                            {ROUTING_TEXT}
                        </div>

                        <div className="options-list">
                            {ROUTING_OPTIONS.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={`option-item${selectedBlock === opt.value ? " selected" : ""}`}
                                    onClick={() => handleRoutingSelect(opt.value)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div style={{ pointerEvents: "none" }}>
                                        <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--gray-900)" }}>
                                            {opt.label}
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--blue)", marginTop: 2 }}>
                                            → {opt.block}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="assessment-nav" style={{ marginTop: 28 }}>
                            <button className="btn btn-ghost" onClick={() => setPhase("intro")}>← Back</button>
                            <span style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>Select one to continue</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── PHASE: QUESTIONS (wait for questions to load) ──────────────────────── */
    if (phase === "questions" && questions.length === 0) {
        return (
            <div className="assessment-main">
                <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
                    <p style={{ color: "var(--gray-500)" }}>Loading questions…</p>
                </div>
            </div>
        );
    }

    if (!question) return null;

    return (
        <>
            {/* Progress bar */}
            <div className="progress-container">
                <div className="progress-inner">
                    <div className="progress-meta">
                        <span className="progress-label">{blockLabel}</span>
                        <span className="progress-count">{currentIndex} / {totalQ} completed</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            <div className="assessment-main">
                <div className="container">
                    <div className="question-card">
                        <div className="question-section-tag">📌 {blockLabel}</div>

                        <div className="question-number">
                            Question {currentIndex + 1} of {totalQ}
                            <span className="required-badge">* Required</span>
                        </div>

                        <div className="question-text">{question.text}</div>

                        <div className="question-help" style={{ marginBottom: 24 }}>
                            Select the option that best matches <strong>current practice</strong>.
                            Choose based on what happens in typical projects, not best-case examples.
                        </div>

                        {/* Maturity options */}
                        <div className="options-list">
                            {question.options.map((opt, idx) => {
                                const isSelected = responses[question.id] === opt.value;
                                const colors = MATURITY_COLORS[opt.value] || {};
                                return (
                                    <label
                                        key={opt.value}
                                        className={`option-item${isSelected ? " selected" : ""}`}
                                        style={isSelected ? { borderColor: colors.border, background: colors.bg } : {}}
                                    >
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={opt.value}
                                            checked={isSelected}
                                            onChange={() => setAnswer(question.id, opt.value)}
                                            style={{ accentColor: colors.border || "var(--blue)" }}
                                        />
                                        <div>
                                            {opt.value !== "na" && (
                                                <span style={{
                                                    display: "inline-block", fontSize: "0.72rem", fontWeight: 700,
                                                    padding: "1px 8px", borderRadius: 999,
                                                    background: isSelected ? colors.border : "var(--gray-200)",
                                                    color: isSelected ? "#fff" : "var(--gray-500)",
                                                    marginBottom: 4, letterSpacing: "0.04em",
                                                }}>
                                                    {MATURITY_LABELS[idx]}
                                                </span>
                                            )}
                                            <div style={{ fontSize: "0.9rem", color: "var(--gray-700)", lineHeight: 1.5 }}>
                                                {opt.label}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        {showError && (
                            <div className="validation-error">⚠ Please select an option before continuing.</div>
                        )}

                        <div className="assessment-nav">
                            <button className="btn btn-ghost" onClick={handleBack}>← Back</button>
                            <button className="btn btn-primary" onClick={handleNext}>
                                {currentIndex === totalQ - 1 ? "Finish & View Results →" : "Next →"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
