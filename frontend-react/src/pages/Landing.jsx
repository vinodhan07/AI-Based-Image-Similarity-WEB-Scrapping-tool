import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Landing() {

    // ─── Animations & Interactions ───
    useEffect(() => {
        // Scroll Reveal
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px',
        });

        // Stagger cards in the same grid
        document.querySelectorAll('.stat-grid, .steps-grid, .flow-grid, .sdg-grid').forEach(grid => {
            const cards = grid.querySelectorAll('.reveal');
            cards.forEach((card, i) => {
                card.style.transitionDelay = `${i * 0.1}s`;
            });
        });

        reveals.forEach(el => observer.observe(el));

        // Active nav link on scroll
        const sections = document.querySelectorAll('.section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        const updateActiveNav = () => {
            const scrollY = window.scrollY + 100;
            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');

                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        if (scrollY >= top && scrollY < bottom) {
                            link.style.color = '';
                            link.classList.add('active-link');
                        } else {
                            link.classList.remove('active-link');
                        }
                    }
                });
            });
        };

        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav(); // init

        // ─── 3D Tilt Effect on Cards ───
        const tiltCards = document.querySelectorAll('.stat-card, .flow-card, .step-card, .sdg-card');

        const handleMouseMove = (e, card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        };

        const handleMouseLeave = (card) => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'box-shadow 0.4s cubic-bezier(.4,0,.2,1), transform 0.4s cubic-bezier(.4,0,.2,1)';
        };

        const handleMouseEnter = (card) => {
            card.style.transition = 'box-shadow 0.4s cubic-bezier(.4,0,.2,1), transform 0.1s linear';
        };

        // Attach tilt events
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => handleMouseLeave(card));
            card.addEventListener('mouseenter', () => handleMouseEnter(card));
        });

        // Cleanup
        return () => {
            window.removeEventListener('scroll', updateActiveNav);
            // Because we pass inline arrow functions initially, true cleanup for tilt cards is complex in raw DOM 
            // manipulation inside React, but in a true port we'd use Refs. We'll leave it as is for exact parity 
            // since the page just unmounts anyway. Next-level React porting would componentize the tilt cards.
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <Header />
            <main>
                {/* ════════════ HERO ════════════ */}
                <section className="hero">
                    <div className="hero-glow"></div>
                    <div className="hero-grid-overlay"></div>

                    {/* Floating cyber particles */}
                    <div className="hero-particles">
                        <span className="particle p1"></span>
                        <span className="particle p2"></span>
                        <span className="particle p3"></span>
                        <span className="particle p4"></span>
                        <span className="particle p5"></span>
                        <span className="particle p6"></span>
                    </div>

                    <div className="container">
                        <div className="hero-inner">
                            <span className="hero-chip hero-anim a1">HackOps 2026</span>
                            <h1 className="hero-title hero-anim a2">Protection for Women in the Digital World</h1>
                            <p className="hero-tagline hero-anim a3">Detect. Protect. Empower.</p>
                            <p className="hero-desc hero-anim a4">Take control over your digital identity. Our AI detects unauthorized image use across the web, empowering you to secure your presence and gather evidence efficiently.</p>
                            <Link to="/app" className="btn btn-hero hero-anim a5">
                                Launch Application
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ════════════ SDG IMPACT ════════════ */}
                <section className="section sdg-impact" id="sdg">
                    <div className="container">
                        <span className="section-chip">Global Impact</span>
                        <h2 className="section-title">Our Contribution to Global Impact</h2>
                        <p className="section-subtitle">This platform promotes safer digital environments by helping women detect and prevent image‑based cyber abuse using artificial intelligence.</p>

                        <div className="sdg-grid">
                            {/* SDG 5 */}
                            <div className="sdg-card reveal">
                                <div className="sdg-icon-circle sdg5">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <span className="sdg-label">SDG 5</span>
                                <h3 className="sdg-hook">"Women cannot achieve equality if they are not safe online."</h3>
                                <h4 className="sdg-card-title">Gender Equality</h4>
                                <p className="sdg-desc">Our AI system protects women from cyber harassment, image misuse, and digital threats, ensuring they can participate online without fear.</p>
                            </div>

                            {/* SDG 4 */}
                            <div className="sdg-card reveal">
                                <div className="sdg-icon-circle sdg4">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                    </svg>
                                </div>
                                <span className="sdg-label">SDG 4</span>
                                <h3 className="sdg-hook">"A fearful internet is a barrier to girls' education."</h3>
                                <h4 className="sdg-card-title">Quality Education</h4>
                                <p className="sdg-desc">By promoting cyber hygiene and secure digital participation, our platform enables women to safely access online learning and opportunities.</p>
                            </div>

                            {/* SDG 16 */}
                            <div className="sdg-card reveal">
                                <div className="sdg-icon-circle sdg16">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </div>
                                <span className="sdg-label">SDG 16</span>
                                <h3 className="sdg-hook">"Digital justice is the new form of social justice."</h3>
                                <h4 className="sdg-card-title">Peace, Justice &amp; Strong Institutions</h4>
                                <p className="sdg-desc">Our system strengthens accountability by detecting abuse early, generating evidence, and enabling automated reporting workflows.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════ PROBLEM ════════════ */}
                <section className="section problem" id="problem">
                    <div className="container">
                        <span className="section-chip">The Problem</span>
                        <h2 className="section-title">Digital Spaces Aren't Always Safe</h2>
                        <p className="section-subtitle">Online harassment and non-consensual image sharing are rapidly rising, leaving victims with limited tools for immediate detection or protection.</p>

                        <div className="stat-grid">
                            <div className="stat-card reveal">
                                <div className="stat-icon danger">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        <line x1="12" y1="9" x2="12" y2="13" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                                <span className="stat-number">58%</span>
                                <p className="stat-text">of young women have experienced online harassment and image abuse.</p>
                            </div>

                            <div className="stat-card reveal">
                                <div className="stat-icon warning">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <span className="stat-number">Slow</span>
                                <p className="stat-text">Current reporting processes are reactive and take agonizingly long.</p>
                            </div>

                            <div className="stat-card reveal">
                                <div className="stat-icon muted">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                </div>
                                <span className="stat-number">Hidden</span>
                                <p className="stat-text">Images are often manipulated and spread across decentralized platforms.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════ SOLUTION ════════════ */}
                <section className="section solution" id="solution">
                    <div className="container">
                        <span className="section-chip">The Solution</span>
                        <h2 className="section-title">How HerSafe Space Works</h2>
                        <p className="section-subtitle">Our pipeline uses state-of-the-art vision models to securely convert uploaded images into search vectors, allowing us to find unauthorized duplicates with high precision.</p>

                        <div className="flow-grid reveal">
                            <div className="flow-card">
                                <div className="flow-num">1</div>
                                <div className="flow-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>
                                <h3>Secure Upload</h3>
                                <p>Images stay locally managed until encrypted for vector processing.</p>
                            </div>

                            <div className="flow-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className="flow-card">
                                <div className="flow-num">2</div>
                                <div className="flow-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                                        <line x1="6" y1="6" x2="6.01" y2="6" />
                                        <line x1="6" y1="18" x2="6.01" y2="18" />
                                    </svg>
                                </div>
                                <h3>Vision Embedding</h3>
                                <p>AI models convert your image into a mathematical vector.</p>
                            </div>

                            <div className="flow-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className="flow-card">
                                <div className="flow-num">3</div>
                                <div className="flow-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </div>
                                <h3>Vector Search</h3>
                                <p>We scan web index databases to find matching digital fingerprints.</p>
                            </div>

                            <div className="flow-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className="flow-card">
                                <div className="flow-num">4</div>
                                <div className="flow-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                                <h3>Match Report</h3>
                                <p>Review exact visual matches along with source URLs.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════ HOW IT WORKS ════════════ */}
                <section className="section" id="how-it-works">
                    <div className="container">
                        <span className="section-chip">Features</span>
                        <h2 className="section-title">Step-by-Step Experience</h2>
                        <p className="section-subtitle">A seamless interface designed to reduce stress and quickly provide you with the information you need.</p>

                        <div className="steps-grid">
                            <div className="step-card reveal">
                                <span className="step-badge">Step 1</span>
                                <div className="step-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <h3>Drag &amp; Drop</h3>
                                <p>Upload a clear photo to serve as your exact visual baseline for the search.</p>
                            </div>

                            <div className="step-card reveal">
                                <span className="step-badge">Step 2</span>
                                <div className="step-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                </div>
                                <h3>Filter &amp; Target</h3>
                                <p>Target specific web scopes, continents, or specific social platforms for scanning.</p>
                            </div>

                            <div className="step-card reveal">
                                <span className="step-badge">Step 3</span>
                                <div className="step-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                </div>
                                <h3>Live Scrapping</h3>
                                <p>Watch as exact web pages are securely queried and indexed in real time.</p>
                            </div>

                            <div className="step-card reveal">
                                <span className="step-badge">Step 4</span>
                                <div className="step-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <h3>Result Shield</h3>
                                <p>Receive an instant SAFE or FOUND status to verify your visual presence.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════ CTA BANNER ════════════ */}
                <section className="cta-banner">
                    <div className="container cta-inner">
                        <h2>Ready to Secure Your Digital Presence?</h2>
                        <p>Access our cutting-edge AI pipeline to identify unauthorized image circulation.</p>
                        <Link to="/app" className="btn btn-hero">
                            Start Free Scan
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
