import React, { useState, useEffect, useRef } from 'react';

// Platform icons
const icons = {
    Instagram: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
    ),
    Twitter: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
    ),
    Facebook: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
    ),
    Reddit: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12c-1.1 0-2 .9-2 2s.9 2 2 2h8c1.1 0 2-.9 2-2s-.9-2-2-2"></path>
            <circle cx="8.5" cy="14.5" r="1.5"></circle>
            <circle cx="15.5" cy="14.5" r="1.5"></circle>
        </svg>
    ),
    System: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
    )
};

const getStatusIcon = (status) => {
    if (status === 'loading') {
        return (
            <svg className="anim-spin status-icon loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.3"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
        );
    } else if (status === 'success') {
        return (
            <svg className="status-icon success anim-pop" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        );
    } else if (status === 'nomatch') {
        return (
            <svg className="status-icon nomatch anim-pop" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
        );
    }
};

const mockSequence = [
    { platform: 'System', text: 'Initializing AI search pipeline...', status: 'success', time: '0.1s' },
    { platform: 'Instagram', text: 'Connecting to Instagram...', status: 'loading', time: '0.4s' },
    { platform: 'Instagram', text: 'Scanning 240000 posts...', status: 'loading', time: '1.2s' },
    { platform: 'Instagram', text: 'Comparing embeddings for instagram.com/user123', status: 'loading', time: '2.5s' },
    { platform: 'System', text: 'Switching to Twitter...', status: 'success', time: '0.2s' },
    { platform: 'Twitter', text: 'Checking Twitter posts...', status: 'loading', time: '0.8s' },
    { platform: 'Twitter', text: 'Running similarity comparison...', status: 'loading', time: '1.5s' },
    { platform: 'Facebook', text: 'Connecting to Facebook...', status: 'loading', time: '0.6s' },
    { platform: 'Facebook', text: 'No matches found on Facebook.', status: 'nomatch', time: '2.1s' },
    { platform: 'Reddit', text: 'Scanning Reddit threads...', status: 'loading', time: '0.5s' },
    { platform: 'System', text: 'Aggregating results...', status: 'success', time: '0.4s' }
];

export default function LiveActivityLog({ isScraping }) {
    const [logs, setLogs] = useState([]);
    const [logIndex, setLogIndex] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!isScraping) {
            if (logs.length > 0) {
                // optionally show a final log
            }
            return;
        }

        if (logIndex === 0) {
            setLogs([]); // reset
        }

        if (logIndex >= mockSequence.length) return;

        // Simulate real-time logs arriving with some random jitter
        const delay = Math.random() * 1000 + 800;

        const timer = setTimeout(() => {
            setLogs(prev => [...prev, mockSequence[logIndex]]);
            setLogIndex(i => i + 1);
        }, delay);

        return () => clearTimeout(timer);
    }, [isScraping, logIndex]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (!isScraping && logs.length === 0) return null;

    return (
        <div className="live-activity-text fade-in">
            <div className="live-activity-title">
                <span className="live-indicator"></span>
                <h3>AI Search Pipeline Running</h3>
            </div>
            <div className="live-progress-bar-track">
                <div className="live-progress-bar-fill"></div>
            </div>

            <div className="live-text-feed" ref={scrollRef}>
                {logs.map((log, idx) => (
                    <p key={idx} className={`live-line slide-up ${log.status}`}>
                        <span className="live-line-status">{getStatusIcon(log.status)}</span>
                        <span className="live-line-msg">{log.text}</span>
                        <span className="live-line-meta">{log.platform} • {log.time}</span>
                    </p>
                ))}
                {isScraping && logIndex < mockSequence.length && (
                    <p className="live-line slide-up loading">
                        <span className="live-line-status">{getStatusIcon('loading')}</span>
                        <span className="live-line-msg shimmer-text">Waiting for next node...</span>
                    </p>
                )}
            </div>
        </div>
    );
}
