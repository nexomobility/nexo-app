import './App.css';
import BookingStepOne from './components/BookingStepOne';
// Willkommen zur Nexo-App

function App() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="App">
      <BookingStepOne apiKey="AIzaSyBw_MiOfkc-lQ_YSG5jKNM9lEaR8nbKSNg" />
    </div>
  );
}

export default App;
