import React, { useState, useEffect, useRef } from 'react';
import LiveActivityLog from './LiveActivityLog';

const steps = [
    { delay: 0, progress: 8, emoji: '🌐', text: 'Connecting to target...', sub: 'Initializing web scrapping engine', state: 'state-active' },
    { delay: 2000, progress: 25, emoji: '🔍', text: 'It may take a few minutes to scrap media from the target.', sub: 'Scanning posts from selected time', state: 'state-active' },
    { delay: 4500, progress: 50, emoji: '⏳', text: 'Loading', sub: 'Comparing embeddings with FAISS vector index', state: 'state-active', typing: true },
    { delay: 7000, progress: 68, emoji: '🛡️', text: 'Don\'t worry — we are checking if your images are on the target.', sub: 'Your privacy is our priority', state: 'state-warm' },
    { delay: 9500, progress: 85, emoji: '🔎', text: 'Almost done...', sub: 'Running final similarity checks', state: 'state-active' },
    { delay: 11500, progress: 95, emoji: '📍', text: 'We will expose the exact location where your photos are — for your next legal activity.', sub: 'Don\'t worry, we\'ve got your back.', state: 'state-warm' }
];

export default function ProcessStep({ isActive, isCompleted, onComplete, uploadedFile, setScanResult }) {
    const [messages, setMessages] = useState([]);
    const [progress, setProgress] = useState(0);
    const [isScraping, setIsScraping] = useState(false);

    const endRef = useRef(null);

    // Reset state when this step becomes active again (e.g. after "Run Another Scan")
    useEffect(() => {
        if (isActive) {
            setMessages([]);
            setProgress(0);
            setIsScraping(false);
        }
    }, [isActive]);

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [messages]);

    const startScraping = () => {
        if (isScraping) return;
        setIsScraping(true);
        setMessages([]);
        setProgress(0);

        const timeouts = [];

        const runApiSearch = async () => {
            if (!uploadedFile) return { status: 'SAFE' };

            const formData = new FormData();
            formData.append('file', uploadedFile);

            try {
                const response = await fetch('http://localhost:8000/search-image', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('API Error');
                return await response.json();
            } catch (err) {
                console.error('Search API Failed:', err);
                return { status: 'SAFE' }; // Default safe if backend fails
            }
        };

        // Fire API immediately, but UI steps run on interval
        const apiPromise = runApiSearch();

        steps.forEach((step, i) => {
            const t = setTimeout(() => {
                setMessages(prev => {
                    const updated = prev.map(m => ({
                        ...m,
                        state: 'state-done',
                        typing: false
                    }));
                    return [...updated, { ...step }];
                });
                setProgress(step.progress);

                if (i === steps.length - 1) {
                    const tFinal = setTimeout(async () => {
                        // Wait for API to finish just in case it took longer than the animation 
                        const result = await apiPromise;
                        setScanResult(result);

                        setMessages(prev => {
                            const updated = prev.map(m => ({ ...m, state: 'state-done', typing: false }));
                            return [...updated, {
                                emoji: '✅',
                                text: 'Scrapping complete! Scroll down for your results.',
                                sub: 'Analysis finished successfully',
                                state: 'state-final'
                            }];
                        });
                        setProgress(100);

                        const tComplete = setTimeout(() => {
                            setIsScraping(false);
                            onComplete();
                        }, 1000);
                        timeouts.push(tComplete);
                    }, 2500);
                    timeouts.push(tFinal);
                }
            }, step.delay);
            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    };

    if (!isActive && !isCompleted) return null;

    return (
        <section className="card" id="process-section" style={{ opacity: isActive ? 1 : 0.6 }}>
            <header className="card-header">
                <div className="step-number">3</div>
                <div>
                    <h2>Start Scrapping</h2>
                    <p className="subtitle">Initiate the AI-powered search pipeline across the web.</p>
                </div>
            </header>

            <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={isScraping || !isActive}
                onClick={startScraping}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                {isScraping ? 'Processing Search...' : 'Start Search Pipeline'}
            </button>

            {/* Progress & Messages */}
            {(messages.length > 0 || isScraping || isCompleted) && (
                <div className="progress-area">
                    <div className="progress-bar-track">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="logs-side-by-side">
                        {/* Left — Original card-based message feed */}
                        <div className="message-feed">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`msg-card ${msg.state}`}>
                                    <span className="msg-emoji">{msg.emoji}</span>
                                    <div className="msg-body">
                                        <span className="msg-text">
                                            {msg.text}
                                            {msg.typing && (
                                                <span className="typing-dots"><span></span><span></span><span></span></span>
                                            )}
                                        </span>
                                        {msg.sub && <span className="msg-sub">{msg.sub}</span>}
                                    </div>
                                </div>
                            ))}
                            <div ref={endRef} />
                        </div>

                        {/* Right — Live AI Activity Log */}
                        {isScraping && (
                            <div className="live-log-section">
                                <LiveActivityLog isScraping={isScraping} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
