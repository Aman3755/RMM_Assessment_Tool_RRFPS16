/**
 * RESEARCH MATURITY FRAMEWORK SELF-EVALUATION TOOL
 * Tennessee Department of Transportation — Research and Innovation Office
 *
 * All question content is sourced directly from the official Questionnaire.docx.
 *
 * ── ROUTING LOGIC ────────────────────────────────────────────────────────────
 * After the respondent profile (name/org/role), the user answers ONE routing
 * question that determines which Block they complete:
 *
 *   "program_management" → BLOCK 1 (Questions B1_1 – B1_13)
 *   "evaluation"         → BLOCK 2 (Questions B2_1 – B2_13)
 *   "invoicing"          → BLOCK 3 (Questions B3_1 – B3_12)
 *
 * ── ANSWER SCALE ─────────────────────────────────────────────────────────────
 * Every substantive question uses a 1–5 maturity scale + N/A:
 *   1 = Ad hoc / informal        (Lowest)
 *   2 = Developing / inconsistent
 *   3 = Defined / consistent
 *   4 = Managed / measurable
 *   5 = Optimizing / continuous   (Highest)
 *   na = Not Applicable
 */

export const TOOL_CONFIG = {
    title: "Research Maturity Framework Self-Evaluation",
    subtitle: "Research and Innovation Office Self-Assessment Tool",
    organization: "Tennessee Department of Transportation (TDOT)",
    estimatedMinutes: 15,
    version: "1.0",
};

// ── Blocks (displayed as "sections" in the UI) ────────────────────────────────
export const BLOCKS = [
    { id: "program_management", label: "Block 1: Program Management" },
    { id: "evaluation", label: "Block 2: Evaluation & Impact Measurement" },
    { id: "invoicing", label: "Block 3: Invoicing Process" },
];

// ── Shared answer options for all maturity questions ─────────────────────────
// The "label" for each value is question-specific and stored per-question below.
// This constant defines the VALUE keys used for every maturity choice.
export const MATURITY_VALUES = ["1", "2", "3", "4", "5", "na"];

// ── Helper: build a maturity question ────────────────────────────────────────
function maturity(id, block, text, options) {
    return {
        id,
        block,
        text,
        type: "maturity", // rendered as a vertical radio list with 6 choices
        required: true,
        options: options.map((label, i) => ({
            value: MATURITY_VALUES[i],
            label,
        })),
    };
}

// ── BLOCK 1: PROGRAM MANAGEMENT (13 questions) ───────────────────────────────
const BLOCK1 = [
    maturity("B1_1", "program_management",
        "How are research needs converted into a set of candidate projects?",
        [
            "Projects originate mainly from ad hoc requests; rationale is rarely captured; the \"why now\" is usually undocumented.",
            "Needs are discussed in recurring meetings/emails, but intake is inconsistent; documentation exists for some projects, not most.",
            "A consistent intake mechanism exists (form/template); most project ideas include basic justification, sponsor, and intended users.",
            "Intake includes structured fields (problems, expected use, dependencies, constraints); submissions are screened against defined criteria.",
            "Intake data is analyzed over time to refine criteria and identify recurring needs; the process is periodically improved based on outcomes.",
            "N/A",
        ]
    ),

    maturity("B1_2", "program_management",
        "How are projects prioritized when resources are limited?",
        [
            "Prioritization is primarily judgment-based; criteria vary by decision-maker; trade-offs are not documented.",
            "Informal criteria exist (urgency/visibility), but weighting is unclear; results are difficult to reproduce across cycles.",
            "Documented criteria are used for most decisions; rationale is recorded (even if briefly) and can be explained after the fact.",
            "Criteria include measurable considerations (impact, feasibility, alignment, staffing, timing); prioritization is consistent across groups.",
            "Prioritization is periodically recalibrated using results from completed projects (implementation success, delivery performance, realized value).",
            "N/A",
        ]
    ),

    maturity("B1_3", "program_management",
        "How is scope defined so expectations are stable across TDOT and contractors?",
        [
            "Scope is mostly described narratively; deliverables and acceptance criteria are unclear until late.",
            "Deliverables are listed, but \"done\" is interpreted differently across projects; change requests are frequent.",
            "Scope includes defined deliverables, milestones, and acceptance expectations; changes are managed using a consistent approach.",
            "Scope includes measurable requirements where appropriate (format, reporting cadence, required artifacts); dependencies and constraints are explicit.",
            "Scope definition is continuously improved using recurring issues (ambiguities, rework) and lessons learned; templates evolve accordingly.",
            "N/A",
        ]
    ),

    maturity("B1_4", "program_management",
        "How are roles and responsibilities established and enforced?",
        [
            "Roles are assumed; responsibilities shift informally; escalation paths are unclear.",
            "Roles are generally known but not consistently documented; accountability varies by project manager.",
            "Roles are documented (TDOT lead, technical reviewers, administrative contacts, contractor PM); escalation paths exist and are used.",
            "Responsibilities are tied to timelines and deliverables; coordination expectations are explicit; handoffs are defined.",
            "Role clarity is audited through recurring issues and updated; onboarding materials maintain continuity during turnover.",
            "N/A",
        ]
    ),

    maturity("B1_5", "program_management",
        "How are schedules and milestones planned at project start?",
        [
            "Schedules are rough; milestones are not consistently tracked; slippage becomes visible late.",
            "A schedule exists but varies in detail; milestone tracking depends on the project manager.",
            "Milestones and reporting dates are defined and tracked for most projects; schedule updates occur through a standard cadence.",
            "Milestones are linked to review points and decision gates; schedule performance is tracked consistently and used to manage work.",
            "Schedule planning improves over time using observed slippage patterns; milestone structures are refined to reduce late surprises.",
            "N/A",
        ]
    ),

    maturity("B1_6", "program_management",
        "How is progress reporting structured during execution?",
        [
            "Updates occur informally (emails/calls); status is hard to reconstruct later.",
            "Some projects submit status reports, but formats differ; key details (risks, next steps) are often missing.",
            "A standard status format exists (progress, upcoming, blockers, decision needed); reporting is thorough and occurs on a predictable cadence.",
            "Reports include measurable progress against milestones; deviations are flagged and tracked; management actions are documented.",
            "Reporting is streamlined and consistently high-quality; recurring reporting issues are corrected by improving templates and guidance.",
            "N/A",
        ]
    ),

    maturity("B1_7", "program_management",
        "How are technical reviews and approvals handled for interim and final deliverables?",
        [
            "Reviews happen inconsistently; criteria are unclear; approvals may be delayed without a clear process.",
            "Reviews occur but are highly variable; feedback quality depends on individuals; turnaround times vary widely.",
            "Review steps are defined (who reviews what, by when); deliverables are checked against documented expectations.",
            "Reviews use standardized checklists/rubrics; turnaround times are tracked; recurring quality issues are addressed systematically.",
            "Review performance is continuously improved (fewer cycles, faster approvals, clearer expectations); rubrics evolve based on observed defects.",
            "N/A",
        ]
    ),

    maturity("B1_8", "program_management",
        "When issues arise (delays, missing data, contractor capacity, scope drift), how are they handled?",
        [
            "Issues are handled case-by-case; actions are informal; the same issues recur across projects.",
            "Issues are discussed and sometimes documented, but tracking is inconsistent; follow-up depends on individuals.",
            "Issues are logged, assigned, and followed through; decisions and mitigations are documented for most projects.",
            "Issue patterns are reviewed (root causes, recurrence); mitigations are standardized where appropriate; escalation is predictable.",
            "Preventive practices exist (early indicators, standard mitigations); recurring issues decline because lessons are institutionalized.",
            "N/A",
        ]
    ),

    maturity("B1_9", "program_management",
        "How are changes to scope, schedule, or deliverables controlled?",
        [
            "Changes happen informally; it is difficult to tell what was approved and why.",
            "Some changes are documented, but thresholds and approval roles vary; impacts are not consistently recorded.",
            "A consistent change process exists (request, impact summary, approval); most changes are documented and traceable.",
            "Changes are evaluated using a standard impact format (cost, schedule, outcomes); approvals follow defined authority levels.",
            "Change data is analyzed over time to reduce avoidable change drivers; templates and upfront scoping improve to lower change frequency.",
            "N/A",
        ]
    ),

    maturity("B1_10", "program_management",
        "How are project records organized so that information can be retrieved later?",
        [
            "Files are stored inconsistently; key decisions and versions are hard to locate.",
            "Some structures exist, but naming/version control varies; archives are incomplete.",
            "A standard repository structure exists; major artifacts and decisions are stored predictably; retrieval is feasible for most projects.",
            "Records include required minimum set (scope, decisions, reviews, final deliverables); ownership for maintaining the repository is clear.",
            "The archive supports reuse (searchable, tagged, linked to outcomes); documentation standards improve based on retrieval problems.",
            "N/A",
        ]
    ),

    maturity("B1_11", "program_management",
        "How is vendor/contractor performance managed during the project?",
        [
            "Performance expectations are implied; issues are addressed informally; accountability is inconsistent.",
            "Expectations exist but are not consistently monitored; corrective actions depend on the project manager.",
            "Performance expectations are communicated and monitored; nonperformance triggers documented follow-up.",
            "Performance is tracked against schedule/deliverable quality; recurring issues are escalated through a consistent process.",
            "Performance management is proactive (early warnings, structured feedback); lessons inform future procurement/selection and oversight practices.",
            "N/A",
        ]
    ),

    maturity("B1_12", "program_management",
        "How are deliverable quality expectations made clear to all parties?",
        [
            "Quality is assessed subjectively; \"acceptable\" varies across reviewers.",
            "Some quality expectations exist (format/content), but they're inconsistent and often communicated late.",
            "Quality expectations are documented and shared early; reviews reference these expectations.",
            "Quality criteria are systematic (rubrics/checklists) and used consistently; frequent defects are tracked and corrected at the source.",
            "Quality improves across cycles because criteria and guidance evolve; rework decreases due to clearer upfront expectations.",
            "N/A",
        ]
    ),

    maturity("B1_13", "program_management",
        "How is project closure conducted (administrative + technical closeout)?",
        [
            "Closure varies; final documentation is inconsistent; loose ends remain common.",
            "Some closeout steps exist, but completeness depends on the project team.",
            "A defined closeout checklist exists and is usually followed; final acceptance and archiving occur reliably.",
            "Closeout includes verification of required artifacts and decision records; closure performance (timeliness/completeness) is tracked.",
            "Closeout is efficient and consistent; recurring closure gaps drive improvements to processes earlier in the lifecycle.",
            "N/A",
        ]
    ),
];

// ── BLOCK 2: EVALUATION AND IMPACT MEASUREMENT (13 questions) ────────────────
const BLOCK2 = [
    maturity("B2_1", "evaluation",
        "How are expected results defined before project work begins?",
        [
            "Projects usually start with broad intentions or problem statements. Expected results are described generally (e.g., \"improve operations\") and different stakeholders often interpret success differently later.",
            "Expected results are sometimes written into project scopes, but detail varies widely; some projects define outcomes clearly while others rely on informal understanding.",
            "Projects typically document expected outcomes and intended users at project initiation. Outcomes are described clearly enough to guide deliverable development.",
            "Expected results include measurable or observable indicators (what change, where, and for whom). Reviewers can trace deliverables back to defined outcomes.",
            "Outcome definitions are continuously refined using lessons from previous projects, including implementation experience and evaluation results.",
            "N/A",
        ]
    ),

    maturity("B2_2", "evaluation",
        "After project completion, how is usefulness of the research actually judged?",
        [
            "Completion of deliverables is treated as the primary indicator of success; whether outputs are used or useful is rarely examined.",
            "Usefulness is discussed informally during closeout or follow-up conversations but evaluations are inconsistent and not documented.",
            "Projects are reviewed using defined evaluation criteria (clarity, usability, relevance). Evaluations are documented but may vary in depth.",
            "Evaluation includes structured criteria tied to intended outcomes, implementation readiness, and stakeholder usefulness; results are comparable across projects.",
            "Evaluation results are tracked over time and influence how new projects are designed, scoped, and reviewed.",
            "N/A",
        ]
    ),

    maturity("B2_3", "evaluation",
        "How are research results translated into something operational staff can actually use?",
        [
            "Most outputs remain technical or research-focused; operational guidance depends on individual interpretation.",
            "Some projects produce summaries or recommendations, but practical guidance varies significantly in quality and detail.",
            "Projects routinely include implementation-oriented outputs (summary documents, guidance sections, practical recommendations).",
            "Outputs are intentionally designed for specific user groups and include clear steps, assumptions, and application context.",
            "Usability of outputs is validated with end users and refined based on real-world feedback and implementation experience.",
            "N/A",
        ]
    ),

    maturity("B2_4", "evaluation",
        "How is implementation of research outcomes tracked once a project is closed?",
        [
            "Implementation status is generally unknown after final delivery.",
            "Implementation information is collected occasionally when stakeholders report back, but tracking is inconsistent.",
            "A defined follow-up mechanism exists (e.g., check-ins or tracking fields) for determining whether outcomes were adopted.",
            "Implementation status is systematically monitored and documented across projects using consistent tracking practices.",
            "Implementation tracking is integrated into portfolio management and directly influences future prioritization and project design.",
            "N/A",
        ]
    ),

    maturity("B2_5", "evaluation",
        "When projects fail to be implemented or adopted, how are causes handled?",
        [
            "Reasons are usually unknown or assumed; lessons are rarely captured.",
            "Barriers are discussed informally but documentation is incomplete or inconsistent.",
            "Common barriers are recorded during project closeout and stored with project documentation.",
            "Barrier information is analyzed across projects to identify recurring patterns and systemic issues.",
            "Recurring barriers lead to proactive changes in project planning, scoping, or stakeholder engagement strategies.",
            "N/A",
        ]
    ),

    maturity("B2_6", "evaluation",
        "How consistent is project reporting quality across different projects?",
        [
            "Reports vary significantly in structure and depth; reviewers must adapt expectations each time.",
            "Templates exist but are used inconsistently, leading to uneven reporting quality.",
            "Standard templates and minimum requirements are generally followed, resulting in comparable reports.",
            "Report quality is actively reviewed against defined standards; feedback improves consistency.",
            "Reporting standards evolve based on recurring deficiencies and stakeholder feedback, producing consistently high-quality outputs.",
            "N/A",
        ]
    ),

    maturity("B2_7", "evaluation",
        "How are evaluation findings communicated internally within TDOT after project completion?",
        [
            "Evaluation outcomes remain within the project team and are not broadly shared.",
            "Findings are occasionally shared through informal emails or presentations.",
            "Evaluation summaries are distributed through defined channels.",
            "Communication is tailored for different audiences (leadership, technical staff, operational users).",
            "Communication effectiveness is monitored and improved based on audience response and usage.",
            "N/A",
        ]
    ),

    maturity("B2_8", "evaluation",
        "How are stakeholders involved in judging project outcomes?",
        [
            "Stakeholder involvement usually ends once project scope is approved; final evaluation is performed internally with little or no external input.",
            "Stakeholders are occasionally asked for opinions near project completion, but participation depends on individual project managers and is not consistent across projects.",
            "Stakeholders are included at predefined points (e.g., draft review or closeout meetings); feedback is documented but may vary in depth.",
            "Stakeholder perspectives are systematically incorporated into evaluation conclusions; feedback influences recommendations and identified next steps.",
            "Stakeholder engagement is structured throughout project execution and evaluation; stakeholder feedback is tracked across projects and actively used to reshape future project design and evaluation criteria.",
            "N/A",
        ]
    ),

    maturity("B2_9", "evaluation",
        "How is feedback collected after deliverables are used or tested in real settings?",
        [
            "Feedback is rarely collected after delivery; once reports are submitted, follow-up is minimal or absent.",
            "Feedback occurs only when problems or complaints emerge; collection is reactive and undocumented in many cases.",
            "Projects use defined mechanisms (follow-up calls, surveys, review meetings) to gather post-delivery feedback for most projects.",
            "Feedback results are summarized and reviewed to identify recurring strengths, weaknesses, or usability issues across multiple projects.",
            "Feedback collection is systematic and linked to improvement actions; findings directly drive updates to templates, evaluation methods, and future project expectations.",
            "N/A",
        ]
    ),

    maturity("B2_10", "evaluation",
        "How are evaluation results connected to agency priorities or strategic objectives?",
        [
            "Project evaluations focus mainly on technical completion; connections to agency priorities are rarely documented.",
            "Alignment with agency priorities is discussed during evaluation but depends on individual interpretation and is inconsistently recorded.",
            "Evaluation summaries explicitly describe how project results support documented agency goals or program objectives.",
            "Strategic alignment is reviewed as a formal part of evaluation; alignment influences judgments about project success and value.",
            "Evaluation results are aggregated across projects to inform portfolio-level planning, funding decisions, and strategic research direction.",
            "N/A",
        ]
    ),

    maturity("B2_11", "evaluation",
        "How are evaluation records organized so information can be retrieved and reused later?",
        [
            "Evaluation materials are stored inconsistently; locating prior reviews or conclusions requires significant effort or personal knowledge.",
            "Some centralized storage exists, but file naming, version tracking, and completeness vary, making comparison difficult.",
            "A consistent repository structure exists; evaluation reports, review comments, and decisions are stored predictably and can be located for most projects.",
            "Records include a required minimum set (evaluation criteria, conclusions, reviewer comments, implementation notes); ownership for maintaining documentation is clear.",
            "Evaluation records are searchable and structured for reuse; tagging and linkage to outcomes allow comparisons across projects and drive improvements to documentation standards.",
            "N/A",
        ]
    ),

    maturity("B2_12", "evaluation",
        "How is long-term impact of research projects assessed?",
        [
            "Long-term outcomes are generally unknown after project closeout; no follow-up activities are conducted.",
            "Long-term impact is occasionally discussed or assumed, but no structured process exists to confirm results.",
            "Follow-up checks are conducted for selected projects to determine whether outcomes were implemented or maintained.",
            "Long-term impact measures (e.g., operational changes, adoption level, performance improvement) are consistently applied where applicable.",
            "Long-term impact findings are tracked across projects and used to shape research investment priorities and future project selection criteria.",
            "N/A",
        ]
    ),

    maturity("B2_13", "evaluation",
        "How consistent are evaluation practices across organizational groups?",
        [
            "Evaluation methods differ widely by team or project manager; criteria and expectations vary from project to project.",
            "Some shared evaluation practices exist, but differences remain significant depending on who leads the project.",
            "Common evaluation procedures and documentation standards are used across many groups, resulting in generally comparable evaluations.",
            "Evaluation practices are standardized across most organizational units; reviewers apply similar expectations and decision criteria.",
            "Evaluation consistency is sustained regardless of staffing or organizational changes due to established institutional practices and clear governance.",
            "N/A",
        ]
    ),
];

// ── BLOCK 3: INVOICING (12 questions) ────────────────────────────────────────
const BLOCK3 = [
    maturity("B3_1", "invoicing",
        "How are invoice submission requirements communicated to contractors or project teams?",
        [
            "Submission expectations are communicated informally; requirements are often clarified after invoices are submitted, leading to frequent revisions.",
            "General guidelines exist, but required documentation and formatting expectations vary across projects or managers.",
            "Standard submission instructions and templates are provided at project initiation; most invoices follow a recognizable structure.",
            "Submission requirements include clear checklists or examples; reviewers receive mostly complete invoices with fewer clarification requests.",
            "Guidance is routinely updated using recurring submission issues; onboarding materials and examples prevent common mistakes before submission.",
            "N/A",
        ]
    ),

    maturity("B3_2", "invoicing",
        "How consistent are invoice packages when received for review?",
        [
            "Invoice formats and supporting documents vary significantly; reviewers spend time determining what is missing or required.",
            "Some common structure exists, but supporting documents and calculations are inconsistent across projects.",
            "Most invoices follow standard templates; required supporting materials are usually included.",
            "Submission packages contain a consistent minimum documentation set; missing elements are uncommon and quickly identified.",
            "Invoice packages are standardized and predictable; consistency allows faster review and easier auditing across projects.",
            "N/A",
        ]
    ),

    maturity("B3_3", "invoicing",
        "How are invoices reviewed after submission?",
        [
            "Review steps depend on individual reviewers; evaluation criteria differ from one project to another.",
            "Basic review expectations exist, but reviewers interpret requirements differently; approval decisions may vary.",
            "Review follows a consistent sequence with defined checks (accuracy, eligibility, supporting documents).",
            "Review uses structured checklists or criteria; reviewer decisions are more consistent and easier to explain.",
            "Review performance is monitored; recurring review delays or issues are analyzed and process improvements are introduced.",
            "N/A",
        ]
    ),

    maturity("B3_4", "invoicing",
        "How are approval responsibilities defined and managed during invoice processing?",
        [
            "Approval authority is unclear; invoices may move between staff informally before approval, and delays occur because responsibilities are not clearly assigned.",
            "Approval roles exist, but responsibilities sometimes shift depending on workload or personnel availability; submitters may not know who currently owns the approval step.",
            "Approval responsibilities are documented and generally followed; invoices move through a predictable sequence of reviewers for most projects.",
            "Approval workflows include defined escalation paths when approvals stall, with clear expectations for response times and accountability.",
            "Approval responsibilities remain stable regardless of staffing changes; workflow continuity is maintained through documented procedures, role definitions, and consistent oversight.",
            "N/A",
        ]
    ),

    maturity("B3_5", "invoicing",
        "How predictable is invoice processing time from submission to final approval?",
        [
            "Processing times vary significantly; stakeholders often cannot estimate when payment will be completed, and delays are discovered only after follow-up.",
            "Typical processing timelines exist but depend heavily on reviewer workload; similar invoices may experience very different turnaround times.",
            "Processing timelines are generally predictable for most invoices; stakeholders have reasonable expectations for approval duration.",
            "Processing durations are tracked and reviewed; delays are identified early and corrective actions are taken when timelines are missed.",
            "Historical processing data is analyzed to improve workflow efficiency; timeline variability decreases as process bottlenecks are systematically addressed.",
            "N/A",
        ]
    ),

    maturity("B3_6", "invoicing",
        "How are incomplete or incorrect invoices managed once problems are identified?",
        [
            "Corrections occur through informal back-and-forth communication; expectations vary by reviewer and repeated errors are common.",
            "Errors are identified and communicated, but feedback quality differs between reviewers and similar mistakes recur across submissions.",
            "Correction requests follow a consistent process; required fixes are documented and tracked until resolution.",
            "Common submission errors are identified and proactively communicated to submitters, reducing repeated correction cycles.",
            "Error trends are analyzed across multiple projects; templates, guidance, and reviewer instructions are updated to prevent recurring issues.",
            "N/A",
        ]
    ),

    maturity("B3_7", "invoicing",
        "How is communication maintained with submitters during invoice review?",
        [
            "Status updates are informal; submitters typically follow up manually through email or calls to understand progress.",
            "Status updates occur occasionally but are inconsistent, resulting in uncertainty about invoice location in the review process.",
            "Defined communication points exist (e.g., received, under review, approved, returned for corrections); submitters receive updates at key stages.",
            "Status updates are systematic and predictable; stakeholders can reasonably track invoice progress without repeated follow-ups.",
            "Workflow transparency is high; invoice status is clearly visible and communication processes minimize manual inquiry or confusion.",
            "N/A",
        ]
    ),

    maturity("B3_8", "invoicing",
        "How are invoicing records organized for future reference, audits, or issue resolution?",
        [
            "Records are stored inconsistently; locating previous invoices, approvals, or supporting documentation requires significant manual effort.",
            "Some centralized storage exists, but naming conventions and record completeness vary; historical records are difficult to compare.",
            "A consistent repository structure exists; invoices and approval documentation are stored predictably for most projects.",
            "Records include required supporting documentation and approval history; ownership for maintaining record completeness is clearly defined.",
            "Records are searchable and linked to project information; documentation standards evolve based on audit findings or retrieval challenges.",
            "N/A",
        ]
    ),

    maturity("B3_9", "invoicing",
        "How are recurring invoicing issues identified and addressed across projects?",
        [
            "Issues are treated individually; repeated problems are not recognized as systemic.",
            "Recurring problems are noticed informally but rarely documented or reviewed collectively.",
            "Common issues are documented and occasionally reviewed to inform process adjustments.",
            "Recurring issues are analyzed across projects to identify underlying workflow weaknesses and process gaps.",
            "Trend analysis drives preventive improvements; recurring problems decline because systemic causes are addressed proactively.",
            "N/A",
        ]
    ),

    maturity("B3_10", "invoicing",
        "How is coordination managed between administrative and technical reviewers?",
        [
            "Coordination depends heavily on informal communication; responsibilities may overlap and duplicate review effort occurs.",
            "Review coordination exists but roles are not always clearly separated; handoffs may cause delays or repeated requests for information.",
            "Roles and responsibilities are generally defined, reducing duplication and clarifying who reviews what.",
            "Coordination follows a structured workflow with clear handoffs between technical and administrative review stages.",
            "Coordination practices are optimized; handoffs are efficient, review overlap is minimized, and delays caused by miscommunication are rare.",
            "N/A",
        ]
    ),

    maturity("B3_11", "invoicing",
        "How are changes to invoicing requirements or procedures communicated?",
        [
            "Changes are communicated informally; some reviewers or contractors may continue using outdated requirements.",
            "Updates are communicated, but supporting documents or templates are not always updated at the same time.",
            "Requirement changes are formally documented and distributed to relevant stakeholders.",
            "Updates include clear implementation timelines, examples, or transition guidance to reduce confusion during changeover.",
            "Requirement updates follow a structured review cycle; changes are driven by recurring issues and process performance data.",
            "N/A",
        ]
    ),

    maturity("B3_12", "invoicing",
        "How consistent are invoicing practices across projects or organizational groups?",
        [
            "Invoicing practices differ widely between projects; submission formats, review expectations, and approval steps depend heavily on who manages the work, causing confusion for contractors and reviewers.",
            "Some common expectations exist, but teams still use different workflows, documentation requirements, or approval approaches; stakeholders must adjust depending on the project.",
            "Most projects follow similar invoicing procedures and documentation requirements; differences exist but do not significantly affect processing or review consistency.",
            "Invoicing workflows are standardized across organizational units; submission, review, and approval follow a predictable sequence regardless of project or reviewer.",
            "Invoicing practices remain consistent even during staff turnover or organizational change because procedures are institutionalized, documented, and routinely reinforced through training or oversight.",
            "N/A",
        ]
    ),
];

// ── Combined export ───────────────────────────────────────────────────────────
// Flat list — the assessment page filters by block based on the routing answer.
export const ALL_QUESTIONS = [...BLOCK1, ...BLOCK2, ...BLOCK3];

// Map block id → questions for convenience
export const QUESTIONS_BY_BLOCK = {
    program_management: BLOCK1,
    evaluation: BLOCK2,
    invoicing: BLOCK3,
};

// Routing question (shown once, before any block)
export const ROUTING_QUESTION = {
    id: "routing",
    text: "Which functional area best reflects your primary responsibilities?",
    type: "routing",
    required: true,
    options: [
        {
            value: "program_management",
            label: "Managing research projects (scope, schedule, reviews, deliverables)",
            block: "Block 1: Program Management",
        },
        {
            value: "evaluation",
            label: "Evaluating research outcomes, impact, or implementation",
            block: "Block 2: Evaluation & Impact Measurement",
        },
        {
            value: "invoicing",
            label: "Processing invoices, payments, or administrative documentation",
            block: "Block 3: Invoicing Process",
        },
    ],
};
