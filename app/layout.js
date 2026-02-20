import "@/styles/globals.css";

export const metadata = {
    title: "RMM Readiness Assessment | TDOT",
    description:
        "Complete the Roadway Maintenance Management self-assessment to receive a personalized action plan from TDOT.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="page-wrapper">
                    <header className="site-header">
                        <div className="container">
                            <div className="header-brand">
                                <div className="header-logo">TDOT</div>
                                <div>
                                    <div className="header-title">RMM Readiness Assessment</div>
                                    <div className="header-subtitle">Tennessee Department of Transportation</div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main>{children}</main>
                    <footer className="site-footer">
                        © {new Date().getFullYear()} Tennessee Department of Transportation. All rights reserved.
                    </footer>
                </div>
            </body>
        </html>
    );
}
