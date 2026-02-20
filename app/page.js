"use client";

import Link from "next/link";
import { BLOCKS, TOOL_CONFIG } from "@/data/questions";

export default function HomePage() {
    return (
        <div className="home-page">

            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">TDOT Research &amp; Innovation Office</div>
                    <h1 className="hero-title">{TOOL_CONFIG.title}</h1>
                    <p className="hero-subtitle">
                        A structured self-evaluation tool to assess TDOT&apos;s research management
                        capabilities and identify targeted improvement priorities across program
                        management, evaluation, and invoicing.
                    </p>
                    <div className="hero-cta">
                        <Link href="/assessment" className="btn btn-primary btn-lg">
                            Start Assessment →
                        </Link>
                        <div className="hero-meta">
                            <span>📋 3 dimensions assessed</span>
                            <span>⏱ ~{TOOL_CONFIG.estimatedMinutes} minutes</span>
                            <span>📄 PDF report included</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How it works ──────────────────────────────────────────────────── */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-heading">How It Works</h2>
                    <div className="features-grid">
                        {[
                            {
                                icon: "�",
                                title: "1. Enter Your Profile",
                                desc: "Provide your name, organization, and role. This information appears on your personalized PDF report.",
                            },
                            {
                                icon: "�",
                                title: "2. Select Your Role",
                                desc: "Choose the functional area that best reflects your responsibilities — you'll answer only the questions most relevant to you.",
                            },
                            {
                                icon: "�",
                                title: `3. Answer ${Math.max(...Object.values({ pm: 13, ev: 13, inv: 12 }))} Questions`,
                                desc: "Each question presents five maturity-level descriptions. Select the one that best reflects current practice — not the best-case scenario.",
                            },
                            {
                                icon: "�",
                                title: "4. Receive Your Action Plan",
                                desc: "Get a maturity score and a prioritized list of improvement actions tailored to your responses, ready to download as a PDF.",
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

            {/* ── Assessment Blocks ─────────────────────────────────────────────── */}
            <section className="sections-overview">
                <div className="container">
                    <h2 className="section-heading">Three Dimensions of Maturity</h2>
                    <p className="section-subheading">
                        You will answer questions in the dimension that matches your primary role.
                    </p>
                    <div className="sections-grid">
                        {[
                            {
                                block: BLOCKS[0],
                                icon: "📋",
                                questions: 13,
                                desc:
                                    "Covers research intake, prioritization, scope definition, scheduling, milestone tracking, progress reporting, reviews, issue management, change control, records, vendor oversight, quality, and closeout.",
                            },
                            {
                                block: BLOCKS[1],
                                icon: "🔬",
                                questions: 13,
                                desc:
                                    "Covers outcome definition, post-completion evaluation, implementation translation, tracking, barrier analysis, reporting quality, internal communication, stakeholder involvement, feedback, strategic alignment, records, long-term impact, and consistency.",
                            },
                            {
                                block: BLOCKS[2],
                                icon: "🧾",
                                questions: 12,
                                desc:
                                    "Covers submission requirements, package consistency, review process, approval roles, processing predictability, error management, status communication, records, recurring issues, reviewer coordination, requirement updates, and practice consistency.",
                            },
                        ].map(({ block, icon, questions, desc }) => (
                            <div key={block.id} className="section-card">
                                <div className="section-icon">{icon}</div>
                                <h3>{block.label}</h3>
                                <p className="section-meta">{questions} questions · 1–5 maturity scale</p>
                                <p className="section-desc">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Instructions note ─────────────────────────────────────────────── */}
            <section className="instructions-note">
                <div className="container">
                    <div className="note-card">
                        <h3>📌 Instructions</h3>
                        <ul>
                            <li>Select the option that best matches <strong>current practice</strong>.</li>
                            <li>Choose based on what happens in <strong>typical projects</strong>, not best-case examples.</li>
                            <li>If an item is outside your role or truly not applicable, select <strong>N/A</strong>.</li>
                            <li>Your responses are saved automatically so you can continue where you left off.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
            <section className="cta-section">
                <div className="container" style={{ textAlign: "center" }}>
                    <h2>Ready to assess your research maturity?</h2>
                    <p>Takes approximately {TOOL_CONFIG.estimatedMinutes} minutes. A full PDF report is generated automatically.</p>
                    <Link href="/assessment" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>
                        Begin Self-Evaluation →
                    </Link>
                </div>
            </section>

        </div>
    );
}
