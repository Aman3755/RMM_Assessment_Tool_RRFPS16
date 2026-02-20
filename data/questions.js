/**
 * ASSESSMENT QUESTIONS & ACTION PLAN CONFIGURATION
 *
 * To customize with your real content:
 * 1. Replace the QUESTIONS array with your actual questions from the Word file.
 * 2. Update the generateActionPlan() function in lib/scoring.js to map
 *    your real answers to real recommendations.
 *
 * Question types supported:
 *   - "radio"   : Single-select multiple choice
 *   - "scale"   : Rating scale (1-5 Likert)
 *   - "yesno"   : Yes / No
 *   - "text"    : Short open-ended text answer
 *   - "checkbox": Multi-select (returns array of values)
 */

export const TOOL_CONFIG = {
    title: "RMM Readiness Assessment",
    subtitle: "Roadway Maintenance Management Self-Assessment Tool",
    organization: "Tennessee Department of Transportation (TDOT)",
    estimatedMinutes: 15,
    version: "1.0",
};

export const SECTIONS = [
    { id: "org", label: "Organizational Readiness" },
    { id: "data", label: "Data & Technology" },
    { id: "process", label: "Processes & Workflows" },
    { id: "people", label: "People & Training" },
];

/**
 * QUESTIONS
 * Each question:
 * {
 *   id: unique string,
 *   section: one of the section IDs above,
 *   text: question text,
 *   type: "radio" | "scale" | "yesno" | "text" | "checkbox",
 *   options: (for radio/checkbox) array of { value, label },
 *   required: boolean,
 *   helpText: optional hint shown below the question
 * }
 */
export const QUESTIONS = [
    // ── Section 1: Organizational Readiness ─────────────────────────────────
    {
        id: "org_1",
        section: "org",
        text: "How would you describe your agency's current level of commitment to implementing a Roadway Maintenance Management (RMM) system?",
        type: "radio",
        required: true,
        options: [
            { value: "1", label: "No commitment — not a current priority" },
            { value: "2", label: "Low — some interest but no formal plans" },
            { value: "3", label: "Moderate — leadership is aware and supportive" },
            { value: "4", label: "High — actively planning and budgeting" },
            { value: "5", label: "Full commitment — RMM is a strategic priority" },
        ],
    },
    {
        id: "org_2",
        section: "org",
        text: "Does your agency have a dedicated champion or team responsible for RMM implementation?",
        type: "yesno",
        required: true,
        helpText: "A champion is someone formally tasked with driving the initiative forward.",
    },
    {
        id: "org_3",
        section: "org",
        text: "How mature is your agency's strategic planning process for maintenance programs?",
        type: "scale",
        required: true,
        helpText: "1 = Ad hoc / no plan,  5 = Fully documented, regularly updated strategic plan",
    },

    // ── Section 2: Data & Technology ────────────────────────────────────────
    {
        id: "data_1",
        section: "data",
        text: "Which of the following data sources does your agency currently collect? (Select all that apply)",
        type: "checkbox",
        required: true,
        options: [
            { value: "pavement_condition", label: "Pavement condition data" },
            { value: "asset_inventory", label: "Asset inventory" },
            { value: "maintenance_history", label: "Maintenance activity history" },
            { value: "work_orders", label: "Work order records" },
            { value: "cost_data", label: "Cost / expenditure data" },
            { value: "none", label: "None of the above" },
        ],
    },
    {
        id: "data_2",
        section: "data",
        text: "How would you rate the quality and completeness of your agency's maintenance data?",
        type: "scale",
        required: true,
        helpText: "1 = Data is largely missing or unreliable,  5 = Comprehensive, accurate, and regularly validated",
    },
    {
        id: "data_3",
        section: "data",
        text: "Does your agency currently use software for maintenance management (e.g., work order systems, asset management platforms)?",
        type: "yesno",
        required: true,
    },
    {
        id: "data_4",
        section: "data",
        text: "If yes, briefly describe the software or systems currently in use:",
        type: "text",
        required: false,
        helpText: "Skip if not applicable.",
    },

    // ── Section 3: Processes & Workflows ────────────────────────────────────
    {
        id: "proc_1",
        section: "process",
        text: "To what extent are your maintenance workflows formally documented?",
        type: "radio",
        required: true,
        options: [
            { value: "1", label: "Not documented — processes are informal" },
            { value: "2", label: "Partially documented for some activities" },
            { value: "3", label: "Documented but not consistently followed" },
            { value: "4", label: "Documented and generally followed" },
            { value: "5", label: "Fully documented, reviewed, and enforced" },
        ],
    },
    {
        id: "proc_2",
        section: "process",
        text: "How does your agency currently prioritize maintenance activities?",
        type: "radio",
        required: true,
        options: [
            { value: "reactive", label: "Reactive — respond to complaints or failures" },
            { value: "scheduled", label: "Fixed schedule / routine cycles" },
            { value: "condition", label: "Condition-based using inspection data" },
            { value: "riskbased", label: "Risk-based or performance-driven" },
            { value: "optimized", label: "Optimized using predictive analytics" },
        ],
    },
    {
        id: "proc_3",
        section: "process",
        text: "How would you rate the efficiency of your current maintenance operations?",
        type: "scale",
        required: true,
        helpText: "1 = Highly inefficient,  5 = Highly efficient and continuously improving",
    },

    // ── Section 4: People & Training ────────────────────────────────────────
    {
        id: "people_1",
        section: "people",
        text: "Does your agency have staff with the skills needed to implement and operate an RMM system?",
        type: "radio",
        required: true,
        options: [
            { value: "1", label: "No — significant skill gaps exist" },
            { value: "2", label: "Limited — some technical capability" },
            { value: "3", label: "Moderate — some qualified staff but gaps remain" },
            { value: "4", label: "Good — most staff are adequately skilled" },
            { value: "5", label: "Excellent — strong internal expertise available" },
        ],
    },
    {
        id: "people_2",
        section: "people",
        text: "How frequently does your agency provide maintenance-related training to staff?",
        type: "radio",
        required: true,
        options: [
            { value: "never", label: "Never or very rarely" },
            { value: "adhoc", label: "Ad hoc — only when a need arises" },
            { value: "annual", label: "Annually" },
            { value: "regular", label: "Regularly (quarterly or more often)" },
            { value: "ongoing", label: "Ongoing / continuous learning culture" },
        ],
    },
    {
        id: "people_3",
        section: "people",
        text: "Is there anything else you would like to share about your agency's readiness or challenges?",
        type: "text",
        required: false,
    },
];
