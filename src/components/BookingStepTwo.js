import React from 'react';
import './BookingStepTwo.css';

const BookingStepTwo = ({ data, onBack }) => {
  if (!data) return null;
  return (
    <div className="booking-step-two bg-white text-black min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold mb-4">Fahrtdetails bestätigen</h1>
      <div className="summary-box text-left mb-4">
        <p><strong>Abholadresse:</strong> {data.fromAddress}</p>
        <p><strong>Ziel:</strong> {data.toAirport}</p>
        <p><strong>Datum:</strong> {data.departureDate}</p>
        <p><strong>Uhrzeit:</strong> {data.departureTime}</p>
        <p><strong>Distanz:</strong> {data.distanceKm.toFixed(2)} km</p>
        <p><strong>Preis:</strong> {data.price.toFixed(2)} €</p>
      </div>
      <button className="back-button" onClick={onBack}>Zurück</button>
    </div>
  );
};

export default BookingStepTwo;
