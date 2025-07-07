import React, { useEffect, useRef, useState } from 'react';
import './BookingStepOne.css';

const KILOMETER_PRICE = 1.5; // Euro per km

function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const BookingStepOne = ({ apiKey, onNext }) => {
  const [fromAddress, setFromAddress] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departure, setDeparture] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState('oneway');
  const [distanceKm, setDistanceKm] = useState(null);
  const [price, setPrice] = useState(null);

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  useEffect(() => {
    loadGoogleMapsScript(apiKey).then(() => {
      const fromAutocomplete = new window.google.maps.places.Autocomplete(fromInputRef.current);
      fromAutocomplete.setFields(['formatted_address', 'geometry']);
      fromAutocomplete.addListener('place_changed', () => {
        const place = fromAutocomplete.getPlace();
        setFromAddress(place.formatted_address);
      });

      const toAutocomplete = new window.google.maps.places.Autocomplete(toInputRef.current);
      toAutocomplete.setFields(['formatted_address', 'geometry']);
      toAutocomplete.addListener('place_changed', () => {
        const place = toAutocomplete.getPlace();
        setToAirport(place.formatted_address);
      });
    });
  }, [apiKey]);

  useEffect(() => {
    if (fromAddress && toAirport) {
      if (!window.google) return;
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [fromAddress],
          destinations: [toAirport],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            const distanceMeters = response.rows[0].elements[0].distance.value;
            const km = distanceMeters / 1000;
            setDistanceKm(km);
            setPrice(km * KILOMETER_PRICE);
          }
        }
      );
    }
  }, [fromAddress, toAirport]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) {
      onNext({ fromAddress, toAirport, departure, passengers, tripType, distanceKm, price });
    }
  };

  return (
    <div className="booking-step-one">
      <h1>Willkommen zur Nexo-App</h1>
      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Abholadresse
          <input type="text" ref={fromInputRef} placeholder="Abholadresse" required />
        </label>
        <label>
          Zielflughafen
          <input type="text" ref={toInputRef} placeholder="Flughafen" required />
        </label>
        <label>
          Datum & Uhrzeit der Abfahrt
          <input type="datetime-local" value={departure} onChange={(e) => setDeparture(e.target.value)} required />
        </label>
        <label>
          Anzahl der Personen
          <input type="number" min="1" max="8" value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value, 10))} />
        </label>
        <div className="trip-type">
          <label>
            <input type="radio" value="oneway" checked={tripType === 'oneway'} onChange={() => setTripType('oneway')} /> Nur Hinfahrt
          </label>
          <label>
            <input type="radio" value="roundtrip" checked={tripType === 'roundtrip'} onChange={() => setTripType('roundtrip')} /> Hin- und Rückfahrt
          </label>
        </div>
        {distanceKm != null && (
          <div className="price-display">
            Distanz: {distanceKm.toFixed(2)} km – Preis: {price.toFixed(2)} €
          </div>
        )}
        <button type="submit" className="next-button" disabled={distanceKm == null}>Weiter</button>
      </form>
    </div>
  );
};

export default BookingStepOne;
