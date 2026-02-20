"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, SECTIONS } from "@/data/questions";

const STORAGE_KEY = "rmm_assessment_responses";
const INFO_KEY = "rmm_respondent_info";

export default function AssessmentPage() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [showError, setShowError] = useState(false);
    const [started, setStarted] = useState(false);
    const [respondentInfo, setRespondentInfo] = useState({ name: "", organization: "", role: "" });

    // Restore from storage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const savedInfo = localStorage.getItem(INFO_KEY);
            if (saved) setResponses(JSON.parse(saved));
            if (savedInfo) setRespondentInfo(JSON.parse(savedInfo));
        } catch { }
    }, []);

    // Persist responses
    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(responses)); } catch { }
    }, [responses]);

    const question = QUESTIONS[currentIndex];
    const progress = ((currentIndex) / QUESTIONS.length) * 100;

    // Section info
    const currentSection = SECTIONS.find((s) => s.id === question?.section);
    const sectionsDone = SECTIONS.filter((s) =>
        QUESTIONS.filter((q) => q.section === s.id).every((q) => responses[q.id] !== undefined)
    ).map((s) => s.id);

    const setAnswer = useCallback((id, value) => {
        setResponses((prev) => ({ ...prev, [id]: value }));
        setShowError(false);
    }, []);

    const canAdvance = () => {
        if (!question.required) return true;
        const val = responses[question.id];
        if (val === undefined || val === null) return false;
        if (typeof val === "string" && val.trim() === "") return false;
        if (Array.isArray(val) && val.length === 0) return false;
        return true;
    };

    const handleNext = () => {
        if (!canAdvance()) { setShowError(true); return; }
        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex((i) => i + 1);
            setShowError(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            try { localStorage.setItem(INFO_KEY, JSON.stringify(respondentInfo)); } catch { }
            router.push("/results");
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
            setShowError(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleSkip = () => {
        if (!question.required) {
            if (currentIndex < QUESTIONS.length - 1) {
                setCurrentIndex((i) => i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                router.push("/results");
            }
        }
    };

    // ── Intro screen ──────────────────────────────────────────────────────
    if (!started) {
        return (
            <>
                <ProgressBarUI progress={0} currentIndex={0} sections={SECTIONS} sectionsDone={[]} currentSection={null} />
                <div className="assessment-main">
                    <div className="container">
                        <div className="question-card">
                            <div className="intro-screen">
                                <div className="intro-icon">📋</div>
                                <h2 style={{ marginBottom: 12 }}>Before You Begin</h2>
                                <p style={{ maxWidth: 520, margin: "0 auto 28px", fontSize: "0.95rem" }}>
                                    Please tell us a little about yourself. This information will appear on your PDF report cover page.
                                    All fields are optional.
                                </p>

                                <div className="form-grid" style={{ textAlign: "left", maxWidth: 520, margin: "0 auto" }}>
                                    {[
                                        { key: "name", label: "Your Name", placeholder: "Jane Smith" },
                                        { key: "organization", label: "Agency / Organization", placeholder: "City of Nashville DPW" },
                                        { key: "role", label: "Your Role / Title", placeholder: "Transportation Manager" },
                                    ].map((f) => (
                                        <div className="form-group" key={f.key} style={{ gridColumn: f.key === "organization" ? "1 / -1" : undefined }}>
                                            <label className="form-label">{f.label}</label>
                                            <input
                                                className="form-input"
                                                placeholder={f.placeholder}
                                                value={respondentInfo[f.key]}
                                                onChange={(e) =>
                                                    setRespondentInfo((prev) => ({ ...prev, [f.key]: e.target.value }))
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="btn btn-primary btn-lg"
                                    style={{ marginTop: 32 }}
                                    onClick={() => {
                                        try { localStorage.setItem(INFO_KEY, JSON.stringify(respondentInfo)); } catch { }
                                        setStarted(true);
                                    }}
                                >
                                    Start Assessment →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ── Question screen ───────────────────────────────────────────────────
    return (
        <>
            <ProgressBarUI
                progress={progress}
                currentIndex={currentIndex}
                sections={SECTIONS}
                sectionsDone={sectionsDone}
                currentSection={currentSection}
            />

            <div className="assessment-main">
                <div className="container">
                    <div className="question-card">
                        {/* Section tag */}
                        {currentSection && (
                            <div className="question-section-tag">
                                📌 {currentSection.label}
                            </div>
                        )}

                        <div className="question-number">
                            Question {currentIndex + 1} of {QUESTIONS.length}
                            {question.required && <span className="required-badge">* Required</span>}
                        </div>
                        <div className="question-text">{question.text}</div>

                        {question.helpText && (
                            <div className="question-help">{question.helpText}</div>
                        )}

                        {/* Render by type */}
                        <QuestionInput
                            question={question}
                            value={responses[question.id]}
                            onChange={(v) => setAnswer(question.id, v)}
                        />

                        {showError && (
                            <div className="validation-error">
                                ⚠ Please answer this question before continuing.
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="assessment-nav">
                            <button
                                className="btn btn-ghost"
                                onClick={handleBack}
                                disabled={currentIndex === 0}
                            >
                                ← Back
                            </button>

                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                {!question.required && (
                                    <button className="nav-skip" onClick={handleSkip}>
                                        Skip
                                    </button>
                                )}
                                <button className="btn btn-primary" onClick={handleNext}>
                                    {currentIndex === QUESTIONS.length - 1 ? "Finish & View Results →" : "Next →"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ── Progress Bar ─────────────────────────────────────────────────────────── */
function ProgressBarUI({ progress, currentIndex, sections, sectionsDone, currentSection }) {
    return (
        <div className="progress-container">
            <div className="progress-inner">
                <div className="progress-meta">
                    <span className="progress-label">
                        {currentSection ? currentSection.label : "Assessment"}
                    </span>
                    <span className="progress-count">
                        {currentIndex} / {QUESTIONS.length} completed
                    </span>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-sections">
                    {sections.map((s) => (
                        <span
                            key={s.id}
                            className={`section-chip${sectionsDone.includes(s.id) ? " done" :
                                    currentSection?.id === s.id ? " active" : ""
                                }`}
                        >
                            {sectionsDone.includes(s.id) ? "✓ " : ""}{s.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Question Input Renderer ─────────────────────────────────────────────── */
function QuestionInput({ question, value, onChange }) {
    const { type, options } = question;

    if (type === "radio") {
        return (
            <div className="options-list">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className={`option-item${value === opt.value ? " selected" : ""}`}
                    >
                        <input
                            type="radio"
                            name={question.id}
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                        />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>
        );
    }

    if (type === "checkbox") {
        const selected = Array.isArray(value) ? value : [];
        const toggle = (v) => {
            if (selected.includes(v)) onChange(selected.filter((x) => x !== v));
            else onChange([...selected, v]);
        };
        return (
            <div className="options-list">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className={`option-item${selected.includes(opt.value) ? " selected" : ""}`}
                    >
                        <input
                            type="checkbox"
                            value={opt.value}
                            checked={selected.includes(opt.value)}
                            onChange={() => toggle(opt.value)}
                        />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>
        );
    }

    if (type === "scale") {
        return (
            <div className="scale-container">
                <div className="scale-labels">
                    <span>1 — Lowest</span>
                    <span>5 — Highest</span>
                </div>
                <div className="scale-options">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div
                            key={n}
                            className={`scale-option${value === String(n) ? " selected" : ""}`}
                            onClick={() => onChange(String(n))}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && onChange(String(n))}
                        >
                            <span className="scale-num">{n}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === "yesno") {
        return (
            <div className="yesno-options">
                {["Yes", "No"].map((opt) => (
                    <button
                        key={opt}
                        className={`yesno-btn${value === opt
                                ? opt === "Yes" ? " selected-yes" : " selected-no"
                                : ""
                            }`}
                        onClick={() => onChange(opt)}
                    >
                        {opt === "Yes" ? "✅" : "❌"} {opt}
                    </button>
                ))}
            </div>
        );
    }

    if (type === "text") {
        return (
            <textarea
                className="text-input"
                placeholder="Enter your response here…"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
            />
        );
    }

    return null;
}
