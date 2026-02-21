import React, { useState, useEffect } from 'react';

export default function ResultStep({ isActive, scanResult, uploadedImage, onReset }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Reset selection when new result arrives
    useEffect(() => {
        setSelectedIndex(0);
    }, [scanResult]);

    if (!isActive) return null;

    const isSafe = scanResult?.status !== 'FOUND';
    const matches = scanResult?.matches || [];
    const topMatch = matches.length > 0 ? matches[selectedIndex] || matches[0] : null;
    const score = topMatch ? Math.round((topMatch.similarity || 0) * 100) : 0;
    const sourceUrl = topMatch?.source_url || '#';

    // Helper to build matched image URL from file_path 
    const getImageUrl = (filePath) => {
        if (!filePath) return null;
        const filename = filePath.split('/').pop().split('\\').pop();
        return `http://localhost:8000/matched-images/${encodeURIComponent(filename)}`;
    };

    const matchedImageUrl = topMatch ? getImageUrl(topMatch.file_path) : null;

    // Auto scroll to results
    setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    return (
        <section className="card result-area fade-in" id="results-section">
            {isSafe ? (
                <div id="result-safe">
                    <div className="result-badge safe-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Status: Safe
                    </div>

                    {/* Show uploaded image even in safe case */}
                    {uploadedImage && (
                        <div className="compare-grid safe-grid">
                            <div className="compare-card">
                                <span className="compare-label">Your Upload</span>
                                <div className="compare-img-wrap">
                                    <img src={uploadedImage} alt="Uploaded" />
                                </div>
                            </div>
                            <div className="compare-card compare-placeholder">
                                <span className="compare-label">No Match Found</span>
                                <div className="compare-img-wrap placeholder-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>All Clear</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="result-desc">
                        No exact matches or manipulated variants of your image were found across the scanned networks. <strong>Your digital identity remains secure.</strong>
                    </p>
                </div>
            ) : (
                <div id="result-found">
                    <div className="result-badge found-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        Status: Found
                    </div>
                    <p className="result-desc">
                        We detected a high-confidence match for your image in the scanned databases. Please review the details below.
                    </p>

                    {/* Side-by-side image comparison */}
                    <div className="compare-grid">
                        {uploadedImage && (
                            <div className="compare-card">
                                <span className="compare-label">Your Upload</span>
                                <div className="compare-img-wrap">
                                    <img src={uploadedImage} alt="Uploaded" />
                                </div>
                            </div>
                        )}
                        <div className="compare-card match-card">
                            <span className="compare-label match-label">Match #{selectedIndex + 1}</span>
                            <div className="compare-img-wrap">
                                <img src={matchedImageUrl} alt="Matched" />
                            </div>
                        </div>
                    </div>

                    {/* Similarity connector */}
                    <div className="similarity-connector">
                        <div className="sim-line"></div>
                        <span className="sim-badge">{score}% Match</span>
                        <div className="sim-line"></div>
                    </div>

                    <div className="found-details">
                        <div className="detail-row">
                            <span className="detail-label">Confidence Score</span>
                            <span className="detail-value score">{score}%</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Source URL</span>
                            <a href={sourceUrl} className="detail-value link" target="_blank" rel="noreferrer">
                                {sourceUrl}
                            </a>
                        </div>
                    </div>

                    {/* Additional Matches Grid */}
                    {matches.length > 1 && (
                        <div className="other-matches" style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px dashed var(--border)' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-1)', marginBottom: '16px' }}>
                                Found {matches.length} Similar Images
                            </h4>
                            <div className="matches-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                                gap: '16px'
                            }}>
                                {matches.map((m, i) => {
                                    const mScore = Math.round((m.similarity || 0) * 100);
                                    const isSelected = i === selectedIndex;

                                    return (
                                        <div
                                            key={i}
                                            className="mini-match-card"
                                            onClick={() => setSelectedIndex(i)}
                                            style={{
                                                border: isSelected ? '2px solid var(--brand-1)' : '1px solid var(--border)',
                                                borderRadius: '12px',
                                                padding: '10px',
                                                background: isSelected ? 'rgba(108, 92, 231, 0.05)' : '#fff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                transform: isSelected ? 'translateY(-2px)' : 'none',
                                                boxShadow: isSelected ? '0 6px 16px rgba(108, 92, 231, 0.15)' : 'none',
                                                position: 'relative'
                                            }}
                                        >
                                            {/* Rank Badge */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                background: isSelected ? 'var(--brand-1)' : '#cbd5e1',
                                                color: '#fff',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                zIndex: 2,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}>
                                                #{i + 1}
                                            </div>

                                            <div style={{
                                                aspectRatio: '1',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                background: '#f0f2f8'
                                            }}>
                                                <img
                                                    src={getImageUrl(m.file_path)}
                                                    alt={`Match ${i + 1}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isSelected ? 'var(--brand-1)' : 'var(--text-pri)' }}>
                                                {mScore}% Match
                                            </div>
                                            <div style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <span style={{ color: 'var(--text-sec)' }}>{m.source_url.replace('https://www.', '')}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <button className="btn" onClick={onReset} style={{ background: '#f0f2f8', color: '#5c6378' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    Run Another Scan
                </button>
            </div>
        </section>
    );
}
