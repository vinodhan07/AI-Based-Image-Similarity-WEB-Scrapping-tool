export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-brand">
                    <div className="nav-logo-mark small">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <span>HerSafe <em>Space</em></span>
                </div>
                <p className="footer-note">Built for the HackOps Hackathon 2026 — Empowering women's digital safety through AI.</p>
                <p className="footer-team">Developed by <strong>Sabareswaran</strong> & <strong>Prasanna Venkatesh</strong></p>
                <p className="footer-copy">&copy; 2026 HerSafe Space. All rights reserved.</p>
            </div>
        </footer>
    );
}
