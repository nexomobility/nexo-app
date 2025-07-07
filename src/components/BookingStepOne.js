import React, { useEffect, useRef, useState } from 'react';
import './BookingStepOne.css';

const KILOMETER_PRICE = 1.25; // Euro per km netto

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
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [tripType, setTripType] = useState('oneway');
  const [distanceKm, setDistanceKm] = useState(null);
  const [price, setPrice] = useState(null);
  const [calculated, setCalculated] = useState(false);

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
    setDistanceKm(null);
    setCalculated(false);
    setPrice(null);
  }, [fromAddress, toAirport]);

  const calculateDistance = () => {
    if (!fromAddress || !toAirport) return;
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
        }
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) {
      onNext({
        fromAddress,
        toAirport,
        departureDate,
        departureTime,
        passengers,
        luggage,
        tripType,
        distanceKm,
        price,
      });
    }
  };

  return (
    <div className="booking-step-one bg-white text-black min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold mb-4">Willkommen zur Nexo-App</h1>
      <form onSubmit={handleSubmit} className="booking-form flex flex-col gap-4 w-full max-w-md">
        <div className="trip-type flex justify-around mb-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="oneway"
              checked={tripType === 'oneway'}
              onChange={() => setTripType('oneway')}
            />
            Nur Hinfahrt
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="return"
              checked={tripType === 'return'}
              onChange={() => setTripType('return')}
            />
            Nur Rückfahrt
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="roundtrip"
              checked={tripType === 'roundtrip'}
              onChange={() => setTripType('roundtrip')}
            />
            Hin- und Rückfahrt
          </label>
        </div>
        <label className="flex flex-col text-left text-sm">
          Abholadresse
          <input type="text" ref={fromInputRef} placeholder="Abholadresse" required className="p-2 border border-gray-400 rounded" />
        </label>
        <label className="flex flex-col text-left text-sm">
          Zielflughafen
          <input type="text" ref={toInputRef} placeholder="Flughafen" required className="p-2 border border-gray-400 rounded" />
        </label>
        <div className="datetime-group flex gap-4">
          <label className="flex flex-col text-left text-sm flex-1">
            Datum der Abfahrt
            <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required className="p-2 border border-gray-400 rounded" />
          </label>
          <label className="flex flex-col text-left text-sm flex-1">
            Uhrzeit der Abfahrt
            <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required className="p-2 border border-gray-400 rounded" />
          </label>
        </div>
        <label className="flex flex-col text-left text-sm">
          Anzahl der Personen
          <input
            type="number"
            min="1"
            max="8"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
            className="p-2 border border-gray-400 rounded"
          />
        </label>
        <label className="flex flex-col text-left text-sm">
          Anzahl Gepäckstücke
          <input
            type="number"
            min="0"
            max="8"
            value={luggage}
            onChange={(e) => setLuggage(parseInt(e.target.value, 10))}
            className="p-2 border border-gray-400 rounded"
          />
        </label>
        {fromAddress && toAirport && distanceKm == null && (
          <button
            type="button"
            className="distance-button"
            onClick={calculateDistance}
          >
            Strecke berechnen
          </button>
        )}
        {distanceKm != null && (
          <div className="price-display font-semibold mt-4">Distanz: {distanceKm.toFixed(2)} km</div>
        )}

        {distanceKm != null && !calculated && (
          <button
            type="button"
            className="calculate-button"
            onClick={() => {
              const brutto = distanceKm * KILOMETER_PRICE * 1.19;
              setPrice(brutto);
              setCalculated(true);
            }}
          >
            Fahrpreis berechnen
          </button>
        )}

        {calculated && price != null && (
          <div className="price-display fade show">Preis: {price.toFixed(2)} €</div>
        )}

        {calculated && (
          <button type="submit" className="next-button">Weiter</button>
        )}
      </form>
    </div>
  );
};

export default BookingStepOne;
