export const KILOMETER_PRICE = 1.25; // Euro per km netto

export function calculateDistanceAndPrice(fromAddress, toAirport) {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Maps API not loaded'));
      return;
    }
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
          const price = km * KILOMETER_PRICE * 1.19; // including VAT
          resolve({ distanceKm: km, price });
        } else {
          reject(new Error(status));
        }
      }
    );
  });
}
