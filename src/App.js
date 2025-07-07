import './App.css';
import BookingStepOne from './components/BookingStepOne';
import BookingStepTwo from './components/BookingStepTwo';
import { useState } from 'react';
// Willkommen zur Nexo-App

function App() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState(null);

  const handleNext = (data) => {
    setBookingData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
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
