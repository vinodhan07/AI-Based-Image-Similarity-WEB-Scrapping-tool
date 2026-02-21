import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <header className={isLanding ? 'nav' : 'top-bar'}>
            <div className={isLanding ? 'container' : ''}>
                <div className={isLanding ? 'nav-inner' : 'header-inner'}>
                    {/* Logo */}
                    {isLanding ? (
                        <Link to="/" className="nav-logo">
                            <div className="nav-logo-mark">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <span className="nav-brand">HerSafe <em>Space</em></span>
                        </Link>
                    ) : (
                        <div className="logo">
                            <div className="logo-mark">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <div className="logo-text">
                                <h1>HerSafe <span>Space</span></h1>
                                <p className="tagline">AI-Powered Image Safety Detection</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links / Actions */}
                    {isLanding ? (
                        <>
                            <div className="nav-links">
                                <a href="#sdg">SDG Impact</a>
                                <a href="#problem">Problem</a>
                                <a href="#solution">Solution</a>
                                <a href="#how-it-works">How It Works</a>
                            </div>
                            <Link to="/app" className="nav-cta">Launch App</Link>
                        </>
                    ) : (
                        <div className="header-actions">
                            <span className="badge">
                                <span className="badge-dot"></span>
                                System Online
                            </span>
                            <Link to="/" className="btn-back">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
