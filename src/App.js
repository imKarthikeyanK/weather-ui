import React from 'react';
import './App.css';
import Home from './components';

/*
Change base API URL at /service/weatherService.js before running app
*/

function App() {
  return (
    <div className="App fade-effect">
      <header className="App-header">
        <Home />
      </header>
    </div>
  );
}

export default App;
