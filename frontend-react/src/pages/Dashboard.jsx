import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import UploadStep from '../components/dashboard/UploadStep';
import ConfigStep from '../components/dashboard/ConfigStep';
import ProcessStep from '../components/dashboard/ProcessStep';
import ResultStep from '../components/dashboard/ResultStep';
import Popups from '../components/dashboard/Popups';
import MatchFoundPopup from '../components/dashboard/MatchFoundPopup';

const STEP_IDS = ['upload-section', 'config-section', 'process-section', 'results-section'];

export default function Dashboard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [scanResult, setScanResult] = useState(null); // Will hold SAFE/FOUND data
    const [showMatchPopup, setShowMatchPopup] = useState(false);

    // Show popup when a match is found
    useEffect(() => {
        if (scanResult?.status === 'FOUND') {
            setShowMatchPopup(true);
        } else {
            setShowMatchPopup(false);
        }
    }, [scanResult]);

    // Auto-scroll to the active section when step changes
    useEffect(() => {
        const sectionId = STEP_IDS[currentStep - 1];
        if (!sectionId) return;
        // Small delay so the DOM has time to render the new section
        const timer = setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [currentStep]);

    // Handlers to transition between steps
    const handleNextStep = () => setCurrentStep(prev => prev + 1);
    const handleReset = () => {
        setUploadedImage(null);
        setUploadedFile(null);
        setScanResult(null);
        setCurrentStep(1);
    };

    return (
        <>
            <Popups />
            {showMatchPopup && (
                <MatchFoundPopup
                    scanResult={scanResult}
                    onViewDetails={() => {
                        setShowMatchPopup(false);
                        setTimeout(() => {
                            const el = document.getElementById('results-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 150);
                    }}
                    onDismiss={() => setShowMatchPopup(false)}
                />
            )}
            <Header />
            <main className="dashboard">
                <UploadStep
                    isActive={currentStep === 1}
                    isCompleted={currentStep > 1}
                    uploadedImage={uploadedImage}
                    setUploadedImage={setUploadedImage}
                    setUploadedFile={setUploadedFile}
                    onNext={handleNextStep}
                />

                <ConfigStep
                    isActive={currentStep === 2}
                    isCompleted={currentStep > 2}
                    onNext={handleNextStep}
                />

                <ProcessStep
                    isActive={currentStep === 3}
                    isCompleted={currentStep > 3}
                    uploadedFile={uploadedFile}
                    setScanResult={setScanResult}
                    onComplete={handleNextStep}
                />

                <ResultStep
                    isActive={currentStep === 4}
                    scanResult={scanResult}
                    uploadedImage={uploadedImage}
                    onReset={handleReset}
                />
            </main>
            <Footer />
        </>
    );
}
