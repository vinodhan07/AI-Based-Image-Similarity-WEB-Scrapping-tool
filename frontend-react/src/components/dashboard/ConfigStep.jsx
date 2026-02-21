import React from 'react';

export default function ConfigStep({ isActive, isCompleted, onNext }) {
    if (!isActive && !isCompleted) return null;

    return (
        <section className="card" id="config-section" style={{ opacity: isActive ? 1 : 0.6 }}>
            <header className="card-header">
                <div className="step-number">2</div>
                <div>
                    <h2>Configure Search</h2>
                    <p className="subtitle">Select the platforms and scope for vector scanning.</p>
                </div>
            </header>

            <div className="filters">
                <div className="filter-group">
                    <label>Target Scope</label>
                    <select disabled={!isActive}>
                        <option>Global Web Search</option>
                        <option>Social Media Only</option>
                        <option>Dark Web &amp; Forums</option>
                        <option>Dating Applications</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Time Range</label>
                    <select disabled={!isActive}>
                        <option>All Time</option>
                        <option>Past 24 Hours</option>
                        <option>Past Week</option>
                        <option>Past Month</option>
                    </select>
                </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn btn-primary"
                    disabled={!isActive}
                    onClick={onNext}
                >
                    Ready to Search
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
}
