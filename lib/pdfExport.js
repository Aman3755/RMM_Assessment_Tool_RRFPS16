/**
 * PDF Export — Research Maturity Framework Self-Evaluation
 * Uses jsPDF + jspdf-autotable (loaded client-side)
 */

const BLUE = [0, 63, 135]; // TDOT Blue  #003f87
const RED = [200, 16, 46];  // TDOT Red   #c8102e
const WHITE = [255, 255, 255];
const LIGHT = [245, 247, 252];
const DARK = [30, 40, 60];

const PRIORITY_COLORS = {
    High: [198, 40, 40],
    Medium: [230, 81, 0],
    Low: [46, 125, 50],
};

const LEVEL_LABEL = {
    "1": "Level 1 – Initial",
    "2": "Level 2 – Developing",
    "3": "Level 3 – Defined",
    "4": "Level 4 – Managed",
    "5": "Level 5 – Optimizing",
    "na": "N/A",
};

export async function exportToPDF(planResult, responses, respondentInfo = {}) {
    const { default: jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const mL = 20;  // margin left
    const mR = 20;  // margin right
    const cW = W - mL - mR;  // content width

    // ══ Helper: add footer on every page ══════════════════════════════════════
    const addFooter = (pageNum, totalPages) => {
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.setFont("helvetica", "normal");
        doc.text(
            `Research Maturity Framework Self-Evaluation — TDOT Research & Innovation Office`,
            mL, H - 10
        );
        doc.text(`Page ${pageNum} of ${totalPages}`, W - mR, H - 10, { align: "right" });
    };

    // ══ PAGE 1: COVER ══════════════════════════════════════════════════════════
    // Blue header bar
    doc.setFillColor(...BLUE);
    doc.rect(0, 0, W, 60, "F");

    // TDOT Red accent strip
    doc.setFillColor(...RED);
    doc.rect(0, 60, W, 4, "F");

    // Title
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Research Maturity Framework", mL, 28);
    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    doc.text("Self-Evaluation Report", mL, 38);
    doc.setFontSize(10);
    doc.text("Tennessee Department of Transportation — Research & Innovation Office", mL, 52);

    // Respondent card
    doc.setFillColor(...LIGHT);
    doc.roundedRect(mL, 74, cW, 52, 3, 3, "F");

    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Respondent Information", mL + 8, 84);

    const fields = [
        ["Name", respondentInfo.name || "—"],
        ["Organization", respondentInfo.organization || "—"],
        ["Role", respondentInfo.role || "—"],
        ["Assessment", planResult.blockLabel || "—"],
        ["Date", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
    ];
    doc.setFontSize(9.5);
    fields.forEach(([label, val], i) => {
        const y = 92 + i * 6;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 100);
        doc.text(label + ":", mL + 8, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...DARK);
        doc.text(val, mL + 50, y);
    });

    // Maturity score section
    const scoreY = 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...BLUE);
    doc.text("Overall Maturity Score", mL, scoreY);

    doc.setFillColor(230, 235, 245);
    doc.roundedRect(mL, scoreY + 4, cW, 36, 3, 3, "F");

    // Score value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(...BLUE);
    const score = planResult.overallScore !== null ? planResult.overallScore.toFixed(1) : "—";
    doc.text(score, mL + 16, scoreY + 26);
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 140);
    doc.text("/ 5.0", mL + 38, scoreY + 26);

    // Maturity level pill
    const ml = planResult.maturityLevel;
    const pillX = mL + 70;
    if (ml) {
        doc.setFillColor(...(PRIORITY_COLORS[ml.label] || BLUE));
        doc.roundedRect(pillX, scoreY + 14, 70, 10, 2, 2, "F");
        doc.setTextColor(...WHITE);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`Level ${ml.level}: ${ml.label}`, pillX + 4, scoreY + 21);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...DARK);
        const descLines = doc.splitTextToSize(ml.description, cW - 90);
        doc.text(descLines, pillX, scoreY + 32);
    }

    // Progress bar
    const pbY = scoreY + 44;
    doc.setFillColor(210, 215, 225);
    doc.roundedRect(mL, pbY, cW, 5, 2, 2, "F");
    if (planResult.overallScore) {
        const fillW = (planResult.overallScore / 5) * cW;
        doc.setFillColor(...BLUE);
        doc.roundedRect(mL, pbY, fillW, 5, 2, 2, "F");
    }

    // Scale labels
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 140);
    ["Initial", "Developing", "Defined", "Managed", "Optimizing"].forEach((l, i) => {
        doc.text(l, mL + (i * cW) / 4, pbY + 10, { align: i === 0 ? "left" : i === 4 ? "right" : "center" });
    });

    // Coverage note
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 120);
    doc.text(
        `${planResult.totalAnswered} of ${planResult.totalQuestions} questions answered`,
        mL, pbY + 18
    );

    addFooter(1, 3); // page 1

    // ══ PAGE 2: RESPONSES ═════════════════════════════════════════════════════
    doc.addPage();

    doc.setFillColor(...BLUE);
    doc.rect(0, 0, W, 18, "F");
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Response Summary", mL, 12);

    // Build response rows
    const { QUESTIONS_BY_BLOCK } = await import("@/data/questions");
    const questions = QUESTIONS_BY_BLOCK[planResult.blockId] ?? [];

    const tableRows = questions.map((q, i) => {
        const val = responses[q.id];
        const resp = LEVEL_LABEL[val] ?? "—";
        return [String(i + 1), q.text, resp];
    });

    doc.autoTable({
        startY: 24,
        head: [["#", "Question", "Response"]],
        body: tableRows,
        margin: { left: mL, right: mR },
        styles: { fontSize: 8, cellPadding: 3, valign: "middle", overflow: "linebreak" },
        headStyles: { fillColor: BLUE, textColor: WHITE, fontStyle: "bold", fontSize: 8.5 },
        columnStyles: {
            0: { cellWidth: 8, halign: "center" },
            1: { cellWidth: 110 },
            2: { cellWidth: cW - 8 - 110, fontStyle: "bold" },
        },
        alternateRowStyles: { fillColor: [248, 249, 252] },
        didDrawPage: (data) => {
            const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
            addFooter(pageNum, 3);
        },
    });

    // ══ PAGE 3: ACTION PLAN ═══════════════════════════════════════════════════
    doc.addPage();

    doc.setFillColor(...BLUE);
    doc.rect(0, 0, W, 18, "F");
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Recommended Action Plan", mL, 12);

    const { actionItems } = planResult;

    if (actionItems.length === 0) {
        doc.setFontSize(11);
        doc.setTextColor(...DARK);
        doc.text(
            "No priority actions identified — practices are performing at a strong level.",
            mL, 36
        );
    } else {
        const apRows = actionItems.map((item) => [
            item.priority,
            item.score + " / 5",
            item.title,
            item.description,
        ]);

        doc.autoTable({
            startY: 24,
            head: [["Priority", "Score", "Action", "Description"]],
            body: apRows,
            margin: { left: mL, right: mR },
            styles: { fontSize: 8, cellPadding: 3, valign: "top", overflow: "linebreak" },
            headStyles: { fillColor: RED, textColor: WHITE, fontStyle: "bold", fontSize: 8.5 },
            columnStyles: {
                0: { cellWidth: 20, halign: "center", fontStyle: "bold" },
                1: { cellWidth: 16, halign: "center" },
                2: { cellWidth: 55, fontStyle: "bold" },
                3: { cellWidth: cW - 20 - 16 - 55 },
            },
            alternateRowStyles: { fillColor: [248, 249, 252] },
            willDrawCell: (data) => {
                if (data.column.index === 0 && data.section === "body") {
                    const pColor = PRIORITY_COLORS[data.cell.raw] || DARK;
                    data.cell.styles.textColor = pColor;
                }
            },
            didDrawPage: (data) => {
                const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
                addFooter(pageNum, 3);
            },
        });
    }

    // ── Save ───────────────────────────────────────────────────────────────────
    const name = (respondentInfo.name || "Results").replace(/\s+/g, "_");
    const date = new Date().toISOString().slice(0, 10);
    doc.save(`RMF_Assessment_${name}_${date}.pdf`);
}
