import { TOOL_CONFIG, SECTIONS, QUESTIONS } from "@/data/questions";
import { generateActionPlan, computeScores, getReadinessLevel } from "@/lib/scoring";
import { jsPDF } from "jspdf";

/**
 * Generates and downloads a PDF report containing:
 * - Cover page
 * - Readiness scores
 * - Full response table
 * - Action plan
 */
export async function downloadPDF(responses, respondentInfo = {}) {
    // Dynamically import autotable (client-side only)
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentW = pageW - 2 * margin;

    const blue = [0, 63, 135];   // TDOT blue  #003f87
    const red = [200, 16, 46];  // TDOT red   #c8102e
    const white = [255, 255, 255];
    const dark = [30, 30, 30];
    const gray = [100, 100, 100];
    const lightGray = [240, 240, 240];

    const shortDate = new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });

    // ── COVER PAGE ────────────────────────────────────────────────────────────
    // Header stripe
    doc.setFillColor(...blue);
    doc.rect(0, 0, pageW, 55, "F");

    doc.setFillColor(...red);
    doc.rect(0, 55, pageW, 4, "F");

    // Title text
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(TOOL_CONFIG.title, pageW / 2, 28, { align: "center" });

    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text(TOOL_CONFIG.subtitle, pageW / 2, 40, { align: "center" });

    doc.setFontSize(11);
    doc.text(TOOL_CONFIG.organization, pageW / 2, 50, { align: "center" });

    // Meta box
    let y = 75;
    doc.setFillColor(...lightGray);
    doc.roundedRect(margin, y, contentW, 50, 3, 3, "F");

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Assessment Information", margin + 8, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const meta = [
        ["Name", respondentInfo.name || "—"],
        ["Organization", respondentInfo.organization || "—"],
        ["Role", respondentInfo.role || "—"],
        ["Date", shortDate],
    ];
    meta.forEach(([label, value], i) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, margin + 8, y + 22 + i * 8);
        doc.setFont("helvetica", "normal");
        doc.text(value, margin + 40, y + 22 + i * 8);
    });

    // Scores section
    y = 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...blue);
    doc.text("Readiness Scores", margin, y);

    const scores = computeScores(responses);
    y += 6;
    scores.forEach((s) => {
        if (s.score === null) return;
        const level = getReadinessLevel(s.score);
        // Bar background
        doc.setFillColor(...lightGray);
        doc.rect(margin, y + 2, contentW - 50, 7, "F");
        // Bar fill
        const r = parseInt(level.color.slice(1, 3), 16);
        const g = parseInt(level.color.slice(3, 5), 16);
        const b = parseInt(level.color.slice(5, 7), 16);
        doc.setFillColor(r, g, b);
        doc.rect(margin, y + 2, (contentW - 50) * (s.score / 100), 7, "F");
        // Labels
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(s.label, margin, y);
        doc.text(`${s.score}% – ${level.label}`, pageW - margin, y, { align: "right" });
        y += 14;
    });

    // Footer
    doc.setFillColor(...blue);
    doc.rect(0, pageH - 15, pageW, 15, "F");
    doc.setTextColor(...white);
    doc.setFontSize(9);
    doc.text(`${TOOL_CONFIG.title}  |  Generated ${shortDate}  |  v${TOOL_CONFIG.version}`, pageW / 2, pageH - 5, { align: "center" });

    // ── PAGE 2: RESPONSES ──────────────────────────────────────────────────────
    doc.addPage();
    _pageHeader(doc, "Section A: Your Responses", blue, red, white, pageW);

    const responseRows = [];
    SECTIONS.forEach((section) => {
        const sectionQs = QUESTIONS.filter((q) => q.section === section.id);
        sectionQs.forEach((q) => {
            const raw = responses[q.id];
            let answer = "—";
            if (raw !== undefined && raw !== null && raw !== "") {
                if (Array.isArray(raw)) {
                    answer = raw.length > 0 ? raw.join(", ") : "—";
                } else {
                    // Map scale to label if radio has options
                    if (q.type === "radio" && q.options) {
                        const opt = q.options.find((o) => o.value === String(raw));
                        answer = opt ? opt.label : String(raw);
                    } else {
                        answer = String(raw);
                    }
                }
            }
            responseRows.push([`[${section.label}]\n${q.text}`, answer]);
        });
    });

    autoTable(doc, {
        startY: 42,
        head: [["Question", "Your Response"]],
        body: responseRows,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: blue, textColor: white, fontStyle: "bold" },
        alternateRowStyles: { fillColor: lightGray },
        columnStyles: { 0: { cellWidth: 110 }, 1: { cellWidth: contentW - 110 } },
        didDrawPage: (data) => {
            _pageFooter(doc, data.pageNumber, blue, white, pageW, pageH, shortDate, TOOL_CONFIG);
        },
    });

    // ── ACTION PLAN PAGES ─────────────────────────────────────────────────────
    doc.addPage();
    _pageHeader(doc, "Section B: Your Personalized Action Plan", blue, red, white, pageW);

    const plan = generateActionPlan(responses);
    let apY = 42;

    plan.forEach((item, index) => {
        // Check if we need a new page
        if (apY > pageH - 60) {
            doc.addPage();
            _pageHeader(doc, "Section B: Your Personalized Action Plan (cont.)", blue, red, white, pageW);
            apY = 42;
        }

        // Priority badge color
        const badgeColor =
            item.priority === "High" ? [198, 40, 40] :
                item.priority === "Medium" ? [230, 81, 0] :
                    [46, 125, 50];

        // Item header
        doc.setFillColor(...badgeColor);
        doc.roundedRect(margin, apY, 22, 6, 1, 1, "F");
        doc.setTextColor(...white);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(item.priority.toUpperCase(), margin + 11, apY + 4.3, { align: "center" });

        doc.setTextColor(...blue);
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${item.title}`, margin + 26, apY + 5);

        doc.setTextColor(...gray);
        doc.setFontSize(8);
        doc.text(item.category, margin + 26, apY + 10);

        apY += 14;

        // Description
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const descLines = doc.splitTextToSize(item.description, contentW);
        doc.text(descLines, margin, apY);
        apY += descLines.length * 5 + 3;

        // Steps
        item.steps.forEach((step, si) => {
            if (apY > pageH - 30) {
                doc.addPage();
                _pageHeader(doc, "Section B: Action Plan (cont.)", blue, red, white, pageW);
                apY = 42;
            }
            doc.setFillColor(...blue);
            doc.circle(margin + 2.5, apY + 1.5, 1.5, "F");
            const stepLines = doc.splitTextToSize(`${step}`, contentW - 8);
            doc.setTextColor(...dark);
            doc.text(stepLines, margin + 7, apY + 0.5);
            apY += stepLines.length * 5 + 2;
        });

        // Divider
        doc.setDrawColor(...lightGray);
        doc.line(margin, apY + 3, pageW - margin, apY + 3);
        apY += 9;
    });

    // Footer on last page
    _pageFooter(doc, doc.internal.getNumberOfPages(), blue, white, pageW, pageH, shortDate, TOOL_CONFIG);

    // ── DOWNLOAD ─────────────────────────────────────────────────────────────
    const filename = `RMM_Assessment_${shortDate.replace(/,?\s+/g, "_")}.pdf`;
    doc.save(filename);
}

// ── Helpers ───────────────────────────────────────────────────────────────
function _pageHeader(doc, title, blue, red, white, pageW) {
    doc.setFillColor(...blue);
    doc.rect(0, 0, pageW, 30, "F");
    doc.setFillColor(...red);
    doc.rect(0, 30, pageW, 3, "F");

    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 20, 20);
}

function _pageFooter(doc, pageNum, blue, white, pageW, pageH, date, config) {
    doc.setFillColor(...blue);
    doc.rect(0, pageH - 12, pageW, 12, "F");
    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.text(`${config.title}  |  ${date}`, 20, pageH - 4);
    doc.text(`Page ${pageNum}`, pageW - 20, pageH - 4, { align: "right" });
}
