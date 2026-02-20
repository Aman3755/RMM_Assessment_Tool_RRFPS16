/**
 * SCORING ENGINE — Research Maturity Framework Self-Evaluation
 *
 * Each question uses a 1–5 maturity scale (or "na").
 * Scores are averaged per block and mapped to overall maturity levels.
 *
 * Action-plan items are generated for any dimension scoring below 4.0,
 * prioritised by how far the score falls below that threshold.
 */

import {
    QUESTIONS_BY_BLOCK,
    BLOCKS,
} from "@/data/questions";

// ── Maturity level descriptors ────────────────────────────────────────────────
export const MATURITY_LEVELS = [
    { min: 0, max: 1.49, level: 1, label: "Initial", color: "#c62828", description: "Practices are largely informal and ad hoc." },
    { min: 1.5, max: 2.49, level: 2, label: "Developing", color: "#e65100", description: "Some processes exist but are applied inconsistently." },
    { min: 2.5, max: 3.49, level: 3, label: "Defined", color: "#f9a825", description: "Processes are documented and generally followed." },
    { min: 3.5, max: 4.49, level: 4, label: "Managed", color: "#2e7d32", description: "Practices are measured and actively managed." },
    { min: 4.5, max: 5.0, level: 5, label: "Optimizing", color: "#0d47a1", description: "Continuous improvement is embedded in practice." },
];

export function getMaturityLevel(score) {
    if (score === null || score === undefined || isNaN(score))
        return MATURITY_LEVELS[0];
    return MATURITY_LEVELS.find((l) => score >= l.min && score <= l.max) ?? MATURITY_LEVELS[0];
}

// ── Action-plan item definitions (per block) ──────────────────────────────────
// Each item is triggered when the average score of its question(s) is below
// a threshold. Priority is calculated dynamically from score.
const ACTION_ITEMS_BY_BLOCK = {
    program_management: [
        {
            questionIds: ["B1_1"],
            title: "Establish a Formal Research Intake Process",
            description:
                "Create a structured intake form capturing problem statement, expected users, sponsoring unit, dependencies, and constraints for every candidate project. Require documentation before needs enter evaluation.",
        },
        {
            questionIds: ["B1_2"],
            title: "Develop a Documented Prioritization Framework",
            description:
                "Define measurable criteria (impact, feasibility, strategic alignment, staffing, timing) and weight them consistently. Record rationale for every prioritization decision.",
        },
        {
            questionIds: ["B1_3"],
            title: "Strengthen Scope Definition Templates",
            description:
                "Require scopes to include defined deliverables, acceptance criteria, reporting cadence, known dependencies, and a change-request threshold before project kick-off.",
        },
        {
            questionIds: ["B1_4"],
            title: "Document Roles, Responsibilities, and Escalation Paths",
            description:
                "Create and maintain a RACI or equivalent for each project covering TDOT lead, technical reviewers, administrative contacts, and contractor PM. Clarify escalation sequence.",
        },
        {
            questionIds: ["B1_5"],
            title: "Implement Milestone-Based Schedule Tracking",
            description:
                "Tie milestones to review points and decision gates. Report schedule performance on a defined cadence; flag deviations before they become critical.",
        },
        {
            questionIds: ["B1_6"],
            title: "Standardize Progress Reporting Format",
            description:
                "Adopt a consistent status-report template covering progress, upcoming work, blockers, and decisions needed. Set a regular reporting cadence and enforce it across all active projects.",
        },
        {
            questionIds: ["B1_7"],
            title: "Define Review Checklists and Acceptance Criteria",
            description:
                "Develop standardized review rubrics specifying who reviews what, by when, and against which quality criteria. Track turnaround times and address recurring delays.",
        },
        {
            questionIds: ["B1_8"],
            title: "Create a Structured Issue-Tracking Process",
            description:
                "Log, assign, and follow through on every issue. Review issue patterns periodically to identify and address root causes before they affect multiple projects.",
        },
        {
            questionIds: ["B1_9"],
            title: "Establish a Formal Change-Control Process",
            description:
                "Require written change requests with impact assessment (scope, schedule, cost, outcomes). Define authority levels for different change magnitudes and maintain a change log.",
        },
        {
            questionIds: ["B1_10"],
            title: "Create a Standard Project Records Repository",
            description:
                "Define a consistent folder structure for each project. Store all key artifacts (scope, decisions, reviews, deliverables) in a retrievable format with clear version control.",
        },
        {
            questionIds: ["B1_11"],
            title: "Implement Contractor Performance Monitoring",
            description:
                "Communicate performance expectations explicitly at project start. Track delivery against schedule and quality benchmarks; document corrective actions when issues arise.",
        },
        {
            questionIds: ["B1_12"],
            title: "Define and Communicate Quality Expectations Early",
            description:
                "Document quality criteria for every deliverable type and share them with contractors at kick-off. Use checklists during reviews and track recurring defects to improve guidance.",
        },
        {
            questionIds: ["B1_13"],
            title: "Formalize Project Closeout Procedures",
            description:
                "Create a closeout checklist covering final deliverable verification, archive completion, contract close, and lessons-learned documentation. Track completion rate and timeliness.",
        },
    ],

    evaluation: [
        {
            questionIds: ["B2_1"],
            title: "Define Measurable Outcome Expectations at Project Initiation",
            description:
                "Require scopes to include observable indicators of success — what change is expected, for whom, and where. Enable reviewers to trace deliverables back to intended outcomes.",
        },
        {
            questionIds: ["B2_2"],
            title: "Establish Structured Post-Completion Evaluation Criteria",
            description:
                "Define and apply consistent criteria (clarity, usability, relevance, implementation readiness) to judge the usefulness of research outputs after project completion.",
        },
        {
            questionIds: ["B2_3"],
            title: "Produce Implementation-Oriented Deliverable Outputs",
            description:
                "Require every project to include practical guidance tailored to operational staff: summary documents, step-by-step recommendations, and application context for specific user groups.",
        },
        {
            questionIds: ["B2_4"],
            title: "Implement an Outcome Implementation Tracking Mechanism",
            description:
                "Create defined follow-up check-ins or tracking fields to monitor whether research outcomes are adopted after project close. Incorporate findings into portfolio management.",
        },
        {
            questionIds: ["B2_5"],
            title: "Capture and Analyze Adoption Barriers Systematically",
            description:
                "Record non-implementation reasons at closeout. Analyze patterns across projects to identify systemic issues and proactively adjust planning and engagement strategies.",
        },
        {
            questionIds: ["B2_6"],
            title: "Standardize Reporting Templates and Quality Expectations",
            description:
                "Define minimum reporting requirements and enforce consistent template use across all projects. Actively review report quality and feed deficiencies back to improve templates.",
        },
        {
            questionIds: ["B2_7"],
            title: "Establish Defined Channels for Communicating Evaluation Findings",
            description:
                "Create a structured distribution plan for evaluation summaries reaching leadership, technical staff, and operational users. Tailor format and depth for each audience.",
        },
        {
            questionIds: ["B2_8"],
            title: "Systematically Incorporate Stakeholder Feedback in Evaluation",
            description:
                "Include stakeholders at predefined evaluation points. Document feedback and use it to shape recommendations, next steps, and future project design.",
        },
        {
            questionIds: ["B2_9"],
            title: "Implement Formal Post-Delivery Feedback Mechanisms",
            description:
                "Use structured methods (surveys, review meetings, follow-up calls) to collect feedback after deliverables are used in real settings. Analyze results for recurring patterns.",
        },
        {
            questionIds: ["B2_10"],
            title: "Link Evaluation Results to Agency Strategic Objectives",
            description:
                "Explicitly document how each project's results support agency priorities in evaluation summaries. Use aggregated results to inform portfolio-level planning and funding decisions.",
        },
        {
            questionIds: ["B2_11"],
            title: "Build a Consistent Evaluation Records Repository",
            description:
                "Store evaluation reports, reviewer comments, and decisions predictably. Include a defined minimum documentation set and assign clear ownership for record maintenance.",
        },
        {
            questionIds: ["B2_12"],
            title: "Conduct Structured Long-Term Impact Assessment",
            description:
                "Apply consistent follow-up methods to measure long-term outcomes (operational changes, adoption levels, performance improvements) for applicable projects. Use results to inform future investment.",
        },
        {
            questionIds: ["B2_13"],
            title: "Standardize Evaluation Practices Across Organizational Groups",
            description:
                "Establish shared evaluation procedures and documentation standards. Ensure consistency is maintained during staff transitions through governance, training, and documented institutional practices.",
        },
    ],

    invoicing: [
        {
            questionIds: ["B3_1"],
            title: "Standardize Invoice Submission Requirements and Guidance",
            description:
                "Provide clear, written submission instructions and templates at project initiation. Include checklists and examples so contractors can submit complete invoices the first time.",
        },
        {
            questionIds: ["B3_2"],
            title: "Ensure Consistent Invoice Package Completeness",
            description:
                "Define and communicate the required minimum documentation set for every invoice package. Track and address the most common missing elements to improve first-pass completeness rates.",
        },
        {
            questionIds: ["B3_3"],
            title: "Establish a Defined Invoice Review Process",
            description:
                "Document the review sequence including accuracy checks, eligibility verification, and supporting-document confirmation. Use structured checklists so reviewer decisions are consistent.",
        },
        {
            questionIds: ["B3_4"],
            title: "Clarify Approval Roles and Define Escalation Paths",
            description:
                "Document who is responsible for each approval step and what to do when approvals stall. Maintain workflow continuity through role documentation and consistent oversight.",
        },
        {
            questionIds: ["B3_5"],
            title: "Improve Processing-Time Predictability",
            description:
                "Track invoice processing durations and establish expected timelines. Proactively flag delays and take corrective action when timelines are missed. Analyze historical data to address bottlenecks.",
        },
        {
            questionIds: ["B3_6"],
            title: "Implement a Structured Invoice Correction Process",
            description:
                "Document and track correction requests to resolution. Analyze recurring error types and proactively update guidance, templates, and reviewer instructions to prevent repeat mistakes.",
        },
        {
            questionIds: ["B3_7"],
            title: "Establish Systematic Status Communication with Submitters",
            description:
                "Define communication touchpoints (received, under review, approved, returned) so submitters receive timely updates without needing to follow up manually.",
        },
        {
            questionIds: ["B3_8"],
            title: "Create a Consistent Invoicing Records Repository",
            description:
                "Organize invoices, approvals, and supporting documents in a predictable structure. Assign clear ownership for record maintenance and ensure documentation standards are followed across projects.",
        },
        {
            questionIds: ["B3_9"],
            title: "Identify and Address Recurring Invoicing Issues Systematically",
            description:
                "Collect and review recurring problems across projects. Analyze underlying causes and implement process improvements that prevent systemic issues from repeating.",
        },
        {
            questionIds: ["B3_10"],
            title: "Define Clear Coordination Between Administrative and Technical Reviewers",
            description:
                "Document handoff points and responsibilities between review stages. Minimize duplication, clarify who reviews what, and optimize coordination to reduce delays.",
        },
        {
            questionIds: ["B3_11"],
            title: "Establish a Formal Process for Communicating Requirement Changes",
            description:
                "Formally document and distribute every update to invoicing requirements along with clear implementation timelines and transition guidance. Follow a structured review cycle driven by performance data.",
        },
        {
            questionIds: ["B3_12"],
            title: "Standardize Invoicing Practices Across Organizational Groups",
            description:
                "Ensure submission, review, and approval procedures are consistent regardless of project or reviewer. Institutionalize practices through documentation, training, and oversight so consistency survives staff turnover.",
        },
    ],
};

// ── Main scoring function ─────────────────────────────────────────────────────
/**
 * @param {Object} responses  - Map of questionId → "1"|"2"|"3"|"4"|"5"|"na"
 * @param {string} blockId    - "program_management" | "evaluation" | "invoicing"
 */
export function generateActionPlan(responses, blockId) {
    const questions = QUESTIONS_BY_BLOCK[blockId] ?? [];
    const actionDefs = ACTION_ITEMS_BY_BLOCK[blockId] ?? [];

    // ── Compute numeric scores for each answered question ───────────────────────
    const numericScores = {};
    for (const q of questions) {
        const val = responses[q.id];
        if (val && val !== "na") {
            numericScores[q.id] = parseInt(val, 10);
        }
    }

    const answeredScores = Object.values(numericScores);
    const overallScore =
        answeredScores.length > 0
            ? answeredScores.reduce((a, b) => a + b, 0) / answeredScores.length
            : null;

    // ── Build action items ───────────────────────────────────────────────────────
    // An action item is included if the average score of its associated questions
    // is below 4.0 (i.e., the practice has room to improve).
    const actionItems = [];
    for (const def of actionDefs) {
        const defScores = def.questionIds
            .map((id) => numericScores[id])
            .filter((s) => s !== undefined);

        if (defScores.length === 0) continue;

        const avg = defScores.reduce((a, b) => a + b, 0) / defScores.length;

        if (avg >= 4.0) continue; // already strong — skip

        const gap = 4.0 - avg;                    // 0 = at threshold, 3 = worst
        let priority;
        if (avg < 2.0) priority = "High";
        else if (avg < 3.0) priority = "High";
        else if (avg < 3.5) priority = "Medium";
        else priority = "Low";

        actionItems.push({
            id: def.questionIds.join("+"),
            title: def.title,
            description: def.description,
            priority,
            score: Math.round(avg * 10) / 10,
            gap: Math.round(gap * 10) / 10,
        });
    }

    // Sort: High first, then Medium, then Low; within group by lowest score first.
    const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };
    actionItems.sort((a, b) => {
        const po = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        return po !== 0 ? po : a.score - b.score;
    });

    // ── Block-level maturity level ───────────────────────────────────────────────
    const blockLabel = BLOCKS.find((b) => b.id === blockId)?.label ?? blockId;
    const maturity = overallScore !== null ? getMaturityLevel(overallScore) : null;

    return {
        blockId,
        blockLabel,
        overallScore: overallScore !== null ? Math.round(overallScore * 10) / 10 : null,
        maturityLevel: maturity,
        totalAnswered: answeredScores.length,
        totalQuestions: questions.length,
        actionItems,
    };
}
