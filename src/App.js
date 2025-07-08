import './App.css';
import BookingStepOne from './components/BookingStepOne';
import BookingStepTwo from './components/BookingStepTwo';
import { useState, useEffect } from 'react';
// Willkommen zur Nexo-App

function App() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const determineStepFromHash = () => {
      if (window.location.hash === '#/bookingtwo') {
        setStep(2);
      } else {
        setStep(1);
      }
    };
    determineStepFromHash();
    window.addEventListener('hashchange', determineStepFromHash);
    return () => window.removeEventListener('hashchange', determineStepFromHash);
  }, []);

  const handleNext = (data) => {
    setBookingData(data);
    window.location.hash = '#/bookingtwo';
  };

  const handleBack = () => {
    window.location.hash = '#/';
  };

  return (
    <div className="App">
      {step === 1 && (
        <BookingStepOne apiKey="AIzaSyBw_MiOfkc-lQ_YSG5jKNM9lEaR8nbKSNg" onNext={handleNext} />
      )}
      {step === 2 && <BookingStepTwo data={bookingData} onBack={handleBack} />}
    </div>
  );
}

export default App;
