import React, { useState } from 'react';

export default function Popups() {
    // 0 = Privacy, 1 = Awareness, 2 = Closed
    const [popupStage, setPopupStage] = useState(0);

    const handleNext = () => setPopupStage(1);

    const handleClose = () => {
        setPopupStage(2);
    };

    if (popupStage === 2) return null;

    return (
        <div className="modal-overlay">
            {popupStage === 0 && (
                <div className="modal-container slide-in">
                    <div className="modal-icon-hero privacy-hero">🛡️</div>
                    <h2 className="modal-title">Your Privacy is <span className="gradient-text">Our Priority</span></h2>
                    <div className="modal-body-compact">
                        <div className="highlight-card">
                            <span className="highlight-icon">🔒</span>
                            <p><strong>Zero Data Storage</strong> — Your images are <strong>never</strong> saved on our servers.</p>
                        </div>
                        <div className="highlight-card">
                            <span className="highlight-icon">⚡</span>
                            <p><strong>Temporary Processing</strong> — Images are analyzed <strong>in-memory</strong> and disposed of instantly.</p>
                        </div>
                        <div className="highlight-card">
                            <span className="highlight-icon">🔐</span>
                            <p><strong>Fully Confidential</strong> — No one, including us, can access your uploads.</p>
                        </div>
                    </div>
                    <button className="btn btn-primary modal-btn" onClick={handleNext}>
                        Start Search <span style={{ marginLeft: '6px' }}>→</span>
                    </button>
                </div>
            )}

            {popupStage === 1 && (
                <div className="modal-container slide-in">
                    <div className="modal-icon-hero awareness-hero">💡</div>
                    <h2 className="modal-title">Stay Safe, <span className="gradient-text">Stay Aware</span></h2>
                    <p className="modal-subtitle">Quick tips to protect your digital identity</p>
                    <div className="modal-body-compact">
                        <div className="awareness-tip">
                            <span className="tip-badge">01</span>
                            <p><strong>Review Privacy Settings</strong> — Set profiles to <strong>"Friends Only"</strong> on all platforms.</p>
                        </div>
                        <div className="awareness-tip">
                            <span className="tip-badge">02</span>
                            <p><strong>Avoid Live Location Tags</strong> — Share locations only <strong>after</strong> you've left.</p>
                        </div>
                        <div className="awareness-tip">
                            <span className="tip-badge">03</span>
                            <p><strong>Watermark Your Photos</strong> — A subtle mark makes unauthorized reuse <strong>harder</strong>.</p>
                        </div>
                        <div className="awareness-tip">
                            <span className="tip-badge">04</span>
                            <p><strong>Report & Block</strong> — If your images are misused, <strong>report immediately</strong>.</p>
                        </div>
                    </div>
                    <button className="btn btn-primary modal-btn" onClick={handleClose}>
                        Agree & Continue
                    </button>
                </div>
            )}
        </div>
    );
}
