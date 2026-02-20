"use client";
import Link from "next/link";
import { TOOL_CONFIG, QUESTIONS, SECTIONS } from "@/data/questions";

export default function HomePage() {
    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <div className="hero-eyebrow">
                        <span>📋</span> Self-Assessment Tool
                    </div>
                    <h1>{TOOL_CONFIG.title}</h1>
                    <p className="hero-description">
                        Answer a series of targeted questions about your agency's current maintenance
                        management practices. We'll generate a <strong>personalized, prioritized action
                            plan</strong> to help you advance your RMM maturity.
                    </p>

                    <Link href="/assessment" className="btn btn-primary btn-lg">
                        Start Assessment →
                    </Link>

                    <div className="hero-meta">
                        <div className="hero-meta-item">
                            <span className="hero-meta-icon">⏱</span>
                            ~{TOOL_CONFIG.estimatedMinutes} minutes
                        </div>
                        <div className="hero-meta-item">
                            <span className="hero-meta-icon">❓</span>
                            {QUESTIONS.length} questions
                        </div>
                        <div className="hero-meta-item">
                            <span className="hero-meta-icon">📥</span>
                            Downloadable PDF report
                        </div>
                    </div>
                </div>
            </section>

            <div className="red-rule" />

            {/* Features */}
            <section className="features-section">
                <div className="container">
                    <h2>How It Works</h2>
                    <div className="features-grid">
                        {[
                            {
                                icon: "📝",
                                title: "Answer Questions",
                                desc: `Complete ${SECTIONS.length} short sections covering organization, data, processes, and people.`,
                            },
                            {
                                icon: "📊",
                                title: "Get Your Scores",
                                desc: "See your readiness score for each category, from Beginning to Advanced.",
                            },
                            {
                                icon: "🗺️",
                                title: "Receive Action Plan",
                                desc: "A prioritized list of specific, actionable recommendations tailored to your responses.",
                            },
                            {
                                icon: "📄",
                                title: "Download Your Report",
                                desc: "Export a professional PDF with your full responses and action plan.",
                            },
                        ].map((f) => (
                            <div key={f.title} className="feature-card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sections overview */}
            <section style={{ padding: "0 0 56px" }}>
                <div className="container">
                    <h2 style={{ marginBottom: 20 }}>Assessment Sections</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {SECTIONS.map((s, i) => {
                            const sectionQs = QUESTIONS.filter((q) => q.section === s.id);
                            return (
                                <div
                                    key={s.id}
                                    className="card card-sm"
                                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                                >
                                    <div
                                        style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            background: "var(--blue)", color: "#fff",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontWeight: 700, fontSize: "0.9rem", flexShrink: 0,
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: "var(--gray-900)" }}>{s.label}</div>
                                        <div style={{ fontSize: "0.82rem", color: "var(--gray-500)" }}>
                                            {sectionQs.length} question{sectionQs.length !== 1 ? "s" : ""}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to assess your agency's readiness?</h2>
                    <p>No login required. Results are generated instantly in your browser.</p>
                    <Link href="/assessment" className="btn btn-primary btn-lg">
                        Begin the Assessment →
                    </Link>
                </div>
            </section>
        </>
    );
}
