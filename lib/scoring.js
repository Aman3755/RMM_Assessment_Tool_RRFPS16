import { QUESTIONS, SECTIONS } from "@/data/questions";

/**
 * Generates an action plan based on user responses.
 *
 * @param {Object} responses - key: questionId, value: answer (string, number, or array)
 * @returns {Array} actionPlanItems - array of { priority, category, title, description, steps[] }
 *
 * ─── HOW TO CUSTOMIZE ────────────────────────────────────────────────────────
 * When you have the real Word file:
 * 1. Add / update conditions below based on your real scoring criteria.
 * 2. Replace placeholder titles, descriptions, and steps with real recommendations.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function generateActionPlan(responses) {
    const items = [];

    // ── Helper ─────────────────────────────────────────────────────────────────
    const num = (id) => parseInt(responses[id]) || 0;
    const val = (id) => responses[id] || "";
    const has = (id, v) => {
        const r = responses[id];
        return Array.isArray(r) ? r.includes(v) : r === v;
    };

    // ── Section 1: Organizational Readiness ───────────────────────────────────
    if (num("org_1") <= 2) {
        items.push({
            priority: "High",
            category: "Organizational Readiness",
            title: "Establish Executive Buy-In for RMM",
            description:
                "Your agency currently has low or no formal commitment to RMM. Securing leadership support is the critical first step before any technical implementation.",
            steps: [
                "Schedule a leadership briefing to present the business case for RMM, including cost-savings and performance outcomes.",
                "Identify a senior sponsor who can champion the initiative and allocate resources.",
                "Develop a one-page RMM value proposition tailored to your agency's strategic goals.",
            ],
        });
    } else if (num("org_1") <= 3) {
        items.push({
            priority: "Medium",
            category: "Organizational Readiness",
            title: "Formalize RMM Commitment and Roadmap",
            description:
                "Leadership is aware and supportive, but a formal plan and budget are needed to move from intent to action.",
            steps: [
                "Document a 12–18 month RMM implementation roadmap with milestones and owners.",
                "Secure a budget line item for RMM-related activities in the upcoming fiscal year.",
                "Communicate the roadmap to all relevant stakeholders and maintenance staff.",
            ],
        });
    }

    if (!has("org_2", "yes") || !has("org_2", "Yes")) {
        items.push({
            priority: "High",
            category: "Organizational Readiness",
            title: "Assign a Dedicated RMM Project Champion",
            description:
                "No dedicated champion or team is currently responsible for RMM. Without clear ownership, implementation efforts often stall.",
            steps: [
                "Formally assign an RMM project champion with dedicated time (minimum 20% of their role).",
                "Define the champion's responsibilities in writing: stakeholder coordination, progress tracking, issue escalation.",
                "Consider forming a small cross-functional steering committee.",
            ],
        });
    }

    if (num("org_3") <= 2) {
        items.push({
            priority: "Medium",
            category: "Organizational Readiness",
            title: "Develop a Strategic Maintenance Plan",
            description:
                "Your agency lacks a mature strategic planning process for maintenance. A documented plan is essential for consistent prioritization.",
            steps: [
                "Draft a 3–5 year strategic maintenance plan aligned with state/agency transportation goals.",
                "Include performance targets, investment levels, and annual review cycles.",
                "Engage field supervisors and planners in the drafting process.",
            ],
        });
    }

    // ── Section 2: Data & Technology ─────────────────────────────────────────
    const dataSources = responses["data_1"] || [];
    const dataSourceCount = Array.isArray(dataSources) ? dataSources.filter(v => v !== "none").length : 0;

    if (dataSourceCount === 0 || has("data_1", "none")) {
        items.push({
            priority: "High",
            category: "Data & Technology",
            title: "Establish Core Data Collection Practices",
            description:
                "Your agency currently collects little to no maintenance-relevant data. Data is the foundation of any RMM system.",
            steps: [
                "Begin collecting pavement condition data using manual inspection or automated tools.",
                "Establish an asset inventory — start with high-priority asset classes (pavement, signs, drainage).",
                "Implement a simple work order log (spreadsheet is acceptable as a first step).",
            ],
        });
    } else if (dataSourceCount <= 2) {
        items.push({
            priority: "Medium",
            category: "Data & Technology",
            title: "Expand and Integrate Data Collection",
            description:
                "You collect some data but gaps remain. Filling these gaps will significantly improve maintenance decision-making.",
            steps: [
                "Identify the 1–2 most impactful missing data sources for your highest-cost maintenance activities.",
                "Develop a data collection schedule and assign ownership for each data type.",
                "Explore low-cost solutions (e.g., mobile inspection apps) to expand data coverage.",
            ],
        });
    }

    if (num("data_2") <= 2) {
        items.push({
            priority: "High",
            category: "Data & Technology",
            title: "Improve Data Quality and Reliability",
            description:
                "Current maintenance data is largely incomplete or unreliable — this limits the effectiveness of any management system.",
            steps: [
                "Conduct a data audit to identify completeness and accuracy gaps.",
                "Define data standards and collection protocols for each data type.",
                "Implement a regular data validation cycle (at least quarterly).",
            ],
        });
    }

    if (!has("data_3", "yes") && !has("data_3", "Yes")) {
        items.push({
            priority: "Medium",
            category: "Data & Technology",
            title: "Evaluate and Adopt Maintenance Management Software",
            description:
                "Your agency does not currently use software for maintenance management. Purpose-built tools can significantly improve efficiency and data utilization.",
            steps: [
                "Survey the market for maintenance management systems suitable for your agency's size and needs.",
                "Evaluate at least 3 vendors with a defined set of requirements (data import, reporting, mobile access).",
                "Plan for a phased implementation starting with work order management.",
            ],
        });
    }

    // ── Section 3: Processes & Workflows ──────────────────────────────────────
    if (num("proc_1") <= 2) {
        items.push({
            priority: "High",
            category: "Processes & Workflows",
            title: "Document Core Maintenance Workflows",
            description:
                "Maintenance processes are largely informal or undocumented. Documentation is essential for consistency, training, and improvement.",
            steps: [
                "Identify the top 5–10 most common maintenance activities performed by your agency.",
                "Document standard operating procedures (SOPs) for each, including triggers, steps, resources, and completion criteria.",
                "Review SOPs with field staff and revise based on feedback.",
            ],
        });
    }

    if (has("proc_2", "reactive") || has("proc_2", "scheduled")) {
        items.push({
            priority: "Medium",
            category: "Processes & Workflows",
            title: "Transition to Condition-Based Maintenance Prioritization",
            description:
                "Your agency currently relies on reactive responses or fixed schedules. Moving to condition-based prioritization will improve resource utilization and extend asset life.",
            steps: [
                "Define condition thresholds that trigger maintenance actions for key asset classes.",
                "Incorporate inspection data into your maintenance scheduling process.",
                "Pilot condition-based prioritization on one maintenance program (e.g., pavement patching) before expanding.",
            ],
        });
    }

    if (num("proc_3") <= 2) {
        items.push({
            priority: "Medium",
            category: "Processes & Workflows",
            title: "Streamline Maintenance Operations for Greater Efficiency",
            description:
                "Current operations are rated as inefficient. Process improvements — even without new technology — can yield significant gains.",
            steps: [
                "Map current-state workflows to identify bottlenecks and redundancies (value-stream mapping).",
                "Prioritize 2–3 quick-win improvements that can be implemented within 90 days.",
                "Establish efficiency metrics (e.g., cost per lane-mile, crew utilization rate) to track improvement.",
            ],
        });
    }

    // ── Section 4: People & Training ────────────────────────────────────────
    if (num("people_1") <= 2) {
        items.push({
            priority: "High",
            category: "People & Training",
            title: "Address Critical Skill Gaps for RMM Implementation",
            description:
                "Significant staff skill gaps exist that will impede RMM adoption. A targeted capacity-building plan is needed.",
            steps: [
                "Conduct a skills assessment to identify specific gaps (data management, GIS, software use, analysis).",
                "Develop a training plan with targeted courses for key roles.",
                "Consider hiring a consultant or contractor in the short term to bridge gaps while building internal capacity.",
            ],
        });
    }

    if (has("people_2", "never") || has("people_2", "adhoc")) {
        items.push({
            priority: "Medium",
            category: "People & Training",
            title: "Establish a Regular Staff Training Program",
            description:
                "Training is infrequent or ad hoc. A structured program improves consistency, safety, and adoption of new tools and processes.",
            steps: [
                "Develop an annual training calendar for maintenance staff covering technical skills and safety.",
                "Leverage free or low-cost resources: LTAP/TTAP programs, APWA workshops, FHWA training modules.",
                "Track training completion and gather participant feedback to continuously improve offerings.",
            ],
        });
    }

    // ── If no issues found ────────────────────────────────────────────────────
    if (items.length === 0) {
        items.push({
            priority: "Low",
            category: "Continuous Improvement",
            title: "Sustain and Advance Your RMM Maturity",
            description:
                "Your agency demonstrates strong readiness across all dimensions. The focus should be on continuous improvement and knowledge-sharing.",
            steps: [
                "Document and share best practices with peer agencies.",
                "Explore advanced analytics (predictive maintenance, optimization modeling) to further improve decisions.",
                "Set stretch performance targets and review progress annually.",
            ],
        });
    }

    // Sort by priority
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Computes a simple readiness score (0–100) per section.
 */
export function computeScores(responses) {
    const sectionScores = {
        org: { total: 0, max: 0, label: "Organizational Readiness" },
        data: { total: 0, max: 0, label: "Data & Technology" },
        process: { total: 0, max: 0, label: "Processes & Workflows" },
        people: { total: 0, max: 0, label: "People & Training" },
    };

    const SCALE_QUESTIONS = ["org_3", "data_2", "proc_3"];
    const RADIO_QUESTIONS = {
        org_1: 5,
        org_2: null, // yesno handled separately
        proc_1: 5,
        people_1: 5,
    };

    QUESTIONS.forEach((q) => {
        const section = sectionScores[q.section];
        if (!section) return;
        const val = responses[q.id];

        if (q.type === "scale") {
            section.max += 5;
            section.total += val ? parseInt(val) : 0;
        } else if (q.type === "yesno") {
            section.max += 1;
            section.total += (val === "Yes" || val === "yes") ? 1 : 0;
        } else if (q.type === "radio" && RADIO_QUESTIONS[q.id]) {
            section.max += RADIO_QUESTIONS[q.id];
            section.total += val ? parseInt(val) : 0;
        }
    });

    return Object.entries(sectionScores).map(([id, s]) => ({
        id,
        label: s.label,
        score: s.max > 0 ? Math.round((s.total / s.max) * 100) : null,
    }));
}

export function getReadinessLevel(score) {
    if (score === null) return { label: "N/A", color: "#888" };
    if (score >= 80) return { label: "Advanced", color: "#2e7d32" };
    if (score >= 60) return { label: "Proficient", color: "#1565c0" };
    if (score >= 40) return { label: "Developing", color: "#e65100" };
    return { label: "Beginning", color: "#c62828" };
}
