import React, { useCallback, useState } from 'react';

export default function UploadStep({ isActive, isCompleted, uploadedImage, setUploadedImage, setUploadedFile, onNext }) {
    const [isDragOver, setIsDragOver] = useState(false);

    // Use useCallback to maintain function reference
    const handleFile = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }, [setUploadedImage]);

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!isActive) return;
        const file = e.dataTransfer.files[0];
        setUploadedFile(file); // Save File for API
        handleFile(file);
    };

    const onChange = (e) => {
        const file = e.target.files[0];
        setUploadedFile(file); // Save File for API
        handleFile(file);
    };

    if (!isActive && !isCompleted) return null;

    return (
        <section className="card" id="upload-section" style={{ opacity: isActive ? 1 : 0.6 }}>
            <header className="card-header">
                <div className="step-number">1</div>
                <div>
                    <h2>Upload Image</h2>
                    <p className="subtitle">Select the photo you want to track across the web.</p>
                </div>
            </header>

            <label
                className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onChange}
                    disabled={!isActive}
                />

                {!uploadedImage ? (
                    <div className="upload-placeholder">
                        <div className="upload-icon-ring">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <span className="upload-cta">Click or drag image here</span>
                        <span className="upload-hint">Supports JPG, PNG, WEBP max 10MB</span>
                    </div>
                ) : (
                    <img src={uploadedImage} alt="Uploaded preview" className="image-preview" />
                )}
            </label>

            {/* Privacy notice */}
            <div className="privacy-notice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span><strong>We do not store your image.</strong> Your upload is processed entirely on the client side. The vector index is automatically deleted once the search is complete. Your privacy is fully protected.</span>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn btn-primary"
                    disabled={!uploadedImage || !isActive}
                    onClick={onNext}
                >
                    Confirm &amp; Proceed
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
}
