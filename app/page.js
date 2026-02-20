import Link from "next/link";

export default function HomePage() {
    return (
        <div className="home-page">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-eyebrow">TDOT Research &amp; Innovation Office</div>
                        <h1 className="hero-title">Research Maturity Framework Self-Evaluation</h1>
                        <p className="hero-description">
                            A structured self-evaluation tool to help TDOT&apos;s Research and Innovation
                            Office assess current management capabilities and develop an implementation
                            plan for moving to a higher level of capability. The tool assesses research
                            maturity across three dimensions — Program Management, Evaluation and Impact
                            Measurement, and Invoicing Process.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
                            <Link href="/assessment" className="btn btn-primary btn-lg">
                                Start Self-Evaluation →
                            </Link>
                            <div className="hero-meta">
                                <span className="hero-meta-item">📋 3 dimensions assessed</span>
                                <span className="hero-meta-item">⏱ ~15 minutes</span>
                                <span className="hero-meta-item">📄 PDF report included</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How it works ──────────────────────────────────────────────── */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-heading" style={{ marginBottom: 8 }}>How It Works</h2>
                    <p className="section-subheading">Four simple steps to your personalized maturity report.</p>
                    <div className="features-grid">
                        {[
                            {
                                icon: "👤",
                                step: "Step 1",
                                title: "Enter Your Profile",
                                desc: "Provide your name, organization, and role. This information appears on your personalized PDF report.",
                            },
                            {
                                icon: "🔀",
                                step: "Step 2",
                                title: "Select Your Role",
                                desc: "Choose the functional area that best reflects your responsibilities. You will only answer questions relevant to your role.",
                            },
                            {
                                icon: "📝",
                                step: "Step 3",
                                title: "Answer Questions",
                                desc: "Each question presents five maturity-level descriptions. Select the one that best reflects current practice — not the best-case scenario.",
                            },
                            {
                                icon: "📊",
                                step: "Step 4",
                                title: "Receive Your Action Plan",
                                desc: "Get a maturity score and a prioritized list of improvement actions tailored to your responses, ready to download as a PDF.",
                            },
                        ].map((f) => (
                            <div key={f.step} className="feature-card">
                                <div className="feature-icon">{f.icon}</div>
                                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--blue)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                                    {f.step}
                                </div>
                                <h3 style={{ fontSize: "1rem", marginBottom: 8 }}>{f.title}</h3>
                                <p style={{ fontSize: "0.87rem", lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Three Dimensions ──────────────────────────────────────────── */}
            <section className="sections-overview">
                <div className="container">
                    <h2 className="section-heading" style={{ marginBottom: 8 }}>Three Dimensions of Research Maturity</h2>
                    <p className="section-subheading" style={{ marginBottom: 32 }}>
                        You will answer questions only in the dimension that matches your primary role.
                    </p>
                    <div className="sections-grid">
                        {[
                            {
                                icon: "📋",
                                title: "Block 1: Program Management",
                                questions: 13,
                                desc: "Covers research intake and prioritization, scope definition, role clarity, scheduling, milestone tracking, progress reporting, technical reviews, issue management, change control, records management, vendor oversight, quality expectations, and project closeout.",
                            },
                            {
                                icon: "🔬",
                                title: "Block 2: Evaluation & Impact Measurement",
                                questions: 13,
                                desc: "Covers outcome definition, post-completion evaluation, implementation translation, tracking of adopted outcomes, barrier analysis, reporting quality, internal communication of findings, stakeholder involvement, post-delivery feedback, strategic alignment, records management, long-term impact assessment, and evaluation consistency.",
                            },
                            {
                                icon: "🧾",
                                title: "Block 3: Invoicing Process",
                                questions: 12,
                                desc: "Covers invoice submission requirements, package consistency, review process, approval responsibilities, processing time predictability, correction management, status communication, records organization, recurring issue resolution, reviewer coordination, requirement change communication, and practice consistency.",
                            },
                        ].map((block) => (
                            <div key={block.title} className="section-card">
                                <div className="section-icon">{block.icon}</div>
                                <h3 style={{ marginBottom: 4 }}>{block.title}</h3>
                                <p style={{ fontSize: "0.78rem", color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>
                                    {block.questions} questions · 1–5 maturity scale + N/A
                                </p>
                                <p style={{ fontSize: "0.87rem", lineHeight: 1.6, color: "var(--gray-500)" }}>{block.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Instructions ──────────────────────────────────────────────── */}
            <section style={{ padding: "48px 0", background: "var(--gray-50)" }}>
                <div className="container">
                    <div className="note-card">
                        <h3 style={{ marginBottom: 16, color: "var(--blue)" }}>📌 Before You Begin</h3>
                        <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 20 }}>
                            <li style={{ fontSize: "0.93rem", lineHeight: 1.6, color: "var(--gray-700)" }}>
                                Select the option that best matches <strong>current practice</strong>.
                            </li>
                            <li style={{ fontSize: "0.93rem", lineHeight: 1.6, color: "var(--gray-700)" }}>
                                Choose based on what happens in <strong>typical projects</strong>, not best-case examples.
                            </li>
                            <li style={{ fontSize: "0.93rem", lineHeight: 1.6, color: "var(--gray-700)" }}>
                                If an item is outside your role or truly not applicable, select <strong>N/A</strong>.
                            </li>
                            <li style={{ fontSize: "0.93rem", lineHeight: 1.6, color: "var(--gray-700)" }}>
                                Your responses are saved automatically — you can continue where you left off if you navigate away.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ────────────────────────────────────────────────── */}
            <section className="cta-section">
                <div className="container">
                    <h2 style={{ color: "var(--white)", marginBottom: 12 }}>
                        Ready to assess your research maturity?
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 32, fontSize: "1rem" }}>
                        Takes approximately 15 minutes. A full PDF report is generated automatically at the end.
                    </p>
                    <Link href="/assessment" className="btn btn-primary btn-lg">
                        Begin Self-Evaluation →
                    </Link>
                </div>
            </section>

        </div>
    );
}
