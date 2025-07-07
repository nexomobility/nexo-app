import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="welcome-container">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Willkommen zur Nexo-App</h1>
        <p>Starte deine Reise mit uns.</p>
        <button className="get-started">Los geht's</button>
      </div>
    </div>
  );
}

export default App;
