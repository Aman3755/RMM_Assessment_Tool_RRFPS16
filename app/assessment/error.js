"use client";

export default function AssessmentError({ error, reset }) {
    return (
        <div className="assessment-main">
            <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>⚠️</div>
                <h2 style={{ color: "var(--blue)", marginBottom: 12 }}>Something went wrong</h2>
                <p style={{ color: "var(--gray-500)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
                    An error occurred while loading the assessment.
                    Your saved responses will be restored when you retry.
                </p>
                <button
                    onClick={reset}
                    className="btn btn-primary btn-lg"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
